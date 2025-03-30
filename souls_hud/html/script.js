// Cyberpunk HUD: Client-side JavaScript
let hudSettings = {}
let isDragging = false
let showHUD = true
let inVehicle = false
let configMode = false

// Cyberpunk-themed default settings
const defaultSettings = {
  elements: {
    health: { position: { x: 0.01, y: 0.97 }, visible: true, color: "#ff0033", size: 1.0 },
    armor: { position: { x: 0.01, y: 0.94 }, visible: true, color: "#00f3ff", size: 1.0 },
    hunger: { position: { x: 0.01, y: 0.91 }, visible: true, color: "#ffff00", size: 1.0 },
    thirst: { position: { x: 0.01, y: 0.88 }, visible: true, color: "#00f3ff", size: 1.0 },
    stamina: { position: { x: 0.01, y: 0.85 }, visible: true, color: "#00ff66", size: 1.0 },
    oxygen: { position: { x: 0.01, y: 0.82 }, visible: true, color: "#ffffff", size: 1.0 },
    stress: { position: { x: 0.01, y: 0.79 }, visible: true, color: "#ff00ff", size: 1.0 },
    voice: { position: { x: 0.01, y: 0.76 }, visible: true, color: "#ffff00", size: 1.0 },
    speedometer: { position: { x: 0.01, y: 0.73 }, visible: true, color: "#00f3ff", size: 1.0 },
    fuel: { position: { x: 0.01, y: 0.7 }, visible: true, color: "#00ff66", size: 1.0 },
  },
  general: {
    backgroundColor: "rgba(10, 10, 10, 0.7)",
    borderColor: "rgba(0, 243, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 2,
    fontColor: "#ffffff",
    fontSize: 14,
  },
}

// Element icons mapping
const elementIcons = {
  health: "fa-heart",
  armor: "fa-shield-alt",
  hunger: "fa-utensils",
  thirst: "fa-tint",
  stamina: "fa-running",
  oxygen: "fa-lungs",
  stress: "fa-brain",
  voice: "fa-microphone",
  speedometer: "fa-tachometer-alt",
  fuel: "fa-gas-pump",
}

// Vehicle elements
const vehicleElements = ["speedometer", "fuel"]

