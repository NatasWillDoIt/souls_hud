-- Multi-Framework HUD: Client-side main script

-- At the top of the file, add these lines to make the functions globally accessible
InitializeHUD = nil
SavePlayerStatus = nil

-- Load the appropriate framework
local Framework = nil
local frameworkLoaded = false
local PlayerData = {}
local showHUD = true
local isConfigOpen = false
local hudSettings = {}
local statusSavingInterval = Config.StatusSaveInterval or 60000
local inVehicle = false

-- Default HUD settings with bottom left positioning
local defaultSettings = {
  elements = {
      health = { position = { x = 0.01, y = 0.97 }, visible = true, color = "#ff0033", size = 1.0 },
      armor = { position = { x = 0.01, y = 0.94 }, visible = true, color = "#00f3ff", size = 1.0 },
      hunger = { position = { x = 0.01, y = 0.91 }, visible = true, color = "#ffff00", size = 1.0 },
      thirst = { position = { x = 0.01, y = 0.88 }, visible = true, color = "#00f3ff", size = 1.0 },
      stamina = { position = { x = 0.01, y = 0.85 }, visible = true, color = "#00ff66", size = 1.0 },
      oxygen = { position = { x = 0.01, y = 0.82 }, visible = true, color = "#ffffff", size = 1.0 },
      stress = { position = { x = 0.01, y = 0.79 }, visible = true, color = "#ff00ff", size = 1.0 },
      voice = { position = { x = 0.01, y = 0.76 }, visible = true, color = "#ffff00", size = 1.0 },
      minimap = { position = { x = 0.01, y = 0.01 }, visible = true, size = 1.0 },
      -- Vehicle elements positioned in bottom left when visible
      speedometer = { position = { x = 0.01, y = 0.73 }, visible = true, color = "#00f3ff", size = 1.0 },
      fuel = { position = { x = 0.01, y = 0.70 }, visible = true, color = "#00ff66", size = 1.0 },
  },
  general = {
      backgroundColor = "rgba(10, 10, 10, 0.7)",
      borderColor = "rgba(0, 243, 255, 0.5)",
      borderWidth = 1,
      borderRadius = 2,
      fontColor = "#ffffff",
      fontSize = 14,
  }
}

-- Load framework
CreateThread(function()
  if Config.Framework == 'qbx' then
      Framework = exports['qb-core']:GetCoreObject()
      frameworkLoaded = true
  elseif Config.Framework == 'qb' then
      Framework = exports['qb-core']:GetCoreObject()
      frameworkLoaded = true
  elseif Config.Framework == 'esx' then
      while not ESX do
          TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
          Wait(10)
      end
      Framework = ESX
      frameworkLoaded = true
  else
      print('Invalid framework specified in config.lua! Valid options: qbx, qb, esx')
  end
end)

-- Make sure Framework is loaded before using it in any function
function EnsureFrameworkLoaded()
  if not frameworkLoaded then
      if Config.Framework == 'qbx' then
          Framework = exports['qbx-core']:GetCoreObject()
          frameworkLoaded = true
      elseif Config.Framework == 'qb' then
          Framework = exports['qb-core']:GetCoreObject()
          frameworkLoaded = true
      elseif Config.Framework == 'esx' then
          TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
          Framework = ESX
          frameworkLoaded = true
      end
  end
  return Framework ~= nil
end

