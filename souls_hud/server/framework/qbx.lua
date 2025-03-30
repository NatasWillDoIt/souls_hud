-- QBX-specific functions
if Config.Framework == 'qbx' then
    -- QBX-specific callback for getting player data
    QBX = exports['qb-core']:GetCoreObject()
    
    -- Register callback for QBX
    QBX.Functions.CreateCallback('hud:server:GetPlayerStats', function(source, cb)
        local Player = QBX.Functions.GetPlayer(source)
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

