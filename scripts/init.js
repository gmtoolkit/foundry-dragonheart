/**
 * Daggerheart System for FoundryVTT
 * Author: Daggerheart System Developer
 * Content Licensing: 
 * This product includes materials from the Daggerheart System Reference Document 1.0 
 * © Critical Role, LLC under the Darrington Press Community Gaming License.
 * Software Licensing: MIT
 */

// Import system classes
import { DaggerheartActor } from "./actor/actor.js";
import { DaggerheartActorSheet } from "./actor/actor-sheet.js";
import { DaggerheartItem } from "./item/item.js";
import { DaggerheartItemSheet } from "./item/item-sheet.js";
import { DualityDice } from "./dice/duality-dice.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log("Daggerheart | Initializing the Daggerheart System");

  // Assign custom classes and constants here
  game.daggerheart = {
    DaggerheartActor,
    DaggerheartItem,
    DualityDice,
    rollItemMacro
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = DaggerheartActor;
  CONFIG.Item.documentClass = DaggerheartItem;

  // Register sheet application classes
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet("daggerheart", DaggerheartActorSheet, {
    types: ["pc", "npc"],
    makeDefault: true
  });
  
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet("daggerheart", DaggerheartItemSheet, {
    types: ["class", "subclass", "ancestry", "community", "domain-card", "equipment", "experience"],
    makeDefault: true
  });

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  // Register system settings
  registerSettings();

  // Register Handlebars helpers
  registerHandlebarsHelpers();
});

/* -------------------------------------------- */
/*  Handlebars Templates                        */
/* -------------------------------------------- */

async function preloadHandlebarsTemplates() {
  return foundry.applications.handlebars.loadTemplates([
    // Actor partials
    "systems/daggerheart/templates/actor/parts/actor-traits.html",
    "systems/daggerheart/templates/actor/parts/actor-equipment.html",
    "systems/daggerheart/templates/actor/parts/actor-inventory.html",
    "systems/daggerheart/templates/actor/parts/actor-loadout.html",
    "systems/daggerheart/templates/actor/parts/actor-experiences.html",
    "systems/daggerheart/templates/actor/parts/actor-connections.html",
    
    // Item partials
    "systems/daggerheart/templates/item/parts/item-description.html",
    "systems/daggerheart/templates/item/parts/domain-card-details.html"
  ]);
}

/* -------------------------------------------- */
/*  System Settings                             */
/* -------------------------------------------- */

function registerSettings() {
  // Register any system-specific settings here
  game.settings.register("daggerheart", "enablePlaytestContent", {
    name: "Enable Playtest Content",
    hint: "Enable content marked as playtest material (restricted from commercial use)",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("daggerheart", "hopeTokens", {
    name: "Hope Tokens Available",
    hint: "Number of Hope tokens available to the party",
    scope: "world",
    config: true,
    type: Number,
    default: 5
  });
}

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

function registerHandlebarsHelpers() {
  // Register custom Handlebars helpers
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  Handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });

  Handlebars.registerHelper('capitalize', function(str) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
}

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

async function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item usage
  return item.roll();
}

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.daggerheart.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "daggerheart.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
} 