-- QB-specific functions
if Config.Framework == 'qb' then
    -- QB-specific callback for getting player data
    QBCore = exports['qb-core']:GetCoreObject()
    
    -- Register callback for QB Core
    QBCore.Functions.CreateCallback('hud:server:GetPlayerStats', function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        if Player then
            local stats = {
                hunger = Player.PlayerData.metadata.hunger or 100,
                thirst = Player.PlayerData.metadata.thirst or 100,
                stress = Player.PlayerData.metadata.stress or 0
            }
            cb(stats)
        else
            cb({hunger = 100, thirst = 100, stress = 0})
        end
    end)
end