-- Hide default HUD components
local function HideDefaultHUD()
  -- Hide health and armor bars
  DisplayRadar(false) -- Hide minimap
  
  -- Hide HUD components
  local components = {
      1, -- WANTED_STARS
      2, -- WEAPON_ICON
      3, -- CASH
      4, -- MP_CASH
      6, -- VEHICLE_NAME
      7, -- AREA_NAME
      8, -- VEHICLE_CLASS
      9, -- STREET_NAME
      13, -- CASH_CHANGE
      17, -- SAVING_GAME
      20, -- WEAPON_WHEEL
      21, -- WEAPON_WHEEL_STATS
      22, -- HUD_COMPONENTS
      25, -- HUD_WEAPONS
  }
  
  for _, component in ipairs(components) do
      HideHudComponentThisFrame(component)
  end
  
  -- Hide health and armor bars specifically
  HideHudComponentThisFrame(7) -- Area name
  HideHudComponentThisFrame(9) -- Street name
  HideHudComponentThisFrame(3) -- Cash
  HideHudComponentThisFrame(4) -- MP Cash
  HideHudComponentThisFrame(13) -- Cash changes
  
  -- Hide the health and armor bars
  DisableControlAction(0, 20, true) -- Disable Z (stats)
  
  -- Hide radar/minimap
  DisplayRadar(false)
end

-- Initialize HUD settings
function InitializeHUD()
  -- Ensure framework is loaded
  if not EnsureFrameworkLoaded() then
      -- If framework isn't loaded, try again in a moment
      SetTimeout(500, InitializeHUD)
      return
  end
  
  -- Get player data
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      PlayerData = Framework.Functions.GetPlayerData()
  elseif Config.Framework == 'esx' then
      PlayerData = Framework.GetPlayerData()
  end
  
  -- Load HUD settings
  TriggerCallback('hud:server:GetSettings', function(settings, status)
      if settings then
          hudSettings = settings
      else
          hudSettings = defaultSettings
          TriggerServerEvent('hud:server:SaveSettings', hudSettings)
      end
      
      -- Load player status from database
      if status then
          TriggerServerEvent('hud:server:UpdateStatus', status)
      end
      
      SendNUIMessage({
          action = 'updateSettings',
          settings = hudSettings
      })
  end)
  
  -- Start status saving loop
  StartStatusSavingLoop()
end

-- Framework-specific trigger callback
function TriggerCallback(name, cb)
  if not EnsureFrameworkLoaded() then
      -- If framework isn't loaded, try again in a moment
      SetTimeout(500, function() TriggerCallback(name, cb) end)
      return
  end
  
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      Framework.Functions.TriggerCallback(name, cb)
  elseif Config.Framework == 'esx' then
      Framework.TriggerServerCallback(name, cb)
  end
end