// Preset configurations
const presets = {
  default: defaultSettings,
  minimal: {
    elements: {
      health: { position: { x: 0.01, y: 0.97 }, visible: true, color: "#ff0033", size: 0.8 },
      armor: { position: { x: 0.01, y: 0.94 }, visible: true, color: "#00f3ff", size: 0.8 },
      hunger: { position: { x: 0.01, y: 0.91 }, visible: true, color: "#ffff00", size: 0.8 },
      thirst: { position: { x: 0.01, y: 0.88 }, visible: true, color: "#00f3ff", size: 0.8 },
      stamina: { position: { x: 0.01, y: 0.85 }, visible: false, color: "#00ff66", size: 0.8 },
      oxygen: { position: { x: 0.01, y: 0.82 }, visible: false, color: "#ffffff", size: 0.8 },
      stress: { position: { x: 0.01, y: 0.79 }, visible: false, color: "#ff00ff", size: 0.8 },
      voice: { position: { x: 0.01, y: 0.76 }, visible: true, color: "#ffff00", size: 0.8 },
      speedometer: { position: { x: 0.01, y: 0.73 }, visible: true, color: "#00f3ff", size: 0.8 },
      fuel: { position: { x: 0.01, y: 0.7 }, visible: true, color: "#00ff66", size: 0.8 },
    },
    general: {
      backgroundColor: "rgba(10, 10, 10, 0.5)",
      borderColor: "rgba(0, 243, 255, 0.3)",
      borderWidth: 1,
      borderRadius: 0,
      fontColor: "#ffffff",
      fontSize: 12,
    },
  },
  compact: {
    elements: {
      health: { position: { x: 0.01, y: 0.99 }, visible: true, color: "#ff0033", size: 0.7 },
      armor: { position: { x: 0.01, y: 0.96 }, visible: true, color: "#00f3ff", size: 0.7 },
      hunger: { position: { x: 0.01, y: 0.93 }, visible: true, color: "#ffff00", size: 0.7 },
      thirst: { position: { x: 0.01, y: 0.9 }, visible: true, color: "#00f3ff", size: 0.7 },
      stamina: { position: { x: 0.01, y: 0.87 }, visible: true, color: "#00ff66", size: 0.7 },
      oxygen: { position: { x: 0.01, y: 0.84 }, visible: true, color: "#ffffff", size: 0.7 },
      stress: { position: { x: 0.01, y: 0.81 }, visible: true, color: "#ff00ff", size: 0.7 },
      voice: { position: { x: 0.01, y: 0.78 }, visible: true, color: "#ffff00", size: 0.7 },
      speedometer: { position: { x: 0.01, y: 0.75 }, visible: true, color: "#00f3ff", size: 0.7 },
      fuel: { position: { x: 0.01, y: 0.72 }, visible: true, color: "#00ff66", size: 0.7 },
    },
    general: {
      backgroundColor: "rgba(10, 10, 10, 0.8)",
      borderColor: "rgba(0, 243, 255, 0.2)",
      borderWidth: 1,
      borderRadius: 0,
      fontColor: "#ffffff",
      fontSize: 12,
    },
  },
  bottomLeft: {
    elements: {
      health: { position: { x: 0.01, y: 0.97 }, visible: true, color: "#ff0033", size: 0.9 },
      armor: { position: { x: 0.01, y: 0.94 }, visible: true, color: "#00f3ff", size: 0.9 },
      hunger: { position: { x: 0.01, y: 0.91 }, visible: true, color: "#ffff00", size: 0.9 },
      thirst: { position: { x: 0.01, y: 0.88 }, visible: true, color: "#00f3ff", size: 0.9 },
      stamina: { position: { x: 0.01, y: 0.85 }, visible: true, color: "#00ff66", size: 0.9 },
      oxygen: { position: { x: 0.01, y: 0.82 }, visible: true, color: "#ffffff", size: 0.9 },
      stress: { position: { x: 0.01, y: 0.79 }, visible: true, color: "#ff00ff", size: 0.9 },
      voice: { position: { x: 0.01, y: 0.76 }, visible: true, color: "#ffff00", size: 0.9 },
      speedometer: { position: { x: 0.01, y: 0.73 }, visible: true, color: "#00f3ff", size: 0.9 },
      fuel: { position: { x: 0.01, y: 0.7 }, visible: true, color: "#00ff66", size: 0.9 },
    },
    general: {
      backgroundColor: "rgba(10, 10, 10, 0.7)",
      borderColor: "rgba(0, 243, 255, 0.5)",
      borderWidth: 1,
      borderRadius: 0,
      fontColor: "#ffffff",
      fontSize: 14,
    },
  },
}

