import os
import logging
from flask import Flask, render_template, request, jsonify

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

@app.route('/')
def index():
    """Render the main calculator page"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """Process the calculator form and return results"""
    try:
        # Get form data
        data = request.get_json()
        x = data.get('x')
        y = data.get('y')
        z = data.get('z')
        
        # Validate inputs
        errors = []
        
        # Check if all values are provided
        if x is None or x == '':
            errors.append("X value is required")
        if y is None or y == '':
            errors.append("Y value is required")
        if z is None or z == '':
            errors.append("Z value is required")
            
        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # Convert to integers and validate range
        try:
            x = int(x)
            y = int(y)
            z = int(z)
        except (ValueError, TypeError):
            return jsonify({'success': False, 'errors': ['All inputs must be valid integers']}), 400
        
        # Validate range (0-59)
        if not (0 <= x <= 59):
            errors.append("X must be between 0 and 59")
        if not (0 <= y <= 59):
            errors.append("Y must be between 0 and 59")
        if not (0 <= z <= 59):
            errors.append("Z must be between 0 and 59")
            
        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # Perform calculations with modulo to keep results in 0-59 range
        value1 = abs((2 * x) + 11) % 60
        value2 = abs((2 * x + y) - 5) % 60
        value3 = abs((y + z) - x) % 60
        
        # Return results
        return jsonify({
            'success': True,
            'results': {
                'value1': value1,
                'value2': value2,
                'value3': value3
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error in calculate route: {str(e)}")
        return jsonify({'success': False, 'errors': ['An unexpected error occurred']}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
