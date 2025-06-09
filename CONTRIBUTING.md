# Contributing to Daggerheart FoundryVTT System

Thank you for your interest in contributing to the Daggerheart FoundryVTT system! This project welcomes contributions from the community to help make the best possible Daggerheart experience for players and GMs.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Types of Contributions](#types-of-contributions)
- [Licensing and Legal Considerations](#licensing-and-legal-considerations)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project follows a standard code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Respect licensing and legal requirements
- Keep discussions relevant to the project

## 🚀 Getting Started

### Prerequisites
- **FoundryVTT** (version 11 or higher)
- **Node.js** (for development tools, optional)
- **Git** for version control
- Basic knowledge of JavaScript, HTML, and CSS
- Understanding of FoundryVTT system development

### Quick Start
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 🛠️ Types of Contributions

We welcome several types of contributions:

### 🐛 Bug Fixes
- Fix system crashes or errors
- Resolve UI/UX issues
- Correct calculation errors
- Fix compatibility problems

### ✨ Features
- New functionality that enhances gameplay
- Quality of life improvements
- Additional automation
- Performance optimizations

### 📚 Documentation
- Improve README or contributing guides
- Add code comments and documentation
- Create user guides or tutorials
- Fix typos and grammar

### 🎨 UI/UX Improvements
- Better visual design
- Improved accessibility
- Mobile responsiveness
- User experience enhancements

### 🧪 Testing
- Add automated tests
- Report bugs with reproduction steps
- Test new features
- Verify compatibility across FoundryVTT versions

### 🌐 Localization
- Translate the system to other languages
- Improve existing translations
- Add localization support for new features

## ⚖️ Licensing and Legal Considerations

**IMPORTANT**: This project has dual licensing that affects contributions:

### Software Code (MIT Licensed)
- **JavaScript files** (`*.js`)
- **CSS stylesheets** (`*.css`) 
- **HTML templates** (`*.html`)
- **JSON configuration** (`*.json`)
- **Documentation** (`*.md`)

**Your Contributions**: By contributing software code, you agree to license your contributions under the MIT License. This means:
- ✅ Your code can be used, modified, and redistributed freely
- ✅ Your code can be used in commercial projects
- ✅ You retain copyright to your contributions
- ✅ You grant others the right to use your code under MIT terms

### Game Content (DPCGL Licensed)
- **Daggerheart-specific rules** and mechanics
- **Class, ancestry, community definitions**
- **Domain cards and spells**
- **Monster stat blocks**
- **Any content derived from Daggerheart SRD**

**Content Contributions**: Game content must comply with the [Darrington Press Community Gaming License](https://darringtonpress.com/wp-content/uploads/2025/05/DRP-CGL-May-19-2025.pdf):
- ✅ Can be used for non-commercial community content
- ❌ Cannot be used for commercial purposes without separate licensing
- ⚠️ Must include proper attribution
- ⚠️ Cannot include copyrighted material not in the SRD

### What This Means for You
1. **Software improvements** are fully open source (MIT)
2. **Game content additions** must follow DPCGL restrictions
3. **Original creative work** (your own homebrew) can be licensed as you choose
4. **Always respect** Critical Role's intellectual property

## 🔧 Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/gmtoolkit/foundry-daggerheart.git
cd foundry-daggerheart
```

### 2. FoundryVTT Setup
```bash
# Create symlink to your FoundryVTT systems directory
ln -s /path/to/foundry-daggerheart /path/to/foundrydata/Data/systems/daggerheart
```

### 3. Development Branch
```bash
# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 4. Development Tools (Optional)
```bash
# If you want to use development tools
npm install
# Run linting
npm run lint
# Run tests
npm test
```

## 📝 Contribution Workflow

### 1. Plan Your Contribution
- Check existing issues and discussions
- Create an issue to discuss major changes
- Ensure your idea aligns with project goals
- Consider licensing implications

### 2. Make Your Changes
- Keep changes focused and atomic
- Follow existing code patterns
- Add comments for complex logic
- Update documentation as needed

### 3. Test Thoroughly
- Test in a clean FoundryVTT world
- Verify functionality across different scenarios
- Check for console errors
- Test with different FoundryVTT versions if possible

### 4. Submit Pull Request
- Write a clear, descriptive title
- Include a detailed description of changes
- Reference any related issues
- Include screenshots for UI changes
- Mark as draft if work in progress

### 5. Code Review
- Respond to reviewer feedback
- Make requested changes
- Keep discussion respectful and constructive
- Ask questions if feedback is unclear

## 📐 Style Guidelines

### JavaScript
- Use ES6+ modern JavaScript
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Handle errors gracefully

```javascript
/**
 * Calculate derived statistics for a character
 * @param {Object} systemData - The character's system data
 * @returns {Object} Updated system data with calculated values
 */
_calculateDerivedStats(systemData) {
  // Clear, descriptive implementation
}
```

### HTML/Handlebars
- Use semantic HTML elements
- Follow existing template patterns
- Include accessibility attributes
- Use consistent indentation

```html
<div class="form-group">
  <label for="trait-value">Trait Value</label>
  <input type="number" name="trait.value" id="trait-value" value="{{trait.value}}" />
</div>
```

### CSS
- Use existing CSS classes when possible
- Follow BEM-like naming conventions
- Include responsive design considerations
- Comment complex selectors

```css
/* Trait display in character sheet */
.daggerheart .trait-display {
  display: flex;
  align-items: center;
  gap: 10px;
}
```

### JSON
- Use consistent formatting
- Include all required fields
- Add comments where helpful (in JS files that generate JSON)

## 🧪 Testing

### Manual Testing
- Create test characters with various configurations
- Test edge cases (high/low values, empty fields)
- Verify dice rolling mechanics
- Test item creation and management
- Check sheet responsiveness

### Automated Testing (Future)
- Unit tests for calculation functions
- Integration tests for major workflows
- Regression tests for bug fixes

### Bug Reports
When reporting bugs, include:
- FoundryVTT version
- System version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages
- Screenshots if applicable

## 📖 Documentation

### Code Documentation
- Add JSDoc comments to all public methods
- Document complex algorithms
- Explain business logic and game rules
- Include parameter types and return values

### User Documentation
- Update README for new features
- Create setup guides for complex features
- Document configuration options
- Include troubleshooting tips

## 🎯 Specific Contribution Areas

### High Priority
- Bug fixes and stability improvements
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Localization support

### Medium Priority
- Quality of life features
- Additional automation
- Enhanced UI/UX
- Documentation improvements

### Low Priority
- Advanced features
- Experimental functionality
- Cosmetic improvements

## 🔄 Release Process

This project uses **automated releases** through GitHub Actions to ensure consistent packaging and distribution.

### Version Numbers
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Major: Breaking changes
- Minor: New features, backwards compatible  
- Patch: Bug fixes

### Creating a Release

1. **Prepare for Release**
   - Ensure all changes are merged to `main` branch
   - Update version in `system.json` 
   - Update `CHANGELOG.md` with new version details
   - Test thoroughly in FoundryVTT

2. **Create Release on GitHub**
   - Go to [Releases](https://github.com/gmtoolkit/foundry-dragonheart/releases)
   - Click "Create a new release"
   - Create a new tag (e.g., `v1.1.0`)
   - Title the release (e.g., "Version 1.1.0 - Feature Description")
   - Write release notes describing changes
   - Click "Publish release"

3. **Automated Process**
   - GitHub Actions automatically triggers on release creation
   - Updates `system.json` with correct version and download URLs
   - Creates `system.zip` with all necessary files (excluding dev files)
   - Attaches both `system.json` and `system.zip` to the release
   - Updates the `latest` release tag

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated  
- [ ] Version numbers incremented in `system.json`
- [ ] `CHANGELOG.md` updated with new version
- [ ] License compliance verified (Any SRD content must comply with [DPCGL](https://darringtonpress.com/wp-content/uploads/2025/05/DRP-CGL-May-19-2025.pdf) and software released under MIT license)
- [ ] Release created with proper tag and description
- [ ] Automated build completed successfully
- [ ] Manual verification of release artifacts

### Automated Release Files

The GitHub Action creates these files automatically:

- **`system.json`**: Manifest with updated version and URLs
- **`system.zip`**: Complete system package excluding development files

**Files Excluded from Release** (see `.github/zip-exclude.lst`):
- Git files and history
- Development tools and configs  
- IDE files
- Temporary and cache files
- Test files
- Documentation source files (CONTRIBUTING.md, etc.)

### Rollback Process

If a release has issues:
1. **Hot Fix**: Create a patch release with fixes
2. **Revert**: Delete the problematic release and recreate  
3. **Emergency**: Manually edit release artifacts if needed

### Release Notifications

- Releases are visible on the GitHub repository
- Users get automatic updates through FoundryVTT's system updater
- Community can be notified through Discord/forums as appropriate

## 📞 Getting Help

### Questions and Support
- Create a GitHub Discussion for questions
- Use GitHub Issues for bug reports
- Join community Discord servers
- Check existing documentation first

### Mentorship
- New contributors are welcome!
- Ask for help in discussions
- Start with small, focused contributions
- Learn from code review feedback

## 🏆 Recognition

Contributors will be:
- Listed in project documentation
- Credited in release notes
- Given contributor status on GitHub
- Thanked in the community

## 📜 Legal Disclaimer

By contributing to this project, you certify that:
- You have the right to submit your contribution
- Your contribution is your original work or properly licensed
- You understand the dual licensing structure
- You agree to the terms outlined in this document

---

Thank you for contributing to the Daggerheart FoundryVTT system! Together we can create an amazing tool for the Daggerheart community! 🎲✨ 