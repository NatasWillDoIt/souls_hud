-- Multi-Framework HUD: Server-side script

-- At the beginning of the file, make sure Framework is initialized properly
Framework = nil
local frameworkLoaded = false

-- Function to load the framework
function LoadFramework()
  if Config.Framework == 'qbx' then
      Framework = exports['qbx-core']:GetCoreObject()
      frameworkLoaded = true
  elseif Config.Framework == 'qb' then
      Framework = exports['qb-core']:GetCoreObject()
      frameworkLoaded = true
  elseif Config.Framework == 'esx' then
      Framework = exports['es_extended']:getSharedObject()
      frameworkLoaded = true
  else
      print('Invalid framework specified in config.lua! Valid options: qbx, qb, esx')
  end
end

-- Set up database
CreateThread(function()
  -- Load selected framework
  LoadFramework()
  
  -- Wait for framework to be loaded before proceeding
  while not frameworkLoaded do
      Wait(500)
  end

  -- Create database table if it doesn't exist
  local result = MySQL.query.await("SHOW TABLES LIKE '" .. Config.StatusTable .. "'")
  if result == nil or #result == 0 then
      MySQL.query.await([[
          CREATE TABLE `]] .. Config.StatusTable .. [[` (
              `identifier` varchar(50) NOT NULL,
              `health` int(11) DEFAULT 100,
              `armor` int(11) DEFAULT 0,
              `hunger` int(11) DEFAULT 100,
              `thirst` int(11) DEFAULT 100,
              `stamina` int(11) DEFAULT 100,
              `oxygen` int(11) DEFAULT 100,
              `stress` int(11) DEFAULT 0,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`identifier`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      ]])
      print('Created ' .. Config.StatusTable .. ' table')
  end
end)

-- Make sure Framework is loaded before using it in any function
function EnsureFrameworkLoaded()
  if not frameworkLoaded then
      LoadFramework()
      while not frameworkLoaded do
          Wait(100)
      end
  end
  return Framework ~= nil
end

-- Save player HUD settings
RegisterNetEvent('hud:server:SaveSettings', function(settings)
  local src = source
  
  if not EnsureFrameworkLoaded() then return end
  
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      local Player = Framework.Functions.GetPlayer(src)
      if Player then
          Player.Functions.SetMetaData('hudSettings', settings)
      end
  elseif Config.Framework == 'esx' then
      local xPlayer = Framework.GetPlayerFromId(src)
      if xPlayer then
          -- ESX doesn't have metadata by default, so we'll store it in a separate table
          MySQL.query.await('INSERT INTO player_hud_settings (identifier, settings) VALUES (?, ?) ON DUPLICATE KEY UPDATE settings = ?', {
              xPlayer.getIdentifier(), json.encode(settings), json.encode(settings)
          })
      end
  end
end)

-- Get player identifier based on framework
function GetPlayerIdentifier(src)
  if not EnsureFrameworkLoaded() then return nil end
  
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      local Player = Framework.Functions.GetPlayer(src)
      if Player then
          return Player.PlayerData.citizenid
      end
  elseif Config.Framework == 'esx' then
      local xPlayer = Framework.GetPlayerFromId(src)
      if xPlayer then
          return xPlayer.getIdentifier()
      end
  end
  return nil
end

-- Save player status to database
RegisterNetEvent('hud:server:SaveStatus', function(status)
  local src = source
  local identifier = GetPlayerIdentifier(src)
  
  if not identifier or not EnsureFrameworkLoaded() then return end
  
  -- Update player metadata based on framework
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      local Player = Framework.Functions.GetPlayer(src)
      if Player then
          Player.Functions.SetMetaData('hunger', status.hunger)
          Player.Functions.SetMetaData('thirst', status.thirst)
          Player.Functions.SetMetaData('stress', status.stress)
      end
  elseif Config.Framework == 'esx' then
      local xPlayer = Framework.GetPlayerFromId(src)
      if xPlayer then
          TriggerClientEvent('esx_status:set', src, 'hunger', status.hunger * 10000)
          TriggerClientEvent('esx_status:set', src, 'thirst', status.thirst * 10000)
          -- ESX might not have stress by default
          if status.stress then
              TriggerClientEvent('esx_status:set', src, 'stress', status.stress * 10000)
          end
      end
  end
  
  -- Save to database
  MySQL.query('INSERT INTO ' .. Config.StatusTable .. ' (identifier, health, armor, hunger, thirst, stamina, oxygen, stress) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE health = ?, armor = ?, hunger = ?, thirst = ?, stamina = ?, oxygen = ?, stress = ?', {
      identifier, status.health, status.armor, status.hunger, status.thirst, status.stamina, status.oxygen, status.stress,
      status.health, status.armor, status.hunger, status.thirst, status.stamina, status.oxygen, status.stress
  })
end)

-- Update player status from database values
RegisterNetEvent('hud:server:UpdateStatus', function(status)
  local src = source
  
  if not EnsureFrameworkLoaded() then return end
  
  if Config.Framework == 'qbx' or Config.Framework == 'qb' then
      local Player = Framework.Functions.GetPlayer(src)
      if Player and status then
          -- Update player metadata
          Player.Functions.SetMetaData('hunger', status.hunger)
          Player.Functions.SetMetaData('thirst', status.thirst)
          Player.Functions.SetMetaData('stress', status.stress)
          
          -- If health is 0, set to 100 (player will be respawned)
          if status.health <= 0 then
              status.health = 100
              status.armor = 0
          end
          
          -- Set player health and armor
          local ped = GetPlayerPed(src)
          SetEntityHealth(ped, status.health + 100)
          SetPedArmour(ped, status.armor)
      end
  elseif Config.Framework == 'esx' then
      local xPlayer = Framework.GetPlayerFromId(src)
      if xPlayer and status then
          -- Update ESX status
          TriggerClientEvent('esx_status:set', src, 'hunger', status.hunger * 10000)
          TriggerClientEvent('esx_status:set', src, 'thirst', status.thirst * 10000)
          
          -- ESX might not have stress by default
          if status.stress then
              TriggerClientEvent('esx_status:set', src, 'stress', status.stress * 10000)
          end
          
          -- If health is 0, set to 100 (player will be respawned)
          if status.health <= 0 then
              status.health = 100
              status.armor = 0
          end
          
          -- Set player health and armor
          local ped = GetPlayerPed(src)
          SetEntityHealth(ped, status.health + 100)
          SetPedArmour(ped, status.armor)
      end
  end
end)

-- Load player HUD settings and status
RegisterCallback = function(name, cb)
  if not EnsureFrameworkLoaded() then return end
  
  if Config.Framework == 'qbx' then
      Framework.Functions.CreateCallback(name, cb)
  elseif Config.Framework == 'qb' then
      Framework.Functions.CreateCallback(name, cb)
  elseif Config.Framework == 'esx' then
      Framework.RegisterServerCallback(name, cb)
  end
end

RegisterCallback('hud:server:GetSettings', function(source, cb)
  local src = source
  local identifier = GetPlayerIdentifier(src)
  local settings = nil
  
  if identifier then
      if Config.Framework == 'qbx' or Config.Framework == 'qb' then
          local Player = Framework.Functions.GetPlayer(src)
          if Player then
              settings = Player.PlayerData.metadata.hudSettings
          end
      elseif Config.Framework == 'esx' then
          -- For ESX, fetch settings from a separate table
          local result = MySQL.query.await('SELECT settings FROM player_hud_settings WHERE identifier = ?', {identifier})
          if result and result[1] then
              settings = json.decode(result[1].settings)
          end
      end
      
      -- Get status from database
      MySQL.query('SELECT * FROM ' .. Config.StatusTable .. ' WHERE identifier = ?', {identifier}, function(result)
          local status = nil
          if result and result[1] then
              status = {
                  health = result[1].health,
                  armor = result[1].armor,
                  hunger = result[1].hunger,
                  thirst = result[1].thirst,
                  stamina = result[1].stamina,
                  oxygen = result[1].oxygen,
                  stress = result[1].stress
              }
          end
          
          cb(settings, status)
      end)
  else
      cb(nil, nil)
  end
end)

-- Create the player_hud_settings table for ESX
CreateThread(function()
  if Config.Framework == 'esx' then
      local result = MySQL.query.await("SHOW TABLES LIKE 'player_hud_settings'")
      if result == nil or #result == 0 then
          MySQL.query.await([[
              CREATE TABLE `player_hud_settings` (
                  `identifier` varchar(50) NOT NULL,
                  `settings` longtext NOT NULL,
                  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (`identifier`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
          ]])
          print('Created player_hud_settings table for ESX')
      end
  end
end)

