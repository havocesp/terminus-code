import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

@app.route('/')
def index():
    """Render the main calculator page"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """Process the calculator form and return results"""
    try:
        data = request.get_json()
        x = int(data.get('x', 0))
        y = int(data.get('y', 0))
        z = int(data.get('z', 0))
        
        # Apply the mathematical formulas with modulo to keep results in 0-59 range
        value1 = abs((2 * x) + 11) % 60
        value2 = abs((2 * x + y) - 5) % 60
        value3 = abs((y + z) - x) % 60
        
        return jsonify({
            'success': True,
            'results': {
                'value1': value1,
                'value2': value2,
                'value3': value3
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)