-- Save HUD settings
RegisterNUICallback('saveSettings', function(data, cb)
    hudSettings = data.settings
    TriggerServerEvent('hud:server:SaveSettings', hudSettings)
    isConfigOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Reset HUD settings to default
RegisterNUICallback('resetSettings', function(_, cb)
    hudSettings = defaultSettings
    TriggerServerEvent('hud:server:SaveSettings', hudSettings)
    SendNUIMessage({
        action = 'updateSettings',
        settings = hudSettings
    })
    cb('ok')
end)

-- Toggle HUD visibility
RegisterCommand(Config.ToggleCommand, function()
    showHUD = not showHUD
    SendNUIMessage({
        action = 'toggleHUD',
        show = showHUD
    })
    -- Notify player based on framework
    if Config.Framework == 'qbx' or Config.Framework == 'qb' then
        Framework.Functions.Notify(showHUD and 'HUD visible' or 'HUD hidden', 'info')
    elseif Config.Framework == 'esx' then
        Framework.ShowNotification(showHUD and 'HUD visible' or 'HUD hidden')
    end
end, false)

-- Open HUD configuration menu
RegisterCommand(Config.SettingsCommand, function()
    if not isConfigOpen then
        isConfigOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage({
            action = 'openConfig',
            settings = hudSettings
        })
    end
end, false)

-- Close HUD configuration menu
RegisterNUICallback('closeConfig', function(_, cb)
  isConfigOpen = false
  SetNuiFocus(false, false)
  cb('ok')
end)

-- Add this to handle escape key and other closing methods
RegisterNUICallback('cancelSettings', function(_, cb)
  isConfigOpen = false
  SetNuiFocus(false, false)
  cb('ok')
end)

-- Save player status
function SavePlayerStatus()
  -- Ensure framework is loaded
  if not EnsureFrameworkLoaded() then
      -- If framework isn't loaded, try again in a moment
      SetTimeout(500, SavePlayerStatus)
      return
  end
  
  local player = PlayerPedId()
  local health = GetEntityHealth(player) - 100
  local armor = GetPedArmour(player)
  local oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10
  local stamina = 100 - GetPlayerSprintStaminaRemaining(PlayerId())
  
  -- Get player data for hunger, thirst, and stress based on framework
  local hunger, thirst, stress = 100, 100, 0
  
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      local playerData = Framework.Functions.GetPlayerData()
      hunger = playerData.metadata.hunger or 100
      thirst = playerData.metadata.thirst or 100
      stress = playerData.metadata.stress or 0
  elseif Config.Framework == 'esx' then
      -- ESX uses status values from 0 to 1,000,000
      TriggerEvent('esx_status:getStatus', 'hunger', function(status)
          if status then hunger = status.getPercent() end
      end)
      
      TriggerEvent('esx_status:getStatus', 'thirst', function(status)
          if status then thirst = status.getPercent() end
      end)
      
      -- ESX might not have stress by default
      TriggerEvent('esx_status:getStatus', 'stress', function(status)
          if status then stress = status.getPercent() end
      end)
  end
  
  local status = {
      health = health,
      armor = armor,
      hunger = hunger,
      thirst = thirst,
      stamina = stamina,
      oxygen = oxygen,
      stress = stress
  }
  
  TriggerServerEvent('hud:server:SaveStatus', status)
end

-- Save player status to database periodically
function StartStatusSavingLoop()
    CreateThread(function()
        while true do
            if PlayerData.identifier or PlayerData.citizenid then
                SavePlayerStatus()
            end
            Wait(statusSavingInterval)
        end
    end)
end

-- Check if player is in vehicle
function CheckVehicleStatus()
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)
    local wasInVehicle = inVehicle
    
    inVehicle = vehicle ~= 0
    
    -- If vehicle status changed, update UI
    if wasInVehicle ~= inVehicle then
        SendNUIMessage({
            action = 'setVehicleState',
            inVehicle = inVehicle
        })
    end
    
    return inVehicle, vehicle
end

