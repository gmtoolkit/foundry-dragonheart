/**
 * Daggerheart System Main Module
 * This serves as the main entry point for the ES module system
 */

// Re-export everything from init.js to maintain compatibility
export * from "./init.js";
import { rollItemMacro } from "./init.js";

// Import document classes.
import { DaggerheartActor } from "./actor/actor.js";
import { DaggerheartItem } from "./item/item.js";
// Import sheet classes.
import { DaggerheartActorSheet } from "./actor/actor-sheet.js";
import { DaggerheartNPCSheet } from "./actor/npc-sheet.js";
import { DaggerheartItemSheet } from "./item/item-sheet.js";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.daggerheart = {
    DaggerheartActor,
    DaggerheartItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.DAGGERHEART = {};

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @traits.agility.mod",
    decimals: 2
  };

  // Define custom document classes
  CONFIG.Actor.documentClass = DaggerheartActor;
  CONFIG.Item.documentClass = DaggerheartItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("daggerheart", DaggerheartActorSheet, { 
    types: ["pc"],
    makeDefault: true,
    label: "DAGGERHEART.SheetLabels.Actor"
  });
  
  Actors.registerSheet("daggerheart", DaggerheartNPCSheet, { 
    types: ["npc"],
    makeDefault: true,
    label: "DAGGERHEART.SheetLabels.NPC"
  });
  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("daggerheart", DaggerheartItemSheet, { makeDefault: true });

  // Register custom Handlebars helpers
  Handlebars.registerHelper('capitalize', function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  });

  // Preload Handlebars templates.
  return loadTemplates([
    // Actor partials.
    "systems/daggerheart/templates/actor/parts/actor-features.html",
    "systems/daggerheart/templates/actor/parts/actor-items.html",
    "systems/daggerheart/templates/actor/parts/actor-spells.html",
    "systems/daggerheart/templates/actor/parts/actor-effects.html",
    "systems/daggerheart/templates/actor/parts/actor-traits.html",
    "systems/daggerheart/templates/actor/parts/actor-loadout.html",
    "systems/daggerheart/templates/actor/parts/actor-inventory.html",
    "systems/daggerheart/templates/actor/parts/actor-experiences.html",
    "systems/daggerheart/templates/actor/parts/actor-connections.html",
  ]);

}); 