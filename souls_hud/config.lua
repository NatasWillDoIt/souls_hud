Config = {}

-- Framework selection (options: 'qbx', 'qb', 'esx')
Config.Framework = 'qbx'

-- Default command to open HUD settings
Config.SettingsCommand = 'hudsettings'

-- Default command to toggle HUD visibility
Config.ToggleCommand = 'togglehud'

-- Default keybindings
Config.DefaultKeys = {
  settings = 'F7',
  toggle = 'F6'
}

-- Default HUD refresh rate (in ms)
Config.RefreshRate = 200

-- Status saving interval (in ms)
Config.StatusSaveInterval = 60000 -- Save every minute

-- Enable/disable specific HUD elements by default
Config.DefaultElements = {
  health = true,
  armor = true,
  hunger = true,
  thirst = true,
  stamina = true,
  oxygen = true,
  stress = true,
  voice = true,
  speedometer = true,
  fuel = true
}

-- Default HUD appearance - Cyberpunk Theme
Config.DefaultAppearance = {
  backgroundColor = "rgba(10, 10, 10, 0.7)",
  borderColor = "rgba(0, 243, 255, 0.5)",
  borderWidth = 1,
  borderRadius = 2,
  fontColor = "#ffffff",
  fontSize = 14
}

-- Hide default GTA HUD elements
Config.HideDefaultHUD = true
Config.HideDefaultRadar = true
Config.HideDefaultHealth = true
Config.HideDefaultArmor = true

-- Database table name (used for player status)
Config.StatusTable = 'player_hud_status'

