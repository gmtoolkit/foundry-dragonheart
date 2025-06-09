/**
 * Extend the base Actor document to implement system-specific logic
 * @extends {Actor}
 */
export class DaggerheartActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /**
   * Prepare Character type specific data
   */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from a macro).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.daggerheart || {};

    // Make separate methods for each Actor type (pc, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data.
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'pc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Calculate trait modifiers
    for (let [key, trait] of Object.entries(systemData.traits)) {
      trait.mod = Math.floor((trait.value - 10) / 2);
    }

    // Calculate derived stats
    this._calculateDerivedStats(systemData);
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // NPCs have simpler trait system
    // No modifiers needed for NPCs as they use flat values
  }

  /**
   * Calculate derived statistics for PCs
   */
  _calculateDerivedStats(systemData) {
    // Calculate Evasion (Agility + Armor bonus)
    systemData.derived.evasion.value = 10 + systemData.traits.agility.mod;
    
    // Add armor bonus if equipped
    // This would be enhanced later when item system is fully implemented
    
    // Calculate Proficiency (based on level)
    const level = systemData.class.level || 1;
    systemData.derived.proficiency.value = Math.ceil(level / 2);

    // Update max HP based on class and level
    // Base HP + (level-1) * class HP bonus + Strength modifier
    const baseHp = 20; // Base starting HP
    const classHpBonus = 5; // This would come from class item later
    systemData.health.max = baseHp + (level - 1) * classHpBonus + systemData.traits.strength.mod;
    
    // Ensure current HP doesn't exceed max
    if (systemData.health.value > systemData.health.max) {
      systemData.health.value = systemData.health.max;
    }

    // Calculate stress max (base 6 + Presence modifier)
    systemData.stress.max = 6 + systemData.traits.presence.mod;
    
    // Ensure current stress doesn't exceed max
    if (systemData.stress.value > systemData.stress.max) {
      systemData.stress.value = systemData.stress.max;
    }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'pc') return;

    // Copy the trait scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.traits) {
      for (let [k, v] of Object.entries(data.traits)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for convenience
    if (data.class) {
      data.lvl = data.class.level ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

  /**
   * Roll a Duality Die check for this actor.
   * @param {string} traitKey - The trait to use for the roll
   * @param {Object} options - Roll options
   */
  async rollDualityDice(traitKey, options = {}) {
    const trait = this.system.traits[traitKey];
    if (!trait) {
      ui.notifications.error(`Trait ${traitKey} not found!`);
      return;
    }

    // Import and use the DualityDice class
    const { DualityDice } = await import("../dice/duality-dice.js");
    return DualityDice.roll(trait.mod, options);
  }

  /**
   * Spend Hope to enhance a roll
   * @param {number} amount - Amount of Hope to spend
   */
  async spendHope(amount = 1) {
    if (this.type !== 'pc') return false;
    
    const currentHope = this.system.derived.hope.value;
    if (currentHope < amount) {
      ui.notifications.warn("Not enough Hope to spend!");
      return false;
    }

    await this.update({
      "system.derived.hope.value": currentHope - amount
    });

    ui.notifications.info(`Spent ${amount} Hope!`);
    return true;
  }

  /**
   * Gain Hope
   * @param {number} amount - Amount of Hope to gain
   */
  async gainHope(amount = 1) {
    if (this.type !== 'pc') return false;
    
    const currentHope = this.system.derived.hope.value;
    const maxHope = this.system.derived.hope.max;
    const newHope = Math.min(currentHope + amount, maxHope);

    await this.update({
      "system.derived.hope.value": newHope
    });

    ui.notifications.info(`Gained ${amount} Hope!`);
    return true;
  }

  /**
   * Take stress
   * @param {number} amount - Amount of stress to take
   */
  async takeStress(amount = 1) {
    const currentStress = this.system.stress.value;
    const maxStress = this.system.stress.max;
    const newStress = Math.min(currentStress + amount, maxStress);

    await this.update({
      "system.stress.value": newStress
    });

    if (newStress >= maxStress) {
      ui.notifications.warn(`${this.name} is at maximum stress!`);
    }

    return true;
  }

  /**
   * Clear stress (rest mechanics)
   * @param {number} amount - Amount of stress to clear
   */
  async clearStress(amount = null) {
    const currentStress = this.system.stress.value;
    const newStress = amount ? Math.max(currentStress - amount, 0) : 0;

    await this.update({
      "system.stress.value": newStress
    });

    ui.notifications.info(`Cleared ${currentStress - newStress} stress.`);
    return true;
  }
} 