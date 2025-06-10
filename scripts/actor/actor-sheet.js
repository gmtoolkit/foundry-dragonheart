/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {foundry.appv1.sheets.ActorSheet}
 */
export class DaggerheartActorSheet extends foundry.appv1.sheets.ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["daggerheart", "sheet", "actor"],
      width: 800,
      height: 750,
      resizable: true,
      scrollY: [],
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "overview" }],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
    });
  }

  /** @override */
  get template() {
    return `systems/daggerheart/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare character data and items.
    if (actorData.type == 'pc') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle trait scores.
    for (let [k, v] of Object.entries(context.system.traits)) {
      v.label = game.i18n.localize(CONFIG.DAGGERHEART?.traits?.[k]) ?? k;
    }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = [];
    const domainCards = {
      vault: [],
      loadout: []
    };
    const classes = [];
    const ancestry = null;
    const community = null;

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'equipment') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'experience') {
        features.push(i);
      }
      // Append to domain cards.
      else if (i.type === 'domain-card') {
        if (i.system.location === 'loadout') {
          domainCards.loadout.push(i);
        } else {
          domainCards.vault.push(i);
        }
      }
      // Append to classes.
      else if (i.type === 'class' || i.type === 'subclass') {
        classes.push(i);
      }
      // Handle single ancestry/community
      else if (i.type === 'ancestry') {
        context.ancestry = i;
      }
      else if (i.type === 'community') {
        context.community = i;
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.domainCards = domainCards;
    context.classes = classes;

    // Calculate loadout/vault counts
    context.loadoutCount = domainCards.loadout.length;
    context.vaultCount = domainCards.vault.length;
    context.maxLoadout = 5; // Could be derived from class or level
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Trait rolls
    html.find('.trait-roll').click(this._onTraitRoll.bind(this));

    // Item rolls
    html.find('.item-roll').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      if (item) item.roll();
    });

    // Equipment toggles
    html.find('.item-toggle').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      if (item && item.type === 'equipment') {
        item.toggleEquipped();
      }
    });

    // Domain card movement
    html.find('.card-to-loadout').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      if (item && item.type === 'domain-card') {
        item.moveDomainCard('loadout');
      }
    });

    html.find('.card-to-vault').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      if (item && item.type === 'domain-card') {
        item.moveDomainCard('vault');
      }
    });

    // Hope management
    html.find('.hope-spend').click(this._onHopeSpend.bind(this));
    html.find('.hope-gain').click(this._onHopeGain.bind(this));

    // Stress management
    html.find('.stress-add').click(this._onStressAdd.bind(this));
    html.find('.stress-clear').click(this._onStressClear.bind(this));

    // Rest mechanics
    html.find('.short-rest').click(this._onShortRest.bind(this));
    html.find('.long-rest').click(this._onLongRest.bind(this));

    // Drag events for inventory
    html.find(".item").each((i, li) => {
      if (li.classList.contains("inventory-header")) return;
      li.setAttribute("draggable", true);
      li.addEventListener("dragstart", this._onDragStart.bind(this), false);
    });
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = foundry.utils.deepClone(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
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

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'trait') {
        const traitKey = dataset.trait;
        const trait = this.actor.system.traits[traitKey];
        
        // Roll duality dice with trait modifier
        const { DualityDice } = await import("../dice/duality-dice.js");
        return DualityDice.roll(trait.mod, {
          flavor: `${game.i18n.localize(CONFIG.DAGGERHEART?.traits?.[traitKey]) ?? traitKey} Check`
        });
      }
    }
  }

  /**
   * Handle Hope spending
   * @param {Event} event   The originating click event
   * @private
   */
  async _onHopeSpend(event) {
    event.preventDefault();
    const amount = parseInt(event.currentTarget.dataset.amount) || 1;
    await this.actor.spendHope(amount);
  }

  /**
   * Handle Hope gaining
   * @param {Event} event   The originating click event
   * @private
   */
  async _onHopeGain(event) {
    event.preventDefault();
    const amount = parseInt(event.currentTarget.dataset.amount) || 1;
    await this.actor.gainHope(amount);
  }

  /**
   * Handle Stress adding
   * @param {Event} event   The originating click event
   * @private
   */
  async _onStressAdd(event) {
    event.preventDefault();
    const amount = parseInt(event.currentTarget.dataset.amount) || 1;
    await this.actor.takeStress(amount);
  }

  /**
   * Handle Stress clearing
   * @param {Event} event   The originating click event
   * @private
   */
  async _onStressClear(event) {
    event.preventDefault();
    const amount = parseInt(event.currentTarget.dataset.amount) || null;
    await this.actor.clearStress(amount);
  }

  /**
   * Handle short rest
   * @param {Event} event   The originating click event
   * @private
   */
  async _onShortRest(event) {
    event.preventDefault();
    
    // Short rest: clear some stress, can swap one card
    const stressToClear = Math.floor(this.actor.system.stress.max / 2);
    await this.actor.clearStress(stressToClear);
    
    ui.notifications.info("Short rest completed! You may swap one domain card between vault and loadout.");
  }

  /**
   * Handle long rest
   * @param {Event} event   The originating click event
   * @private
   */
  async _onLongRest(event) {
    event.preventDefault();
    
    // Long rest: clear all stress, can fully reorganize loadout
    await this.actor.clearStress();
    
    ui.notifications.info("Long rest completed! All stress cleared. You may reorganize your entire loadout.");
  }

  /**
   * Handle dragging items
   * @param {Event} event   The originating dragstart event
   * @private
   */
  _onDragStart(event) {
    const li = event.currentTarget;
    if (event.target.classList.contains("content-link")) return;

    // Create drag data
    const dragData = {
      actorId: this.actor.id,
      sceneId: this.actor.isToken ? canvas.scene?.id : null,
      tokenId: this.actor.isToken ? this.actor.token.id : null
    };

    if (li.dataset.itemId) {
      const item = this.actor.items.get(li.dataset.itemId);
      dragData.type = "Item";
      dragData.uuid = item.uuid;
    }

    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }
} 