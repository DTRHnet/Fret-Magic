# FretMagic - Guitar Scales and Modes Explorer

**A comprehensive interactive guitar fretboard exploration tool for musicians and guitar learners**

![FretMagic Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=FretMagic+Screenshot)

## 🎸 Features

### Core Functionality
- **Multi-Guitar Support**: 6, 7, and 8-string guitars with proper chord shapes
- **Complete Modal System**: All 7 modes (Ionian through Locrian) 
- **Pentatonic Scales**: Major and Minor pentatonic patterns
- **Custom Tunings**: Full support for standard, drop, open, and custom tunings
- **Interactive Fretboard**: Click-to-hear notes with visual feedback

### Advanced Tools
- **Chord Shape Generator**: Displays proper chord diagrams with correct fingering
- **Audio Playback**: Scale playback, chord progressions, and individual notes
- **Multiple Tones**: Acoustic, electric, clean, distorted, and bass tones
- **Export Features**: PNG and PDF export with metadata
- **Share System**: URL-based configuration sharing

### Educational Features
- **Tutorial Mode**: Guided interactive tour of all features
- **Music Theory Integration**: Interval notation and chord theory explanations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fretmagic.git
   cd fretmagic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

### Production Build

```bash
npm run build
npm start
```

## 🎵 How to Use

### Basic Operation
1. **Select Guitar Type**: Choose 6, 7, or 8-string guitar
2. **Choose Tuning**: Select from presets or create custom tuning
3. **Pick a Scale**: Select root note and scale/mode type
4. **Explore**: View scale patterns, chord shapes, and play audio

### Advanced Features
- **Audio Playback**: Click the play button to hear scales and chords
- **Chord Shapes**: View fingering diagrams for scale-based chords
- **Export**: Save fretboard images or create shareable links
- **Tutorial**: Click the help icon for guided tour

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Tone.js** for audio synthesis
- **Wouter** for routing

### Backend  
- **Node.js** with Express
- **TypeScript** with ES modules
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence

### Development Tools
- **ESBuild** for production bundling
- **PostCSS** with Tailwind integration
- **TypeScript** strict mode compilation
- **Vite HMR** for development

## 🎯 Project Structure

```
fretmagic/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/           # Utilities and logic
│   │   ├── hooks/         # Custom React hooks
│   │   └── assets/        # Static assets
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data layer abstraction
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schemas
└── docs/                  # Documentation
```

## 🎼 Music Theory Implementation

### Scale System
- **Chromatic Foundation**: 12-tone equal temperament
- **Interval Calculation**: Mathematical interval relationships
- **Mode Generation**: Automatic mode derivation from parent scales
- **Enharmonic Handling**: Proper note name resolution

### Chord Generation
- **Triad Construction**: Root, third, fifth relationships
- **Quality Detection**: Major, minor, diminished chord types
- **Voice Leading**: Multiple fingering positions per chord
- **Extended Range**: Proper chord shapes for 7 and 8-string guitars

### Audio Engine
- **Synthesis**: Web Audio API via Tone.js
- **Guitar Tones**: Multiple preset tones with envelope shaping
- **Frequency Calculation**: Precise note frequency generation
- **Production Ready**: Browser autoplay policy compliance

## 🔧 Configuration

### Environment Variables
```bash
# Database (optional - uses in-memory storage by default)
DATABASE_URL=postgresql://user:password@host:port/database

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Custom Tunings
The app supports unlimited custom tunings. Simply select "Custom" and enter note names for each string.

### Audio Configuration
Audio requires user interaction to start (browser security requirement). Click any audio button to enable sound.

## 📱 Browser Support

### Fully Supported
- Chrome 90+ (Desktop/Mobile)
- Firefox 88+ (Desktop/Mobile) 
- Safari 14+ (Desktop/Mobile)
- Edge 90+ (Desktop)

### Audio Support
- Web Audio API required for audio features
- Modern browsers with user interaction requirement
- Graceful fallback for unsupported browsers

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with proper testing
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Development Guidelines
- Follow TypeScript strict mode
- Use existing component patterns
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness

## 📋 Roadmap

### Current Version (1.0)
- ✅ Complete modal system implementation
- ✅ Multi-guitar support (6/7/8 string)
- ✅ Audio playback with multiple tones
- ✅ Chord shape generation
- ✅ Export and sharing features

### Future Enhancements
- 🔄 User accounts and preset saving
- 🔄 Advanced chord progressions
- 🔄 Tablature export
- 🔄 Backing track integration
- 🔄 Mobile app version

### Exotic Scales
- 🔄 Blues scales
- 🔄 Harmonic minor modes
- 🔄 Melodic minor modes
- 🔄 Symmetrical scales

## 🐛 Known Issues

### Development
- Audio may not work in development due to browser policies (works in production)
- Hot reload occasionally requires page refresh for audio

### Production Ready
- All critical issues resolved as of January 2025
- Comprehensive testing completed
- Performance optimized for production deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Music Theory**: Based on standard Western music theory
- **Guitar Community**: Inspired by guitar learning resources
- **Open Source**: Built with amazing open source technologies
- **Contributors**: Thanks to all who have contributed to this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/fretmagic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/fretmagic/discussions)
- **Documentation**: [Project Wiki](https://github.com/yourusername/fretmagic/wiki)

---

**Made with ❤️ for the guitar community**

*FretMagic - Explore, Learn, Play*