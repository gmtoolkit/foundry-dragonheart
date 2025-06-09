/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class DaggerheartItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["daggerheart", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/daggerheart/templates/item";
    // Return a single sheet for all item types.
    return `${path}/item-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare item-type-specific data
    this._prepareItemTypeData(context);

    return context;
  }

  /**
   * Prepare data specific to item types
   * @param {Object} context 
   */
  _prepareItemTypeData(context) {
    const itemType = context.item.type;

    switch(itemType) {
      case 'domain-card':
        context.cardTypes = {
          'ability': 'Ability',
          'spell': 'Spell', 
          'grimoire': 'Grimoire'
        };
        context.domains = {
          'arcana': 'Arcana',
          'blade': 'Blade',
          'bone': 'Bone',
          'codex': 'Codex',
          'grace': 'Grace',
          'midnight': 'Midnight',
          'sage': 'Sage',
          'splendor': 'Splendor',
          'valor': 'Valor'
        };
        context.locations = {
          'vault': 'Vault',
          'loadout': 'Loadout'
        };
        break;

      case 'equipment':
        context.equipmentTypes = {
          'weapon': 'Weapon',
          'armor': 'Armor',
          'shield': 'Shield',
          'tool': 'Tool',
          'gear': 'Gear'
        };
        context.tiers = {
          1: 'Tier 1',
          2: 'Tier 2', 
          3: 'Tier 3',
          4: 'Tier 4'
        };
        break;

      case 'class':
        context.classLevels = {};
        for (let i = 1; i <= 10; i++) {
          context.classLevels[i] = `Level ${i}`;
        }
        break;

      case 'subclass':
        context.spellcastingTraits = {
          'instinct': 'Instinct',
          'presence': 'Presence',
          'knowledge': 'Knowledge'
        };
        break;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Domain card location change
    html.find('.change-location').click(this._onChangeLocation.bind(this));

    // Equipment toggle
    html.find('.toggle-equipped').click(this._onToggleEquipped.bind(this));
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  /**
   * Handle changing domain card location
   * @param {Event} event   The originating click event
   * @private
   */
  async _onChangeLocation(event) {
    event.preventDefault();
    if (this.item.type !== 'domain-card') return;

    const currentLocation = this.item.system.location;
    const newLocation = currentLocation === 'vault' ? 'loadout' : 'vault';
    
    await this.item.moveDomainCard(newLocation);
    this.render(false);
  }

  /**
   * Handle toggling equipment equipped status
   * @param {Event} event   The originating click event
   * @private
   */
  async _onToggleEquipped(event) {
    event.preventDefault();
    if (this.item.type !== 'equipment') return;

    await this.item.toggleEquipped();
    this.render(false);
  }
} 