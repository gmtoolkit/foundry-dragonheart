# Changelog

All notable changes to the Daggerheart FoundryVTT System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Contribution guidelines and community support
- GitHub Actions automated release workflow
- System validation workflow for CI/CD
- Automated manifest URL updates on release

### Changed
- Updated manifest and download URLs to point to GitHub releases
- Enhanced installation documentation with proper URLs

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [1.0.0] - 2025-01-XX

### Added
- **Complete Daggerheart System Implementation**
  - Full character sheet with 5 tabs (Overview, Heritage, Class, Inventory, Roleplay)
  - Duality Dice system with Hope/Fear mechanics
  - Six traits system (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
  - Derived stats calculation (HP, Evasion, Stress, Proficiency, Hope)
  - Domain card vault/loadout management system
  - Equipment system with tiers and damage calculations
  - Class and subclass support with features
  - Ancestry and community heritage system
  - Experience system for narrative bonuses
  - NPC sheets with simplified stat blocks

- **Core Game Mechanics**
  - Hope and Stress tracking with visual controls
  - Rest mechanics (short and long rest)
  - Domain card recall with stress costs
  - Equipment equip/unequip functionality
  - Automatic modifier calculations

- **User Interface**
  - Modern, responsive character sheet design
  - Color-coded dice roll results
  - Interactive trait rolling
  - Drag and drop item management
  - Beautiful chat integration for rolls and item usage
  - Mobile-friendly responsive design

- **Developer Features**
  - Complete ES6 module structure
  - Comprehensive CSS styling
  - Handlebars template system
  - English localization support
  - Empty compendia ready for content

- **Legal Compliance**
  - MIT license for software code
  - Proper DPCGL attribution for Daggerheart content
  - Playtest content restrictions
  - Community content compliance

### Technical Details
- **Compatibility**: FoundryVTT v11-v12
- **Architecture**: ES6 modules with clean separation of concerns
- **Templates**: Handlebars-based with partial reuse
- **Styling**: Modern CSS with responsive design
- **Licensing**: Dual MIT/DPCGL licensing structure

---

## Legend

- **Added** for new features
- **Changed** for changes in existing functionality  
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes 