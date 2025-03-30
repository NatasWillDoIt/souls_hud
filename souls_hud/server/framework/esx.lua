-- ESX-specific functions
if Config.Framework == 'esx' then
    -- Get the ESX object
    ESX = nil
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    
    -- Register callback for ESX
    ESX.RegisterServerCallback('hud:server:GetPlayerStats', function(source, cb)
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            -- ESX doesn't store hunger/thirst in player data by default
            -- It uses esx_status for these values
            -- We'll just return empty values and let the client side handle it
            cb({hunger = nil, thirst = nil, stress = nil})
        else
            cb({hunger = 100, thirst = 100, stress = 0})
        end
    end)
end

