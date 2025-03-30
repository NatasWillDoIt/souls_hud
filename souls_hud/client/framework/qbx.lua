-- QBX-specific client functions
if Config.Framework == 'qbx' then
    -- Wait for the main script to define the functions
    CreateThread(function()
        while not InitializeHUD do
            Wait(100)
        end
        
        -- Load events specific to QBX
        RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
            InitializeHUD()
        end)
        
        RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
            SavePlayerStatus()
        end)
    end)
    
    -- Get player status for QBX
    function GetPlayerStatus()
        local playerData = QBX.Functions.GetPlayerData()
        return {
            hunger = playerData.metadata.hunger or 100,
            thirst = playerData.metadata.thirst or 100,
            stress = playerData.metadata.stress or 0
        }
    end
end

