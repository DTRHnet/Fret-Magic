# Contributing to FretMagic

Thank you for your interest in contributing to FretMagic! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions
- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new functionality
- **Code Contributions**: Implement features or fix bugs
- **Documentation**: Improve guides and documentation
- **Testing**: Help test features across different browsers/devices

## 🚀 Getting Started

### Development Setup
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/fretmagic.git
   cd fretmagic
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

### Project Structure
```
fretmagic/
├── client/src/
│   ├── components/     # UI components
│   ├── lib/           # Core logic (music theory, audio, etc.)
│   ├── hooks/         # Custom React hooks
│   └── pages/         # Application pages
├── server/            # Backend API
├── shared/            # Shared types and schemas
└── docs/              # Documentation
```

## 🎵 Music Theory Guidelines

### Scale Implementation
- Follow standard Western music theory
- Use semitone intervals for calculations
- Maintain enharmonic equivalence where appropriate
- Document any non-standard implementations

### Chord Logic
- Implement proper voice leading
- Support multiple fingerings per chord
- Ensure compatibility across guitar types (6/7/8 string)
- Include chord quality detection (major/minor/diminished)

### Audio Features
- Respect browser autoplay policies
- Implement proper error handling
- Support multiple instrument tones
- Maintain consistent timing and tempo

## 💻 Code Style

### TypeScript Standards
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations
- Avoid `any` types when possible

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Follow React performance guidelines
- Use proper key props for lists

### Naming Conventions
- Components: PascalCase (`AudioControls`)
- Files: kebab-case (`audio-controls.tsx`)
- Functions: camelCase (`playNote`)
- Constants: UPPER_SNAKE_CASE (`TUNING_PRESETS`)

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Test across different guitar types (6/7/8 string)
- [ ] Verify scale accuracy across all modes
- [ ] Check chord shapes display correctly
- [ ] Test audio functionality after user interaction
- [ ] Validate responsive design on mobile/tablet
- [ ] Cross-browser compatibility testing

### Browser Testing
- **Required**: Chrome, Firefox, Safari, Edge (latest versions)
- **Audio Testing**: Ensure audio works after user interaction
- **Mobile Testing**: iOS Safari, Android Chrome

## 🎸 Feature Development

### Adding New Scales
1. **Define scale intervals** in `client/src/lib/music-theory.ts`
2. **Add to SCALES constant** with proper metadata
3. **Test across all root notes** for accuracy
4. **Update documentation** with scale information

### Adding Guitar Types
1. **Update guitar type constants** in relevant files
2. **Add tuning presets** for the new guitar type
3. **Create chord shapes** specific to string count
4. **Test fretboard rendering** for proper display

### Adding Audio Features
1. **Extend AudioEngine class** in `client/src/lib/audio.ts`
2. **Implement browser-compliant initialization**
3. **Add proper error handling** for audio failures
4. **Test across different browsers** and devices

## 📋 Pull Request Process

### Before Submitting
1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Write clear commit messages**: Describe what and why
3. **Test thoroughly**: Manual testing across browsers
4. **Update documentation**: If adding new features
5. **Check TypeScript**: Ensure no compilation errors

### Pull Request Template
```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing Done
- [ ] Manual testing completed
- [ ] Cross-browser testing
- [ ] Mobile testing (if applicable)
- [ ] Audio testing (if applicable)

## Screenshots
Include screenshots for UI changes

## Additional Notes
Any additional context or considerations
```

### Review Process
1. **Automated Checks**: TypeScript compilation, linting
2. **Manual Review**: Code quality, music theory accuracy
3. **Testing**: Feature functionality across environments
4. **Documentation**: Ensure proper documentation updates

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Guitar Type: 8-string
- Scale: C Dorian

## Screenshots
Include screenshots if applicable

## Additional Context
Any other relevant information
```

## 🌟 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Implementation
How might this work?

## Alternative Solutions
Any alternative approaches considered

## Additional Context
Any other relevant information
```

## 🎓 Learning Resources

### Music Theory
- [Music Theory Fundamentals](https://www.musictheory.net/)
- [Guitar Scale Theory](https://www.fretjam.com/guitar-scales.html)
- [Chord Construction](https://www.guitarhabits.com/chord-construction/)

### Web Audio API
- [Tone.js Documentation](https://tonejs.github.io/)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### React/TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Through pull request comments

### Response Times
- **Bug Reports**: We aim to respond within 48 hours
- **Feature Requests**: We review and respond within 1 week
- **Pull Requests**: We aim to review within 3-5 business days

## 🤝 Code of Conduct

### Our Standards
- **Respectful Communication**: Be kind and professional
- **Inclusive Environment**: Welcome all contributors
- **Constructive Feedback**: Focus on improvement, not criticism
- **Learning Focus**: Help others learn and grow

### Music Community Values
- **Accuracy**: Maintain music theory accuracy
- **Education**: Support learning and growth
- **Accessibility**: Make tools available to all skill levels
- **Quality**: Strive for excellence in implementation

## 🏆 Recognition

### Contributors
All contributors are recognized in:
- **README Contributors Section**
- **GitHub Contributors Graph**
- **Release Notes** for significant contributions

### Types of Recognition
- **Code Contributors**: Feature implementation, bug fixes
- **Documentation**: Guides, tutorials, API documentation
- **Testing**: Bug reports, compatibility testing
- **Design**: UI/UX improvements, accessibility
- **Community**: Support, discussions, feedback

---

**Thank you for contributing to FretMagic!**

*Together, we're building the best guitar learning tool for musicians everywhere.*