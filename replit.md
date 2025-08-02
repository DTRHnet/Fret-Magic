# Guitar Scales and Modes Explorer

## Overview

FretMagic is a modern web application for exploring guitar scales, modes, and tunings across 6, 7, and 8-string guitars. The app provides an interactive fretboard visualization with support for custom tunings, various scales and modes, and flexible display options. Built as a full-stack TypeScript application with React frontend and Express backend.

**Status**: Production-ready with critical fixes applied. Extended range guitar support and audio improvements implemented.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Critical Fixes (January 2025)

### Production Issues Resolved
1. **Chord Shape Display**: Fixed backwards chord diagrams - string order now correct (low E at bottom)
2. **Extended Range Support**: Added 7 and 8-string guitar chord support with proper string count rendering
3. **Audio Production Issues**: Enhanced Tone.js initialization with proper user interaction handling for production environments
4. **Fretboard String Order**: Corrected string display order (E-A-D-G-B-E from bottom to top)
5. **Layout Improvements**: Implemented 2-column desktop layout with drag/drop toggle functionality

### Production Readiness
- Created comprehensive production checklist with all functionality tests
- Generated detailed pre-deployment report documenting current status
- Prepared post-deployment report template for monitoring
- All critical blocking issues have been addressed

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: React hooks with custom hook patterns (`useFretboard`)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Development**: TSX for TypeScript execution
- **Build Process**: esbuild for production bundling
- **Static Serving**: Vite middleware in development, static files in production

### Database Layer
- **ORM**: Drizzle ORM with TypeScript schema
- **Database**: PostgreSQL (configured via environment variable)
- **Connection**: Neon serverless database driver
- **Migrations**: Drizzle Kit for schema management
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Key Components

### Core Features
1. **Guitar Configuration**
   - Support for 6, 7, and 8-string guitars
   - Preset tunings (Standard, Drop D, DADGAD, Open tunings)
   - Custom tuning input with note validation

2. **Scale and Mode System**
   - Complete modal system (Ionian through Locrian)
   - Pentatonic scales (Major and Minor)
   - Exotic scales support structure
   - Root note selection across all 12 chromatic notes

3. **Interactive Fretboard**
   - SVG-based fretboard visualization
   - Dynamic note highlighting with color coding
   - Toggle between note names and interval notation
   - Adjustable fret range (up to 24 frets)
   - Responsive design for desktop and mobile

4. **Display Controls**
   - Note vs interval display modes
   - Selective visibility controls (root notes, scale notes, fret numbers)
   - Fret range slider for focused practice areas

### Music Theory Engine
- **Note System**: 12-tone equal temperament with enharmonic handling
- **Scale Generation**: Interval-based scale calculation from root notes
- **Fretboard Mapping**: Dynamic note calculation across strings and frets
- **Validation**: Input validation for musical notes and tunings

### Data Models
- **Users**: Authentication and user management
- **Presets**: Saved configurations (tuning, scale, display preferences)
- **Schema Validation**: Zod integration for type-safe data validation

## Data Flow

1. **User Input**: Guitar type, tuning, and scale selection through UI controls
2. **State Management**: Custom `useFretboard` hook manages all application state
3. **Calculation Engine**: Music theory functions calculate fretboard note positions
4. **Visualization**: React components render interactive SVG fretboard
5. **Persistence**: User presets saved to PostgreSQL via Drizzle ORM
6. **Real-time Updates**: State changes trigger immediate fretboard updates

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first styling with custom theme integration
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant handling for components

### Development and Build
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Tailwind integration

### Database and Backend
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL hosting
- **Express**: Web server framework
- **Connect-pg-simple**: Session storage for PostgreSQL

### Utilities
- **Date-fns**: Date manipulation utilities
- **Zod**: Runtime type validation
- **React Hook Form**: Form state management with validation
- **TanStack Query**: Server state management and caching

## Deployment Strategy

### Development Environment
- **Server**: Express with Vite middleware for HMR
- **Database**: Local PostgreSQL or Neon development instance
- **Build Process**: TSX for TypeScript execution without compilation
- **Hot Reload**: Vite HMR for frontend, nodemon-style restart for backend

### Production Build
- **Frontend**: Vite build to static assets in `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Database**: PostgreSQL via DATABASE_URL environment variable
- **Deployment**: Single Node.js process serving both API and static files

### Configuration
- **Environment**: DATABASE_URL for database connection
- **Build Commands**: Separate dev/build/start scripts for different environments
- **Type Checking**: `tsc --noEmit` for type validation without compilation
- **Database Migrations**: `drizzle-kit push` for schema updates

The application is designed for easy deployment to platforms like Replit, Vercel, or traditional VPS hosting, with minimal configuration required beyond the database connection string.