// Ensure jQuery is loaded
if (typeof jQuery == "undefined") {
  console.error("jQuery is not loaded. Please ensure jQuery is included in your HTML.")
} else {
  // Initialize HUD
  $(document).ready(() => {
    // Set default settings
    hudSettings = JSON.parse(JSON.stringify(defaultSettings))
    applySettings()

    // Listen for NUI messages
    window.addEventListener("message", (event) => {
      const data = event.data

      switch (data.action) {
        case "init":
          // Initialize HUD
          break

        case "updateHUD":
          if (showHUD) {
            updateHUDData(data.data)
          }
          break

        case "toggleHUD":
          showHUD = data.show
          if (showHUD) {
            $("#hud-container").show()
          } else {
            $("#hud-container").hide()
          }
          break

        case "updateSettings":
          hudSettings = data.settings
          applySettings()
          break

        case "openConfig":
          hudSettings = data.settings
          openConfigMenu()
          break

        case "setVehicleState":
          inVehicle = data.inVehicle
          toggleVehicleHUD(inVehicle)
          break
      }
    })

    // Setup config menu
    setupConfigMenu()
  })

  // Toggle vehicle HUD elements
  function toggleVehicleHUD(show) {
    if (show) {
      $(".vehicle-element").show()
    } else {
      $(".vehicle-element").hide()
    }
  }

  // Update HUD data
  function updateHUDData(data) {
    // Update health
    $("#health .progress-bar").css("width", `${data.health}%`)
    $("#health .value").text(Math.floor(data.health))

    // Update armor
    $("#armor .progress-bar").css("width", `${data.armor}%`)
    $("#armor .value").text(Math.floor(data.armor))

    // Update hunger
    $("#hunger .progress-bar").css("width", `${data.hunger}%`)
    $("#hunger .value").text(Math.floor(data.hunger))

    // Update thirst
    $("#thirst .progress-bar").css("width", `${data.thirst}%`)
    $("#thirst .value").text(Math.floor(data.thirst))

    // Update stamina
    $("#stamina .progress-bar").css("width", `${data.stamina}%`)
    $("#stamina .value").text(Math.floor(data.stamina))

    // Update oxygen
    $("#oxygen .progress-bar").css("width", `${data.oxygen}%`)
    $("#oxygen .value").text(Math.floor(data.oxygen))

    // Update stress
    $("#stress .progress-bar").css("width", `${data.stress}%`)
    $("#stress .value").text(Math.floor(data.stress))

    // Update voice
    $(".voice-level").removeClass("active")
    if (data.voice.talking) {
      $(".voice-level").addClass("active")
    } else {
      for (let i = 0; i < data.voice.mode; i++) {
        $(`.voice-level-${i + 1}`).addClass("active")
      }
    }

    // Update vehicle data
    if (data.vehicle.inVehicle) {
      inVehicle = true
      toggleVehicleHUD(true)

      // Update speedometer
      $("#speedometer .progress-bar").css("width", `${(data.vehicle.speed / 200) * 100}%`)
      $("#speedometer .value").text(`${data.vehicle.speed} km/h`)

      // Update fuel
      $("#fuel .progress-bar").css("width", `${data.vehicle.fuel}%`)
      $("#fuel .value").text(Math.floor(data.vehicle.fuel))
    } else {
      inVehicle = false
      toggleVehicleHUD(false)
    }
  }

  // Apply HUD settings
  function applySettings() {
    // Apply general settings
    const general = hudSettings.general
    $(".hud-element").css({
      "background-color": general.backgroundColor,
      "border-color": general.borderColor,
      "border-width": `${general.borderWidth}px`,
      "border-radius": `${general.borderRadius}px`,
      color: general.fontColor,
      "font-size": `${general.fontSize}px`,
    })

    // Apply element-specific settings
    for (const [id, settings] of Object.entries(hudSettings.elements)) {
      const element = $(`#${id}`)

      // Position
      element.css({
        left: `${settings.position.x * 100}%`,
        bottom: `${settings.position.y * 100}%`,
        transform: `scale(${settings.size})`,
      })

      // Visibility
      if (settings.visible) {
        // For vehicle elements, only show if in vehicle
        if (vehicleElements.includes(id)) {
          if (inVehicle) {
            element.show()
          } else {
            element.hide()
          }
        } else {
          element.show()
        }
      } else {
        element.hide()
      }

      // Color
      element.find(".progress-bar").css({
        "background-color": settings.color,
        "box-shadow": `0 0 10px ${settings.color}`,
      })
    }

    // Mark vehicle elements with class
    for (const id of vehicleElements) {
      $(`#${id}`).addClass("vehicle-element")
    }

    // Hide vehicle elements if not in vehicle
    if (!inVehicle) {
      $(".vehicle-element").hide()
    }
  }

  // Open configuration menu
  function openConfigMenu() {
    configMode = true
    $("#hud-container").addClass("config-mode")
    $("#config-container").css("display", "flex")

    // Make HUD elements draggable
    $(".hud-element").draggable({
      containment: "parent",
      start: () => {
        isDragging = true
      },
      stop: function (event, ui) {
        isDragging = false

        // Update position in settings
        const id = $(this).attr("id")
        const position = {
          x: ui.position.left / $("#hud-container").width(),
          y: 1 - (ui.position.top + $(this).height()) / $("#hud-container").height(),
        }

        hudSettings.elements[id].position = position
      },
    })

    // Show all elements in config mode, including vehicle elements
    $(".hud-element").show()

    // Populate config menu with current settings
    populateConfigMenu()
  }

  // Close configuration menu
  function closeConfigMenu() {
    configMode = false
    $("#hud-container").removeClass("config-mode")
    $("#config-container").hide()

    // Disable draggable
    $(".hud-element").draggable("destroy")

    // Reapply settings to hide vehicle elements if not in vehicle
    applySettings()
  }

  // Setup configuration menu
  function setupConfigMenu() {
    // Tab switching
    $(".tab-button").click(function () {
      $(".tab-button").removeClass("active")
      $(this).addClass("active")

      const tabId = $(this).data("tab")
      $(".tab-content").removeClass("active")
      $(`#${tabId}-tab`).addClass("active")
    })

    // Close button
    $("#close-config").click(() => {
      closeConfigMenu()
      $.post("https://qbx-hud/closeConfig", {})
    })

    // Cancel button
    $("#cancel-settings").click(() => {
      closeConfigMenu()
      $.post("https://qbx-hud/cancelSettings", {})
    })

    // Save button
    $("#save-settings").click(() => {
      $.post("https://qbx-hud/saveSettings", {
        settings: hudSettings,
      })
      closeConfigMenu()
    })

    // Add escape key handler
    $(document).keyup((e) => {
      if (e.key === "Escape" && configMode) {
        closeConfigMenu()
        $.post("https://qbx-hud/closeConfig", {})
      }
    })

    // Reset to default
    $("#reset-default").click(() => {
      $.post("https://qbx-hud/resetSettings", {})
      closeConfigMenu()
    })

    // Load preset
    $(document).on("click", ".load-preset", function () {
      const presetName = $(this).parent().data("preset")
      hudSettings = JSON.parse(JSON.stringify(presets[presetName]))
      applySettings()
      populateConfigMenu()
    })
  }

  // Populate configuration menu with current settings
  function populateConfigMenu() {
    // Populate elements tab
    const elementList = $(".element-list")
    elementList.empty()

    for (const [id, settings] of Object.entries(hudSettings.elements)) {
      const elementItem = $(`
                <div class="element-item">
                    <div class="element-header">
                        <div class="element-title">
                            <i class="fas ${elementIcons[id]}"></i>
                            <h3>${id.charAt(0).toUpperCase() + id.slice(1)}</h3>
                            ${vehicleElements.includes(id) ? '<span class="vehicle-tag">Vehicle</span>' : ""}
                        </div>
                        <div class="element-toggle ${settings.visible ? "active" : ""}" data-element="${id}"></div>
                    </div>
                    <div class="element-settings">
                        <div class="setting-item">
                            <label for="${id}-color">Color:</label>
                            <input type="color" id="${id}-color" value="${settings.color}" data-element="${id}" data-setting="color">
                        </div>
                        <div class="setting-item">
                            <label for="${id}-size">Size:</label>
                            <input type="range" id="${id}-size" min="0.5" max="1.5" step="0.1" value="${settings.size}" data-element="${id}" data-setting="size">
                            <span class="range-value">${settings.size}x</span>
                        </div>
                    </div>
                </div>
            `)

      elementList.append(elementItem)
    }

    // Populate appearance tab
    $("#background-color").val(hudSettings.general.backgroundColor)
    $("#border-color").val(hudSettings.general.borderColor)
    $("#border-width").val(hudSettings.general.borderWidth)
    $("#border-width").next(".range-value").text(`${hudSettings.general.borderWidth}px`)
    $("#border-radius").val(hudSettings.general.borderRadius)
    $("#border-radius").next(".range-value").text(`${hudSettings.general.borderRadius}px`)
    $("#font-color").val(hudSettings.general.fontColor)
    $("#font-size").val(hudSettings.general.fontSize)
    $("#font-size").next(".range-value").text(`${hudSettings.general.fontSize}px`)

    // Element toggle
    $(document).on("click", ".element-toggle", function () {
      const element = $(this).data("element")
      const isVisible = $(this).hasClass("active")

      $(this).toggleClass("active")
      hudSettings.elements[element].visible = !isVisible
      applySettings()
    })

    // Element color change
    $(document).on("change", 'input[data-setting="color"]', function () {
      const element = $(this).data("element")
      const color = $(this).val()

      hudSettings.elements[element].color = color
      applySettings()
    })

    // Element size change
    $(document).on("input", 'input[data-setting="size"]', function () {
      const element = $(this).data("element")
      const size = Number.parseFloat($(this).val())

      $(this)
        .next(".range-value")
        .text(`${size.toFixed(1)}x`)
      hudSettings.elements[element].size = size
      applySettings()
    })

    // General appearance settings
    $("#background-color").on("change", function () {
      hudSettings.general.backgroundColor = $(this).val()
      applySettings()
    })

    $("#border-color").on("change", function () {
      hudSettings.general.borderColor = $(this).val()
      applySettings()
    })

    $("#border-width").on("input", function () {
      const value = Number.parseInt($(this).val())
      $(this).next(".range-value").text(`${value}px`)
      hudSettings.general.borderWidth = value
      applySettings()
    })

    $("#border-radius").on("input", function () {
      const value = Number.parseInt($(this).val())
      $(this).next(".range-value").text(`${value}px`)
      hudSettings.general.borderRadius = value
      applySettings()
    })

    $("#font-color").on("change", function () {
      hudSettings.general.fontColor = $(this).val()
      applySettings()
    })

    $("#font-size").on("input", function () {
      const value = Number.parseInt($(this).val())
      $(this).next(".range-value").text(`${value}px`)
      hudSettings.general.fontSize = value
      applySettings()
    })
  }
}

