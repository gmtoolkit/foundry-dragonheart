/**
 * Duality Dice system for Daggerheart
 * Implements the Hope/Fear mechanic with two d12s
 */
export class DualityDice {

  /**
   * Roll Duality Dice (Hope/Fear system)
   * @param {number} modifier - Trait modifier to add to both dice
   * @param {Object} options - Roll options
   * @param {number} options.difficulty - Target difficulty (default 12)
   * @param {number} options.hopeSpent - Amount of Hope spent to boost the roll
   * @param {string} options.flavor - Flavor text for the roll
   * @param {boolean} options.blindRoll - Whether this is a blind GM roll
   */
  static async roll(modifier = 0, options = {}) {
    const {
      difficulty = 12,
      hopeSpent = 0,
      flavor = "",
      blindRoll = false
    } = options;

    // Roll two d12s
    const hopeDie = new Roll("1d12");
    const fearDie = new Roll("1d12");
    
    await hopeDie.evaluate();
    await fearDie.evaluate();

    const hopeRaw = hopeDie.total;
    const fearRaw = fearDie.total;

    // Add modifier to both dice
    const hopeTotal = hopeRaw + modifier + hopeSpent;
    const fearTotal = fearRaw + modifier;

    // Determine which die is higher (Hope vs Fear)
    const isHope = hopeTotal > fearTotal;
    const isDraw = hopeTotal === fearTotal;
    
    // On a tie, it's Fear by default (as per rules)
    const outcome = isDraw ? "fear" : (isHope ? "hope" : "fear");
    const totalValue = isHope ? hopeTotal : fearTotal;

    // Determine success/failure
    const isSuccess = totalValue >= difficulty;
    const isCriticalSuccess = (hopeRaw === 12 && isHope) || (fearRaw === 12 && !isHope);
    const isCriticalFailure = (hopeRaw === 1 && fearRaw === 1);

    // Create the roll result
    const rollResult = {
      hopeDie: hopeRaw,
      fearDie: fearRaw,
      hopeTotal,
      fearTotal,
      modifier,
      hopeSpent,
      outcome,
      totalValue,
      difficulty,
      isSuccess,
      isCriticalSuccess,
      isCriticalFailure,
      flavor,
      hopeRoll: hopeDie,
      fearRoll: fearDie
    };

    // Create chat message
    await this._createChatMessage(rollResult, { blindRoll });

    return rollResult;
  }

  /**
   * Create a chat message for the duality dice roll
   * @param {Object} result - The roll result
   * @param {Object} options - Message options
   */
  static async _createChatMessage(result, options = {}) {
    const { blindRoll = false } = options;

    // Determine the outcome color and icon
    let outcomeClass = "";
    let outcomeIcon = "";
    let outcomeText = "";

    if (result.isCriticalSuccess) {
      outcomeClass = "critical-success";
      outcomeIcon = "fas fa-star";
      outcomeText = "Critical Success!";
    } else if (result.isCriticalFailure) {
      outcomeClass = "critical-failure";  
      outcomeIcon = "fas fa-skull";
      outcomeText = "Critical Failure!";
    } else if (result.isSuccess) {
      outcomeClass = result.outcome === "hope" ? "hope-success" : "fear-success";
      outcomeIcon = result.outcome === "hope" ? "fas fa-heart" : "fas fa-bolt";
      outcomeText = result.outcome === "hope" ? "Success with Hope!" : "Success with Fear!";
    } else {
      outcomeClass = result.outcome === "hope" ? "hope-failure" : "fear-failure";
      outcomeIcon = result.outcome === "hope" ? "fas fa-heart-broken" : "fas fa-cloud";
      outcomeText = result.outcome === "hope" ? "Failure with Hope" : "Failure with Fear";
    }

    // Build the chat message content
    const messageContent = `
      <div class="duality-dice-roll ${outcomeClass}">
        <div class="roll-header">
          <h3><i class="${outcomeIcon}"></i> ${outcomeText}</h3>
          ${result.flavor ? `<div class="flavor-text">${result.flavor}</div>` : ""}
        </div>
        
        <div class="dice-results">
          <div class="die-result hope-die">
            <div class="die-face">${result.hopeDie}</div>
            <div class="die-label">Hope Die</div>
            <div class="die-total">${result.hopeTotal}</div>
          </div>
          
          <div class="vs-divider">VS</div>
          
          <div class="die-result fear-die">
            <div class="die-face">${result.fearDie}</div>
            <div class="die-label">Fear Die</div>
            <div class="die-total">${result.fearTotal}</div>
          </div>
        </div>
        
        <div class="roll-details">
          <div class="detail-row">
            <span class="label">Modifier:</span>
            <span class="value">${result.modifier >= 0 ? '+' : ''}${result.modifier}</span>
          </div>
          ${result.hopeSpent > 0 ? `
            <div class="detail-row">
              <span class="label">Hope Spent:</span>
              <span class="value">+${result.hopeSpent}</span>
            </div>
          ` : ""}
          <div class="detail-row">
            <span class="label">Final Result:</span>
            <span class="value">${result.totalValue} vs ${result.difficulty}</span>
          </div>
        </div>
      </div>
    `;

    // Create the chat message
    const chatData = {
      user: game.user.id,
      content: messageContent,
      sound: CONFIG.sounds.dice,
      rolls: [result.hopeRoll, result.fearRoll]
    };

    if (blindRoll) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    }

    return ChatMessage.create(chatData);
  }

  /**
   * Quick roll dialog for GMs and players
   * @param {Object} options - Roll configuration
   */
  static async rollDialog(options = {}) {
    const template = "systems/daggerheart/templates/dice/duality-roll-dialog.html";
    
    const dialogData = {
      modifier: options.modifier || 0,
      difficulty: options.difficulty || 12,
      hopeAvailable: options.hopeAvailable || 0,
      flavor: options.flavor || ""
    };

    const html = await renderTemplate(template, dialogData);

    return new Promise(resolve => {
      const dialog = new Dialog({
        title: "Duality Dice Roll",
        content: html,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice"></i>',
            label: "Roll!",
            callback: html => resolve(this._processDialogForm(html))
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => resolve(null)
          }
        },
        default: "roll",
        close: () => resolve(null)
      });
      dialog.render(true);
    });
  }

  /**
   * Process the roll dialog form
   * @param {jQuery} html - The dialog HTML
   */
  static _processDialogForm(html) {
    const form = html[0].querySelector("form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    return this.roll(parseInt(data.modifier) || 0, {
      difficulty: parseInt(data.difficulty) || 12,
      hopeSpent: parseInt(data.hopeSpent) || 0,
      flavor: data.flavor || "",
      blindRoll: data.blindRoll === "true"
    });
  }

  /**
   * Register chat log listeners for duality dice
   */
  static addChatListeners(html) {
    html.on('click', '.duality-dice-roll', this._onDiceRollClick.bind(this));
  }

  /**
   * Handle clicking on a duality dice roll in chat
   */
  static _onDiceRollClick(event) {
    event.preventDefault();
    const card = event.currentTarget;
    const messageId = card.closest(".message").dataset.messageId;
    const message = game.messages.get(messageId);
    
    // Could add functionality here like rerolling with Hope, etc.
  }
} 