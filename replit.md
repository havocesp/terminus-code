# Flask Calculator Application

## Overview

This is a web-based mathematical calculator application built with Flask. The application provides a simple interface for users to input three values (X, Y, Z) within the range of 0-59 and performs calculations on them. The frontend uses Bootstrap for styling and JavaScript for client-side validation and form handling.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 (Flask's default templating engine)
- **UI Framework**: Bootstrap 5 with dark theme
- **Client-side Logic**: Vanilla JavaScript for form validation and AJAX requests
- **Styling**: Custom CSS combined with Bootstrap for enhanced visual appeal

### Backend Architecture
- **Web Framework**: Flask (Python micro-framework)
- **Application Structure**: Simple modular structure with separate concerns
  - `main.py`: Application entry point
  - `app.py`: Core Flask application with routes and business logic
  - `templates/`: HTML templates
  - `static/`: CSS and JavaScript assets

### Request Handling
- **Main Route** (`/`): Serves the calculator interface
- **API Endpoint** (`/calculate`): Processes POST requests with JSON data and returns calculation results
- **Input Validation**: Both client-side (JavaScript) and server-side (Flask) validation

## Key Components

### 1. Flask Application (`app.py`)
- Handles HTTP requests and responses
- Implements input validation for three integer values (0-59 range)
- Processes mathematical calculations (implementation appears incomplete)
- Returns JSON responses for API calls

### 2. Frontend Interface (`templates/index.html`)
- Responsive form with three number inputs (X, Y, Z)
- Bootstrap-styled interface with dark theme
- Real-time input validation feedback
- Results display section for calculation outputs

### 3. Client-side Logic (`static/script.js`)
- Form submission handling with AJAX
- Real-time input validation (0-59 range)
- Loading states and error message display
- Bootstrap validation classes integration

### 4. Styling (`static/style.css`)
- Custom result card designs with hover effects
- Color-coded result sections (info, success, warning themes)
- Enhanced visual feedback for different calculation results

## Data Flow

1. **User Input**: User enters three values (X, Y, Z) in the web form
2. **Client Validation**: JavaScript validates inputs in real-time (0-59 range)
3. **Form Submission**: AJAX POST request sends JSON data to `/calculate` endpoint
4. **Server Processing**: Flask validates inputs and performs calculations
5. **Response**: Server returns JSON with results or error messages
6. **UI Update**: JavaScript updates the interface with results or error displays

## External Dependencies

### Python Dependencies (from `pyproject.toml`)
- **Flask** (v3.1.1): Web framework
- **Flask-SQLAlchemy** (v3.1.1): Database ORM (configured but not actively used)
- **Gunicorn** (v23.0.0): WSGI HTTP server for production deployment
- **psycopg2-binary** (v2.9.10): PostgreSQL adapter (configured but not used)
- **email-validator** (v2.2.0): Email validation utilities

### Frontend Dependencies (CDN)
- **Bootstrap 5**: UI framework with dark theme
- **Bootstrap Icons**: Icon library (referenced but not actively used)

### System Dependencies
- **PostgreSQL**: Database system (configured in Nix but not used in current implementation)
- **OpenSSL**: Security library

## Deployment Strategy

### Production Environment
- **Server**: Gunicorn WSGI server
- **Binding**: 0.0.0.0:5000 (accessible from all network interfaces)
- **Deployment Target**: Autoscale configuration for dynamic scaling
- **Process Management**: Gunicorn with reuse-port and reload options for development

### Development Environment
- **Runtime**: Python 3.11
- **Package Manager**: UV for dependency management
- **Environment**: Nix-based development environment
- **Hot Reload**: Enabled for development workflow

### Configuration
- **Session Management**: Configurable secret key via environment variable
- **Logging**: Debug-level logging enabled
- **Error Handling**: JSON-based error responses for API endpoints

## Changelog

Changelog:
- June 27, 2025. Initial setup - Created Flask calculator web application
- June 27, 2025. Added default values of 0 to all input fields (X, Y, Z) for better user experience
- June 27, 2025. Upgraded to symbol-based interface with 6 clickable symbols (values: 0, 10, 11, 20, 21, 22)
- June 27, 2025. Simplified interface: Changed title to "Terminus Calculator", removed text labels, streamlined results display
- June 27, 2025. Added multilingual support (Spanish, English, Portuguese, Italian, French) with flag icons
- June 27, 2025. Implemented voice input recognition for hands-free symbol selection
- June 27, 2025. Added text-to-speech functionality to read calculation results aloud
- June 27, 2025. Enhanced keyboard navigation with tabindex, access keys, and keyboard shortcuts (Alt+V, Alt+S, Alt+R)
- June 27, 2025. Fixed symbol grid layout to display all symbols completely without border cutoff
- June 27, 2025. Added collapsible "Neidam code" section with three number inputs (1-9) and processing functionality
- June 28, 2025. Major layout reorganization: moved language flags to top-right, centered title as second row, removed voice controls
- June 28, 2025. Renamed "Neidam code" to "Nathan code" with always-visible section and new labels: Clock hour, Canteen card, Wall panel
- June 28, 2025. Implemented responsive layout using container-fluid for better browser area utilization

## User Preferences

Preferred communication style: Simple, everyday language.