# Replit.md

## Overview

This is a calculator application for the Black Ops 6 Terminus Zombies Map code. The repository appears to be in its initial setup phase with only a basic README file present. This is a gaming utility tool designed to help players with code calculations specific to the Terminus map in Call of Duty: Black Ops 6 Zombies mode.

## System Architecture

Flask-based web application with dynamic JavaScript interface:

- **Backend**: Flask server (Python) serving HTML templates and handling calculations
- **Frontend**: Responsive HTML5 interface with Bootstrap styling
- **JavaScript**: Interactive symbol selection, multi-language support, voice recognition
- **Calculations**: Server-side mathematical processing with modulo constraints (0-59 range)
- **Features**: Real-time results, keyboard shortcuts, accessibility support

## Key Components

1. **Flask Application** (`app.py`) - Main server with calculation endpoints
2. **Calculator Interface** (`templates/index.html`) - Multi-language symbol selection UI
3. **JavaScript Controller** (`static/script.js`) - DOM manipulation, voice recognition, language switching
4. **Calculation Logic** - Mathematical formulas with modulo operations for 0-59 range
5. **Symbol Assets** (`static/images/`) - SVG symbols for visual selection
6. **Responsive Styling** (`static/style.css`) - Bootstrap-based responsive design

## Data Flow

Data flow is not yet established. The expected flow would be:

1. User inputs initial values or parameters
2. Application processes inputs through calculation algorithms
3. Results are computed and validated
4. Final codes/solutions are displayed to the user

## External Dependencies

No external dependencies are currently defined. Potential dependencies may include:

- Web framework (if web-based)
- UI libraries for enhanced user experience
- Math libraries for complex calculations (if needed)

## Deployment Strategy

Deployment strategy is not yet defined. Options may include:

- Static web hosting (GitHub Pages, Netlify, Vercel)
- Replit hosting for easy access and sharing
- Desktop application distribution
- Mobile app stores (if mobile version is developed)

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
- June 27, 2025. Fixed JavaScript DOM errors and Flask server startup issues
  - Added null checks for DOM element access
  - Enhanced error handling for speech recognition
  - Improved variable button state management
  - Fixed language switching functionality
  - Server now starts correctly and responds to requests
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```