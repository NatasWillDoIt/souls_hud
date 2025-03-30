-- ESX-specific client functions
if Config.Framework == 'esx' then
    -- Get the ESX object
    ESX = nil
    Citizen.CreateThread(function()
        while ESX == nil do
            TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
            Citizen.Wait(0)
        end
        
        -- Wait for the main script to define the functions
        while not InitializeHUD do
            Wait(100)
        end
        
        -- Load events specific to ESX
        RegisterNetEvent('esx:playerLoaded', function(xPlayer)
            InitializeHUD()
        end)
        
        RegisterNetEvent('esx:onPlayerLogout', function()
            SavePlayerStatus()
        end)
    end)
    
    -- Get player status for ESX (which uses esx_status)
    function GetPlayerStatus()
        local status = {
            hunger = 100,
            thirst = 100,
            stress = 0
        }
        
        -- ESX uses status values from 0 to 1,000,000
        TriggerEvent('esx_status:getStatus', 'hunger', function(stat)
            if stat then status.hunger = stat.getPercent() end
        end)
        
        TriggerEvent('esx_status:getStatus', 'thirst', function(stat)
            if stat then status.thirst = stat.getPercent() end
        end)
        
        -- ESX might not have stress by default
        TriggerEvent('esx_status:getStatus', 'stress', function(stat)
            if stat then status.stress = stat.getPercent() end
        end)
        
        return status
    end
end

