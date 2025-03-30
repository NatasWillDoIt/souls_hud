// Cyberpunk HUD: Client-side JavaScript
let hudSettings = {}
let isDragging = false
let showHUD = true
let inVehicle = false
let configMode = false

// Cyberpunk-themed default settings with diagonal layout
const defaultSettings = {
  elements: {
    health: { position: { x: 0.95, y: 0.05 }, visible: true, color: "#ff003c", size: 1.0 },
    armor: { position: { x: 0.92, y: 0.12 }, visible: true, color: "#00f0ff", size: 1.0 },
    hunger: { position: { x: 0.89, y: 0.19 }, visible: true, color: "#fcee09", size: 1.0 },
    thirst: { position: { x: 0.86, y: 0.26 }, visible: true, color: "#00f0ff", size: 1.0 },
    stamina: { position: { x: 0.83, y: 0.33 }, visible: true, color: "#00ff9f", size: 1.0 },
    oxygen: { position: { x: 0.8, y: 0.4 }, visible: true, color: "#ffffff", size: 1.0 },
    stress: { position: { x: 0.77, y: 0.47 }, visible: true, color: "#bf00ff", size: 1.0 },
    voice: { position: { x: 0.74, y: 0.54 }, visible: true, color: "#fcee09", size: 1.0 },
    speedometer: { position: { x: 0.5, y: 0.05 }, visible: true, color: "#00f0ff", size: 1.0 },
    fuel: { position: { x: 0.5, y: 0.12 }, visible: true, color: "#00ff9f", size: 1.0 },
  },
  general: {
    backgroundColor: "rgba(15, 15, 18, 0.6)",
    borderColor: "rgba(0, 240, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 0,
    fontColor: "#ffffff",
    fontSize: 16,
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
      health: { position: { x: 0.95, y: 0.05 }, visible: true, color: "#ff003c", size: 0.8 },
      armor: { position: { x: 0.92, y: 0.12 }, visible: true, color: "#00f0ff", size: 0.8 },
      hunger: { position: { x: 0.89, y: 0.19 }, visible: true, color: "#fcee09", size: 0.8 },
      thirst: { position: { x: 0.86, y: 0.26 }, visible: true, color: "#00f0ff", size: 0.8 },
      stamina: { position: { x: 0.83, y: 0.33 }, visible: false, color: "#00ff9f", size: 0.8 },
      oxygen: { position: { x: 0.8, y: 0.4 }, visible: false, color: "#ffffff", size: 0.8 },
      stress: { position: { x: 0.77, y: 0.47 }, visible: false, color: "#bf00ff", size: 0.8 },
      voice: { position: { x: 0.74, y: 0.54 }, visible: true, color: "#fcee09", size: 0.8 },
      speedometer: { position: { x: 0.5, y: 0.05 }, visible: true, color: "#00f0ff", size: 0.8 },
      fuel: { position: { x: 0.5, y: 0.12 }, visible: true, color: "#00ff9f", size: 0.8 },
    },
    general: {
      backgroundColor: "rgba(15, 15, 18, 0.4)",
      borderColor: "rgba(0, 240, 255, 0.3)",
      borderWidth: 1,
      borderRadius: 0,
      fontColor: "#ffffff",
      fontSize: 14,
    },
  },
  compact: {
    elements: {
      health: { position: { x: 0.98, y: 0.02 }, visible: true, color: "#ff003c", size: 0.7 },
      armor: { position: { x: 0.98, y: 0.06 }, visible: true, color: "#00f0ff", size: 0.7 },
      hunger: { position: { x: 0.98, y: 0.1 }, visible: true, color: "#fcee09", size: 0.7 },
      thirst: { position: { x: 0.98, y: 0.14 }, visible: true, color: "#00f0ff", size: 0.7 },
      stamina: { position: { x: 0.98, y: 0.18 }, visible: true, color: "#00ff9f", size: 0.7 },
      oxygen: { position: { x: 0.98, y: 0.22 }, visible: true, color: "#ffffff", size: 0.7 },
      stress: { position: { x: 0.98, y: 0.26 }, visible: true, color: "#bf00ff", size: 0.7 },
      voice: { position: { x: 0.98, y: 0.3 }, visible: true, color: "#fcee09", size: 0.7 },
      speedometer: { position: { x: 0.5, y: 0.05 }, visible: true, color: "#00f0ff", size: 0.7 },
      fuel: { position: { x: 0.5, y: 0.09 }, visible: true, color: "#00ff9f", size: 0.7 },
    },
    general: {
      backgroundColor: "rgba(15, 15, 18, 0.7)",
      borderColor: "rgba(0, 240, 255, 0.2)",
      borderWidth: 1,
      borderRadius: 0,
      fontColor: "#ffffff",
      fontSize: 12,
    },
  },
  bottomLeft: {
    elements: {
      health: { position: { x: 0.01, y: 0.97 }, visible: true, color: "#ff003c", size: 0.9 },
      armor: { position: { x: 0.01, y: 0.93 }, visible: true, color: "#00f0ff", size: 0.9 },
      hunger: { position: { x: 0.01, y: 0.89 }, visible: true, color: "#fcee09", size: 0.9 },
      thirst: { position: { x: 0.01, y: 0.85 }, visible: true, color: "#00f0ff", size: 0.9 },
      stamina: { position: { x: 0.01, y: 0.81 }, visible: true, color: "#00ff9f", size: 0.9 },
      oxygen: { position: { x: 0.01, y: 0.77 }, visible: true, color: "#ffffff", size: 0.9 },
      stress: { position: { x: 0.01, y: 0.73 }, visible: true, color: "#bf00ff", size: 0.9 },
      voice: { position: { x: 0.01, y: 0.69 }, visible: true, color: "#fcee09", size: 0.9 },
      speedometer: { position: { x: 0.5, y: 0.05 }, visible: true, color: "#00f0ff", size: 0.9 },
      fuel: { position: { x: 0.5, y: 0.09 }, visible: true, color: "#00ff9f", size: 0.9 },
    },
    general: {
      backgroundColor: "rgba(15, 15, 18, 0.6)",
      borderColor: "rgba(0, 240, 255, 0.5)",
      borderWidth: 1,
      borderRadius: 0,
      fontColor: "#ffffff",
      fontSize: 14,
    },
  },
}