-- Update HUD data
CreateThread(function()
    -- Wait for framework to be loaded
    while not frameworkLoaded do
        Wait(500)
    end
    
    while true do
        if showHUD then
            local player = PlayerPedId()
            local health = GetEntityHealth(player) - 100
            local armor = GetPedArmour(player)
            local oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10
            local stamina = 100 - GetPlayerSprintStaminaRemaining(PlayerId())
            
            -- Get player data for hunger, thirst, and stress based on framework
            local hunger, thirst, stress = 100, 100, 0
            
            if Config.Framework == 'qbx' or Config.Framework == 'qb' then
                local playerData = Framework.Functions.GetPlayerData()
                hunger = playerData.metadata.hunger or 100
                thirst = playerData.metadata.thirst or 100
                stress = playerData.metadata.stress or 0
            elseif Config.Framework == 'esx' then
                -- ESX uses status values from 0 to 1,000,000
                TriggerEvent('esx_status:getStatus', 'hunger', function(status)
                    if status then hunger = status.getPercent() end
                end)
                
                TriggerEvent('esx_status:getStatus', 'thirst', function(status)
                    if status then thirst = status.getPercent() end
                end)
                
                -- ESX might not have stress by default
                TriggerEvent('esx_status:getStatus', 'stress', function(status)
                    if status then stress = status.getPercent() end
                end)
            end
            
            -- Voice data
            local talking = NetworkIsPlayerTalking(PlayerId())
            local voiceMode = 2 -- Default to normal voice range
            
            -- Get voice range based on available voice resources
            if Config.Framework == 'qbx' or Config.Framework == 'qb' then
                -- For QBX/QB, check for pma-voice or mumble-voip
                if exports["pma-voice"] then
                    voiceMode = exports["pma-voice"]:getRadioVolume() or 2
                elseif exports["mumble-voip"] then
                    voiceMode = MumbleGetTalkerProximity() or 2
                end
            elseif Config.Framework == 'esx' then
                -- For ESX, check for various voice integrations
                if exports["pma-voice"] then
                    voiceMode = exports["pma-voice"]:getRadioVolume() or 2
                elseif exports["mumble-voip"] then
                    voiceMode = MumbleGetTalkerProximity() or 2
                elseif exports["saltychat"] then
                    -- SaltyChat doesn't have a direct getter for voice range
                    voiceMode = 2
                end
            end
            
            -- Check if player is in vehicle
            local isInVehicle, vehicle = CheckVehicleStatus()
            
            -- Vehicle data
            local speed = 0
            local fuel = 0
            local engineHealth = 0
            
            if isInVehicle then
                speed = math.floor(GetEntitySpeed(vehicle) * 3.6) -- Convert to km/h
                
                -- Get fuel based on available resources
                if Config.Framework == 'qbx' then
                    fuel = GetVehicleFuelLevel(vehicle)
                elseif Config.Framework == 'qb' then
                    fuel = exports['LegacyFuel'] and exports['LegacyFuel']:GetFuel(vehicle) or GetVehicleFuelLevel(vehicle)
                elseif Config.Framework == 'esx' then
                    fuel = exports['LegacyFuel'] and exports['LegacyFuel']:GetFuel(vehicle) or GetVehicleFuelLevel(vehicle)
                    if not fuel then
                        -- Fallback for ESX vehicles
                        fuel = GetVehicleFuelLevel(vehicle)
                    end
                end
                
                engineHealth = GetVehicleEngineHealth(vehicle) / 10
            end
            
            SendNUIMessage({
                action = 'updateHUD',
                data = {
                    health = health,
                    armor = armor,
                    hunger = hunger,
                    thirst = thirst,
                    stamina = stamina,
                    oxygen = oxygen,
                    stress = stress,
                    voice = {
                        talking = talking,
                        mode = voiceMode
                    },
                    vehicle = {
                        speed = speed,
                        fuel = fuel,
                        engineHealth = engineHealth,
                        inVehicle = isInVehicle
                    }
                }
            })
        end
        Wait(Config.RefreshRate or 200) -- Update HUD every refresh rate ms
    end
end)

-- Hide default HUD components
CreateThread(function()
    while true do
        if showHUD and Config.HideDefaultHUD then
            HideDefaultHUD()
        end
        Wait(0)
    end
end)

-- Register keybindings
RegisterKeyMapping(Config.SettingsCommand, 'Open HUD Settings', 'keyboard', Config.DefaultKeys.settings)
RegisterKeyMapping(Config.ToggleCommand, 'Toggle HUD Visibility', 'keyboard', Config.DefaultKeys.toggle)

-- Initialize NUI
AddEventHandler('onResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        SendNUIMessage({
            action = 'init'
        })
    end
end)

-- Handle player death
AddEventHandler('baseevents:onPlayerDied', function()
    local status = {
        health = 0,
        armor = 0,
        hunger = 100,
        thirst = 100,
        stamina = 100,
        oxygen = 100,
        stress = 0
    }
    
    -- Get current hunger/thirst/stress based on framework
    if Config.Framework == 'qbx' or Config.Framework == 'qb' then
        local playerData = Framework.Functions.GetPlayerData()
        status.hunger = playerData.metadata.hunger or 100
        status.thirst = playerData.metadata.thirst or 100
        status.stress = playerData.metadata.stress or 0
    elseif Config.Framework == 'esx' then
        TriggerEvent('esx_status:getStatus', 'hunger', function(stat) if stat then status.hunger = stat.getPercent() end end)
        TriggerEvent('esx_status:getStatus', 'thirst', function(stat) if stat then status.thirst = stat.getPercent() end end)
        TriggerEvent('esx_status:getStatus', 'stress', function(stat) if stat then status.stress = stat.getPercent() end end)
    end
    TriggerServerEvent('hud:server:SaveStatus', status)
end)