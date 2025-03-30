fx_version 'cerulean'
game 'gta5'

description 'Multi-Framework HUD - Customizable Player HUD with Status Tracking'
version '1.0.0'
author 'Your Name'

ui_page 'html/index.html'

shared_scripts {
  'config.lua'
}

client_scripts {
  'client/main.lua',
  'client/framework/*.lua'
}

server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/main.lua',
  'server/framework/*.lua'
}

files {
  'html/index.html',
  'html/styles.css',
  'html/script.js',
  'locales/*.lua'
}

lua54 'yes'

