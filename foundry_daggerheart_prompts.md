# FoundryVTT System Development Prompts for Daggerheart (via Cursor)

## 🎯 Goal
Create a fully functional FoundryVTT Game System for **Daggerheart**, using the May 2025 System Reference Document (SRD) as source material.

---

## 🧱 1. System Scaffolding

**Prompt:**
```
Generate the complete folder structure for a FoundryVTT system named `daggerheart`. Include:
- system.json
- template.json
- folders for packs (compendia), styles, templates, lang, scripts
- boilerplate for `main.js`, `init.js`, and character sheet HTML
```

---

## 🧙 2. Actor Types (PCs and NPCs)

**Prompt:**
```
Create an Actor type `pc` with support for:
- Six traits (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
- Derived stats: HP, Evasion, Stress, Proficiency, Hope
- Equipped weapon, armor, domain cards
- Support for up to two Domain affiliations, one class, one subclass
- Repeating sections for Experiences, Connections, and Inventory

Then, create an `npc` actor type using a simplified stat block format.
```

---

## 🧬 3. Items

**Prompt:**
```
Create item types:
- `class`: includes class name, HP/Evasion, class item, Hope feature, core feature
- `subclass`: includes spellcasting trait, foundation/specialization/mastery features
- `ancestry`: name, two features
- `community`: name, one feature
- `domain-card`: includes level, domain, recall cost, card type (ability/spell/grimoire), description, vault/loadout logic
- `equipment`: weapon/armor with tier, damage dice, modifiers
- `experience`: short name + modifier
```

---

## 🧰 4. Sheet Templates

**Prompt:**
```
Generate Handlebars templates for PC sheet tabs:
- Overview: traits, HP, Evasion, Proficiency, Hope, Stress
- Heritage: ancestry + community display
- Class: class + subclass display, domain card slots
- Inventory: weapons, armor, potions, supplies
- Roleplay: background, experiences, connections

Include appropriate styles and localization keys.
```

---

## 🎲 5. Dice Mechanics

**Prompt:**
```
Implement Duality Dice (Hope/Fear) mechanic:
- Player rolls two d12s (color-coded)
- Add trait modifier to both
- Higher die sets the outcome (Hope vs Fear)
- Total is compared against a GM-set difficulty
- On tie, it's Fear by default

Add helper for spending Hope to modify rolls.
```

---

## 📦 6. Compendium Setup

**Prompt:**
```
Set up compendia for:
- Classes and Subclasses
- Ancestries and Communities
- Domain Cards
- Equipment
- Monster/NPC stat blocks (for GMs)

Create import helpers for bulk SRD parsing.
```

---

## 🧠 7. Additional Systems

**Prompt:**
```
Add custom UI support for:
- Loadout/vault card management
- Experience-based roll boosts
- Rest mechanics (clearing stress, changing loadout)
- Beastform transformations for Druids
- Domain recall costs (stress cost for swap)
```

---

## 💾 8. JSON Definitions for Compendia

**Prompt:**
```
Write JSON templates to seed compendia with SRD data.
Example: domain cards with fields like name, level, recallCost, domain, type, effect.
```

---

## 📜 9. License & Attribution

**Prompt:**
```
Include `README.md` with link to Darrington Press Community Gaming License:
https://darringtonpress.com/wp-content/uploads/2025/05/DRP-CGL-May-19-2025.pdf

Include Community Content logo and this text:
“This product includes materials from the Daggerheart System Reference Document 1.0 © Critical Role, LLC under the Darrington Press Community Gaming License.”
```

---

## 🧪 10. Playtest Materials (Optional Logic Flag)

**Prompt:**
```
Add internal toggle to prevent commercial publishing of content derived from flagged Playtest Materials, per DPCGL restrictions.
```