// Declare jQuery, $, and SetNuiFocus if they are not already declared
var jQuery = jQuery || {}
var $ = $ || jQuery
var SetNuiFocus = SetNuiFocus || (() => {})

// Ensure jQuery is loaded
if (typeof jQuery == "undefined") {
  console.error("jQuery is not loaded. Please ensure jQuery is included in your HTML.")
} else {
  // Initialize HUD
  $(document).ready(() => {
    // Initialize hudSettings with default values if not set
    if (!hudSettings || typeof hudSettings !== "object") {
      hudSettings = JSON.parse(JSON.stringify(defaultSettings))
    }

    applySettings()

    // Add additional error handling for the message event listener

    // Listen for NUI messages
    window.addEventListener("message", (event) => {
      try {
        const data = event.data
        if (!data) return

        switch (data.action) {
          case "init":
            // Initialize HUD
            break

          case "updateHUD":
            if (showHUD && data.data) {
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
            if (data.settings) {
              hudSettings = data.settings
              applySettings()
            }
            break

          case "openConfig":
            if (data.settings) {
              hudSettings = data.settings
            }
            openConfigMenu()
            break

          case "setVehicleState":
            inVehicle = data.inVehicle
            toggleVehicleHUD(inVehicle)
            break
        }
      } catch (error) {
        console.error("Error processing message:", error)
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

  // Update HUD data with error handling
  function updateHUDData(data) {
    try {
      if (!data) return

      // Update health
      if (data.health !== undefined) {
        $("#health .progress-bar").css("width", `${data.health}%`)
        $("#health .value").text(Math.floor(data.health))
      }

      // Update armor
      if (data.armor !== undefined) {
        $("#armor .progress-bar").css("width", `${data.armor}%`)
        $("#armor .value").text(Math.floor(data.armor))
      }

      // Update hunger
      if (data.hunger !== undefined) {
        $("#hunger .progress-bar").css("width", `${data.hunger}%`)
        $("#hunger .value").text(Math.floor(data.hunger))
      }

      // Update thirst
      if (data.thirst !== undefined) {
        $("#thirst .progress-bar").css("width", `${data.thirst}%`)
        $("#thirst .value").text(Math.floor(data.thirst))
      }

      // Update stamina
      if (data.stamina !== undefined) {
        $("#stamina .progress-bar").css("width", `${data.stamina}%`)
        $("#stamina .value").text(Math.floor(data.stamina))
      }

      // Update oxygen
      if (data.oxygen !== undefined) {
        $("#oxygen .progress-bar").css("width", `${data.oxygen}%`)
        $("#oxygen .value").text(Math.floor(data.oxygen))
      }

      // Update stress
      if (data.stress !== undefined) {
        $("#stress .progress-bar").css("width", `${data.stress}%`)
        $("#stress .value").text(Math.floor(data.stress))
      }

      // Update voice
      if (data.voice) {
        $(".voice-level").removeClass("active")
        if (data.voice.talking) {
          $(".voice-level").addClass("active")
        } else if (data.voice.mode) {
          for (let i = 0; i < data.voice.mode; i++) {
            $(`.voice-level-${i + 1}`).addClass("active")
          }
        }
      }

      // Update vehicle data
      if (data.vehicle) {
        if (data.vehicle.inVehicle) {
          inVehicle = true
          toggleVehicleHUD(true)

          // Update speedometer
          if (data.vehicle.speed !== undefined) {
            $("#speedometer .progress-bar").css("width", `${(data.vehicle.speed / 200) * 100}%`)
            $("#speedometer .value").text(`${data.vehicle.speed} km/h`)
          }

          // Update fuel
          if (data.vehicle.fuel !== undefined) {
            $("#fuel .progress-bar").css("width", `${data.vehicle.fuel}%`)
            $("#fuel .value").text(Math.floor(data.vehicle.fuel))
          }
        } else {
          inVehicle = false
          toggleVehicleHUD(false)
        }
      }
    } catch (error) {
      console.error("Error updating HUD data:", error)
    }
  }

  // Apply HUD settings
  function applySettings() {
    // Apply general settings
    const general =
      hudSettings && hudSettings.general
        ? hudSettings.general
        : {
            backgroundColor: "rgba(15, 15, 18, 0.6)",
            borderColor: "rgba(0, 240, 255, 0.5)",
            borderWidth: 1,
            borderRadius: 0,
            fontColor: "#ffffff",
            fontSize: 16,
          }

    $(".hud-element").css({
      "background-color": "transparent", // Keep transparent for new design
      "border-color": general.borderColor,
      "border-width": `${general.borderWidth}px`,
      "border-radius": `${general.borderRadius}px`,
      color: general.fontColor,
      "font-size": `${general.fontSize}px`,
    })

    // Apply element-specific settings
    if (hudSettings && hudSettings.elements) {
      for (const [id, settings] of Object.entries(hudSettings.elements)) {
        const element = $(`#${id}`)
        if (element.length === 0) continue

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
          background: `linear-gradient(90deg, ${settings.color}, ${lightenColor(settings.color, 20)})`,
          "box-shadow": `0 0 10px ${settings.color}`,
        })

        // Icon color
        element.find(".icon i").css("color", settings.color)
      }
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

  // Helper function to lighten a color
  function lightenColor(color, percent) {
    const num = Number.parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    )
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

  // Fix for the SetNuiFocus issue - replace with a proper NUI callback

  // Close configuration menu
  function closeConfigMenu() {
    configMode = false
    $("#hud-container").removeClass("config-mode")
    $("#config-container").hide()

    // Disable draggable
    try {
      $(".hud-element").draggable("destroy")
    } catch (e) {
      console.log("Error destroying draggable:", e)
    }

    // Reapply settings to hide vehicle elements if not in vehicle
    applySettings()

    // Ensure cursor is removed and input is returned to the game
    // Don't call SetNuiFocus directly, use the callback instead
    $.post("https://qbx-hud/closeConfig", {})
  }

  // Setup configuration menu
  function setupConfigMenu() {
    // Tab switching
    $(".tab-button")
      .off("click")
      .on("click", function () {
        $(".tab-button").removeClass("active")
        $(this).addClass("active")

        const tabId = $(this).data("tab")
        $(".tab-content").removeClass("active")
        $(`#${tabId}-tab`).addClass("active")
      })

    // Close button
    $("#close-config")
      .off("click")
      .on("click", () => {
        closeConfigMenu()
      })

    // Cancel button
    $("#cancel-settings")
      .off("click")
      .on("click", () => {
        closeConfigMenu()
        $.post("https://qbx-hud/cancelSettings", {})
      })

    // Save button
    $("#save-settings")
      .off("click")
      .on("click", () => {
        $.post("https://qbx-hud/saveSettings", {
          settings: hudSettings,
        })
        closeConfigMenu()
      })

    // Add escape key handler
    $(document)
      .off("keyup")
      .on("keyup", (e) => {
        if (e.key === "Escape" && configMode) {
          closeConfigMenu()
        }
      })

    // Reset to default
    $("#reset-default")
      .off("click")
      .on("click", () => {
        hudSettings = JSON.parse(JSON.stringify(defaultSettings))
        applySettings()
        populateConfigMenu()
        $.post("https://qbx-hud/resetSettings", {})
        closeConfigMenu()
      })

    // Load preset
    $(document)
      .off("click", ".load-preset")
      .on("click", ".load-preset", function () {
        const presetName = $(this).parent().data("preset")
        if (presets[presetName]) {
          hudSettings = JSON.parse(JSON.stringify(presets[presetName]))
          applySettings()
          populateConfigMenu()
        }
      })
  }

  // Populate configuration menu with current settings
  function populateConfigMenu() {
    // Populate elements tab
    const elementList = $(".element-list")
    elementList.empty()

    if (hudSettings && hudSettings.elements) {
      for (const [id, settings] of Object.entries(hudSettings.elements)) {
        if (!settings) continue

        const elementItem = $(`
        <div class="element-item">
          <div class="element-header">
            <div class="element-title">
              <i class="fas ${elementIcons[id] || "fa-circle"}"></i>
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
    }

    // Populate appearance tab
    if (hudSettings && hudSettings.general) {
      $("#background-color").val(hudSettings.general.backgroundColor || "rgba(15, 15, 18, 0.6)")
      $("#border-color").val(hudSettings.general.borderColor || "rgba(0, 240, 255, 0.5)")
      $("#border-width").val(hudSettings.general.borderWidth || 1)
      $("#border-width")
        .next(".range-value")
        .text(`${hudSettings.general.borderWidth || 1}px`)
      $("#border-radius").val(hudSettings.general.borderRadius || 0)
      $("#border-radius")
        .next(".range-value")
        .text(`${hudSettings.general.borderRadius || 0}px`)
      $("#font-color").val(hudSettings.general.fontColor || "#ffffff")
      $("#font-size").val(hudSettings.general.fontSize || 16)
      $("#font-size")
        .next(".range-value")
        .text(`${hudSettings.general.fontSize || 16}px`)
    }

    // Element toggle - Use event delegation properly
    $(document)
      .off("click", ".element-toggle")
      .on("click", ".element-toggle", function () {
        const element = $(this).data("element")
        if (!element || !hudSettings || !hudSettings.elements || !hudSettings.elements[element]) return

        const isVisible = $(this).hasClass("active")
        $(this).toggleClass("active")
        hudSettings.elements[element].visible = !isVisible
        applySettings()
      })

    // Element color change - Use event delegation properly
    $(document)
      .off("change", 'input[data-setting="color"]')
      .on("change", 'input[data-setting="color"]', function () {
        const element = $(this).data("element")
        if (!element || !hudSettings || !hudSettings.elements || !hudSettings.elements[element]) return

        const color = $(this).val()
        hudSettings.elements[element].color = color
        applySettings()
      })

    // Element size change - Use event delegation properly
    $(document)
      .off("input", 'input[data-setting="size"]')
      .on("input", 'input[data-setting="size"]', function () {
        const element = $(this).data("element")
        if (!element || !hudSettings || !hudSettings.elements || !hudSettings.elements[element]) return

        const size = Number.parseFloat($(this).val())
        $(this)
          .next(".range-value")
          .text(`${size.toFixed(1)}x`)
        hudSettings.elements[element].size = size
        applySettings()
      })

    // General appearance settings
    $("#background-color")
      .off("change")
      .on("change", function () {
        if (!hudSettings || !hudSettings.general) return
        hudSettings.general.backgroundColor = $(this).val()
        applySettings()
      })

    $("#border-color")
      .off("change")
      .on("change", function () {
        if (!hudSettings || !hudSettings.general) return
        hudSettings.general.borderColor = $(this).val()
        applySettings()
      })

    $("#border-width")
      .off("input")
      .on("input", function () {
        if (!hudSettings || !hudSettings.general) return
        const value = Number.parseInt($(this).val())
        $(this).next(".range-value").text(`${value}px`)
        hudSettings.general.borderWidth = value
        applySettings()
      })

    $("#border-radius")
      .off("input")
      .on("input", function () {
        if (!hudSettings || !hudSettings.general) return
        const value = Number.parseInt($(this).val())
        $(this).next(".range-value").text(`${value}px`)
        hudSettings.general.borderRadius = value
        applySettings()
      })

    $("#font-color")
      .off("change")
      .on("change", function () {
        if (!hudSettings || !hudSettings.general) return
        hudSettings.general.fontColor = $(this).val()
        applySettings()
      })

    $("#font-size")
      .off("input")
      .on("input", function () {
        if (!hudSettings || !hudSettings.general) return
        const value = Number.parseInt($(this).val())
        $(this).next(".range-value").text(`${value}px`)
        hudSettings.general.fontSize = value
        applySettings()
      })
  }
}

