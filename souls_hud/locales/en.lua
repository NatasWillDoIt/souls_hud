local Translations = {
  info = {
      hud_settings = "HUD Settings",
      hud_toggled_on = "HUD visible",
      hud_toggled_off = "HUD hidden",
      settings_saved = "HUD settings saved",
      settings_reset = "HUD settings reset to default",
      status_saved = "Status saved",
      status_loaded = "Status loaded",
  },
  commands = {
      toggle_hud = "Toggle HUD visibility",
      open_settings = "Open HUD settings",
  },
  settings = {
      elements = "Elements",
      appearance = "Appearance",
      presets = "Presets",
      save = "Save Settings",
      cancel = "Cancel",
      reset = "Reset to Default",
  },
  status = {
      health = "Health",
      armor = "Armor",
      hunger = "Hunger",
      thirst = "Thirst",
      stamina = "Stamina",
      oxygen = "Oxygen",
      stress = "Stress",
  }
}

if Config.Framework == 'qbx' then
    Lang = Lang or Locale:new({
        phrases = Translations,
        warnOnMissing = true
    })
elseif Config.Framework == 'qb' then
    Lang = Lang or Locale:new({
        phrases = Translations,
        warnOnMissing = true
    })
elseif Config.Framework == 'esx' then
    Locales = Locales or {}
    Locales['en'] = Translations
end

