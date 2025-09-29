# Changelog

All notable changes to Fret Magic - Guitar Scale Explorer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-09-29

### 🎸 Major Features

#### Drag & Drop Interface (September 29, 2025)
- **NEW**: Complete drag-and-drop functionality for all UI sections
- Users can now rearrange all components including Guitar Settings, Key/Scale/Mode, Display Options, Fretboard, Chord Shapes, and more
- Added visual feedback during drag operations with highlighting and smooth transitions
- "Arrange" mode toggle for customizable layouts

#### Arpeggio Generator (September 25-26, 2025)
- **NEW**: Advanced arpeggio pattern generator with multiple playing styles
- Sweep picking patterns with up/down string traversal (6→1→6)
- Alternate picking, economy picking, and hybrid picking patterns
- Real-time ASCII tablature visualization
- Integration with SoundFont audio engine for playback
- Mobile-optimized with local computation and API fallback

#### Audio System Overhaul (September 25, 2025)
- **REPLACED**: Migrated from Tone.js to SoundFont-player for improved performance
- Better instrument sampling with acoustic and electric guitar sounds
- Reduced latency and improved mobile compatibility
- Shared audio engine between Tuning Helper and other components

#### Mobile UI Enhancements (September 26, 2025)
- **NEW**: Collapsible accordion interface for all major sections
- Responsive design with mobile-first approach
- Touch-optimized controls and gestures
- Improved space utilization on small screens

#### Scale Information & Music Theory (September 25, 2025)
- **NEW**: Diatonic triads and seventh chords display
- Toggle between triads and sevenths view
- Chord quality indicators (major, minor, diminished, augmented)
- Degree notation with Roman numerals
- Policy-aware note spelling (sharps vs flats)

### 🛠️ Improvements

#### Display & Visualization
- **ENHANCED**: Note spelling policy system (September 25, 2025)
  - Global preference for sharps or flats
  - Context-aware spelling based on key signature
  - URL parameter support for sharing preferences
  
- **IMPROVED**: Fretboard display modes (September 4-25, 2025)
  - Three display modes: Notes, Intervals, and Degrees
  - Expanded fret markers for better visibility
  - Fixed first fret positioning and sizing issues
  - Corrected fret number alignment with actual fret lines

#### Chord System
- **FIXED**: Chord shape voicings (September 25, 2025)
  - Corrected sus2 and power chord fingerings
  - Valid voicings for all chord types
  - Improved chord detection algorithm

- **ENHANCED**: Chord Progression Generator (September 4-25, 2025)
  - Advanced progression patterns
  - Audio playback integration
  - Click-to-play individual chords
  - Safe index handling for edge cases

#### Layout & Navigation
- **IMPROVED**: Desktop layout (September 25, 2025)
  - Wider sidebar minimum width (320px)
  - Horizontal scrolling for main content area
  - Better space utilization on large screens

- **FIXED**: Mobile layout (September 4-25, 2025)
  - Clipped fretboard overflow issues
  - Positioned Tuning Helper alongside Fretboard
  - Responsive grid system for tools

### 🐛 Bug Fixes

#### Critical Fixes
- **FIXED**: Blank fretboard on tuning changes (September 4, 2025)
- **FIXED**: Missing notes on first fret (September 4, 2025)
- **FIXED**: Incorrect fret marker positions (September 4, 2025)
- **FIXED**: Neapolitan and Hungarian major scale intervals (September 25, 2025)

#### UI/UX Fixes
- **FIXED**: Duplicate property warnings in ShareControls
- **FIXED**: String order in Tuning Helper (highest pitch at top)
- **FIXED**: Fretboard indexing (1st fret ≠ open string)
- **FIXED**: Note parsing to accept both sharps and flats

### 📚 Documentation
- **ADDED**: Comprehensive README with features and usage
- **ADDED**: Contributing guidelines (CONTRIBUTING.md)
- **ADDED**: Deployment documentation (DEPLOYMENT.md)
- **ADDED**: Production checklist

### 🔧 Technical Changes

#### Build System
- Removed CommonJS require statements
- Fixed TypeScript type definitions
- Resolved external module lint warnings
- Optimized build process for production

#### API Endpoints
- **NEW**: `/api/arpeggio/generate` - Arpeggio pattern generation
- Shared modules between client and server
- Improved error handling and validation

#### Dependencies
- Added `soundfont-player` for audio playback
- Removed heavy `Tone.js` dependency
- Updated React and TypeScript versions

## [0.9.0] - 2025-08-05

### Initial Release Features

#### Core Functionality
- Guitar fretboard visualization for 6, 7, and 8-string guitars
- Support for 50+ scales and modes
- Multiple tuning presets and custom tuning creator
- Interactive note display with color coding

#### Tools & Utilities
- Tuning Helper with audio reference
- Chord shape library
- Audio playback for scales and notes
- Export to PNG/PDF functionality
- Share configurations via URL

#### User Interface
- Responsive design for desktop and mobile
- Dark mode support
- Customizable display options
- Interactive tutorials

## [0.1.0] - 2025-07-22

### Project Initialization
- Base application setup with React and TypeScript
- Core UI components implementation
- Basic fretboard rendering
- Initial scale and chord detection

---

## Legend

- 🎸 Major Features - Significant new functionality
- 🛠️ Improvements - Enhancements to existing features  
- 🐛 Bug Fixes - Resolved issues and problems
- 📚 Documentation - Documentation updates
- 🔧 Technical Changes - Under-the-hood improvements
- ⚠️ Breaking Changes - Changes requiring user action
- 🗑️ Deprecated - Features marked for removal
- 🔒 Security - Security-related updates