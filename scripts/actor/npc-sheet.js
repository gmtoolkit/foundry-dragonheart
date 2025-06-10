/**
 * Extend the basic ActorSheet for NPCs
 * @extends {foundry.appv1.sheets.ActorSheet}
 */
export class DaggerheartNPCSheet extends foundry.appv1.sheets.ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["daggerheart", "sheet", "actor", "npc"],
      width: 600,
      height: 650,
      resizable: true,
      tabs: []
    });
  }

  /** @override */
  get template() {
    return "systems/daggerheart/templates/actor/actor-npc-sheet.html";
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Ensure abilities array exists
    if (!context.system.abilities) {
      context.system.abilities = [];
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add ability
    html.find('.add-ability').click(this._onAddAbility.bind(this));

    // Remove ability
    html.find('.ability-remove').click(this._onRemoveAbility.bind(this));

    // Trait rolls
    html.find('.trait-roll').click(this._onTraitRoll.bind(this));
  }

  /**
   * Handle adding a new ability
   * @param {Event} event   The originating click event
   * @private
   */
  async _onAddAbility(event) {
    event.preventDefault();
    
    const abilities = this.actor.system.abilities || [];
    abilities.push({
      name: "New Ability",
      description: ""
    });
    
    await this.actor.update({
      "system.abilities": abilities
    });
  }

  /**
   * Handle removing an ability
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRemoveAbility(event) {
    event.preventDefault();
    
    const index = parseInt(event.currentTarget.dataset.index);
    const abilities = foundry.utils.deepClone(this.actor.system.abilities || []);
    
    abilities.splice(index, 1);
    
    await this.actor.update({
      "system.abilities": abilities
    });
  }

  /**
   * Handle trait rolls
   * @param {Event} event   The originating click event
   * @private
   */
  async _onTraitRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.rollType === 'trait') {
      const traitKey = dataset.trait;
      const trait = this.actor.system.traits[traitKey];
      
      // Roll duality dice with trait modifier
      const { DualityDice } = await import("../dice/duality-dice.js");
      return DualityDice.roll(trait || 0, {
        flavor: `${traitKey.charAt(0).toUpperCase() + traitKey.slice(1)} Check (${this.actor.name})`
      });
    }
  }
} 