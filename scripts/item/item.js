/**
 * Extend the base Item document to implement system-specific logic
 * @extends {Item}
 */
export class DaggerheartItem extends Item {

  /**
   * Augment the basic item data with additional dynamic data.
   */
  prepareData() {
    // Prepare data for the item. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /**
   * Prepare Item type specific data
   */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic item data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an item
   * is queried and has a roll executed directly from a macro).
   */
  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    const flags = itemData.flags.daggerheart || {};

    // Make separate methods for each Item type to keep things organized.
    this._prepareClassData(itemData);
    this._prepareDomainCardData(itemData);
    this._prepareEquipmentData(itemData);
  }

  /**
   * Prepare Class item specific data.
   */
  _prepareClassData(itemData) {
    if (itemData.type !== 'class') return;

    const systemData = itemData.system;
    // Add any class-specific calculations here
  }

  /**
   * Prepare Domain Card specific data.
   */
  _prepareDomainCardData(itemData) {
    if (itemData.type !== 'domain-card') return;

    const systemData = itemData.system;
    
    // Validate card location
    if (!['vault', 'loadout'].includes(systemData.location)) {
      systemData.location = 'vault';
    }

    // Set recall cost based on level if not already set
    if (!systemData.recallCost) {
      systemData.recallCost = Math.max(1, Math.floor(systemData.level / 2));
    }
  }

  /**
   * Prepare Equipment specific data.
   */
  _prepareEquipmentData(itemData) {
    if (itemData.type !== 'equipment') return;

    const systemData = itemData.system;
    
    // Calculate total weight
    systemData.totalWeight = systemData.weight * systemData.quantity;

    // Parse damage dice for weapons
    if (systemData.equipmentType === 'weapon' && systemData.damage) {
      systemData.parsedDamage = this._parseDamageString(systemData.damage);
    }
  }

  /**
   * Parse damage string into structured data
   * @param {string} damageString - Damage string like "2d6+2"
   */
  _parseDamageString(damageString) {
    const match = damageString.match(/(\d*)d(\d+)([+-]\d+)?/);
    if (!match) return null;

    return {
      numDice: parseInt(match[1]) || 1,
      dieSize: parseInt(match[2]),
      modifier: parseInt(match[3]) || 0,
      formula: damageString
    };
  }

  /**
   * Chat card data for this item
   */
  getChatData(htmlOptions = {}) {
    const data = foundry.utils.duplicate(this.system);
    const labels = this.labels;

    // Rich text description
    data.description = TextEditor.enrichHTML(data.description, htmlOptions);

    // Item type specific properties
    data.properties = [];
    switch (this.type) {
      case 'equipment':
        if (data.equipped) data.properties.push("Equipped");
        if (data.tier) data.properties.push(`Tier ${data.tier}`);
        break;
      case 'domain-card':
        data.properties.push(`Level ${data.level}`);
        data.properties.push(data.domain);
        data.properties.push(`Recall: ${data.recallCost} Stress`);
        break;
      case 'class':
        data.properties.push(`HP: +${data.hpBonus}`);
        data.properties.push(`Evasion: +${data.evasionBonus}`);
        break;
    }

    return data;
  }

  /**
   * Get the Actor which owns this item
   */
  get actor() {
    return this.parent instanceof Actor ? this.parent : null;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;
    const actor = this.actor;
    const token = actor?.token;
    const speaker = ChatMessage.getSpeaker({ actor, token });

    // Handle different item types
    switch (item.type) {
      case 'domain-card':
        return this._rollDomainCard();
      case 'equipment':
        return this._rollEquipment();
      default:
        return this._displayInChat();
    }
  }

  /**
   * Roll a domain card (cast spell/use ability)
   */
  async _rollDomainCard() {
    const cardData = this.system;
    const actor = this.actor;

    // Check if card is in loadout
    if (cardData.location !== 'loadout') {
      ui.notifications.warn("Domain card must be in your loadout to use!");
      return;
    }

    // Check stress cost for recall
    if (cardData.recallCost > 0 && actor) {
      const currentStress = actor.system.stress.value;
      const maxStress = actor.system.stress.max;
      
      if (currentStress + cardData.recallCost > maxStress) {
        ui.notifications.warn("Not enough stress capacity for recall!");
        return;
      }
    }

    // Create chat message
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: await renderTemplate("systems/daggerheart/templates/chat/domain-card-use.html", {
        item: this,
        data: this.getChatData()
      }),
      sound: CONFIG.sounds.notification
    };

    const rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    }
    if (rollMode === "blindroll") {
      chatData.blind = true;
    }

    const message = await ChatMessage.create(chatData);

    // Apply stress cost if actor exists
    if (cardData.recallCost > 0 && actor) {
      await actor.takeStress(cardData.recallCost);
    }

    return message;
  }

  /**
   * Roll equipment (typically weapons for attack rolls)
   */
  async _rollEquipment() {
    const equipmentData = this.system;
    const actor = this.actor;

    if (equipmentData.equipmentType === 'weapon' && actor) {
      // Determine which trait to use (this could be made more sophisticated)
      const weaponTrait = this._getWeaponTrait(equipmentData);
      
      if (weaponTrait) {
        // Roll attack with duality dice
        const { DualityDice } = await import("../dice/duality-dice.js");
        return DualityDice.roll(actor.system.traits[weaponTrait].mod, {
          flavor: `${this.name} Attack`
        });
      }
    }

    return this._displayInChat();
  }

  /**
   * Determine which trait a weapon uses
   * @param {Object} weaponData - The weapon's system data
   * @returns {string} - The trait key
   */
  _getWeaponTrait(weaponData) {
    // This is a simplified version - in a full implementation,
    // weapons would have trait specifications
    if (weaponData.damage && weaponData.damage.includes('d')) {
      // Assume finesse for light weapons, strength for heavy
      const damageData = this._parseDamageString(weaponData.damage);
      if (damageData && damageData.dieSize <= 6) {
        return 'finesse';
      } else {
        return 'strength';
      }
    }
    return 'finesse'; // default
  }

  /**
   * Display item information in chat
   */
  async _displayInChat() {
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: await renderTemplate("systems/daggerheart/templates/chat/item-card.html", {
        item: this,
        data: this.getChatData()
      })
    };

    const rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    }
    if (rollMode === "blindroll") {
      chatData.blind = true;
    }

    return ChatMessage.create(chatData);
  }

  /**
   * Move a domain card between vault and loadout
   * @param {string} location - 'vault' or 'loadout'
   */
  async moveDomainCard(location) {
    if (this.type !== 'domain-card') return;
    
    if (!['vault', 'loadout'].includes(location)) {
      ui.notifications.error("Invalid location for domain card!");
      return;
    }

    await this.update({ "system.location": location });
    
    const locationName = location === 'vault' ? 'Vault' : 'Loadout';
    ui.notifications.info(`${this.name} moved to ${locationName}`);
  }

  /**
   * Toggle equipment equipped status
   */
  async toggleEquipped() {
    if (this.type !== 'equipment') return;
    
    const newEquippedState = !this.system.equipped;
    await this.update({ "system.equipped": newEquippedState });
    
    const status = newEquippedState ? 'equipped' : 'unequipped';
    ui.notifications.info(`${this.name} ${status}`);
  }

  /**
   * Apply this class to an actor
   */
  async applyToActor(actor) {
    if (this.type !== 'class') return false;
    
    const classData = this.system;
    const updates = {
      "system.class.name": this.name,
      "system.health.max": actor.system.health.max + classData.hpBonus,
      "system.derived.evasion.value": actor.system.derived.evasion.value + classData.evasionBonus
    };

    await actor.update(updates);
    ui.notifications.info(`Applied ${this.name} class to ${actor.name}`);
    return true;
  }

  /**
   * Apply this ancestry to an actor
   */
  async applyAncestryToActor(actor) {
    if (this.type !== 'ancestry') return false;
    
    await actor.update({ "system.ancestry.name": this.name });
    ui.notifications.info(`Applied ${this.name} ancestry to ${actor.name}`);
    return true;
  }

  /**
   * Apply this community to an actor
   */
  async applyCommunityToActor(actor) {
    if (this.type !== 'community') return false;
    
    await actor.update({ "system.community.name": this.name });
    ui.notifications.info(`Applied ${this.name} community to ${actor.name}`);
    return true;
  }
} 