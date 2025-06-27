#!/usr/bin/env python3
import os
import sys
from app import app

if __name__ == '__main__':
    print("Starting Flask server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)