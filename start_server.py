#!/usr/bin/env python3
import os
import sys
import signal
import time
from app import app

def signal_handler(sig, frame):
    print('Server shutting down...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

if __name__ == '__main__':
    print('Starting Flask server on 0.0.0.0:5000...')
    try:
        app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)
    except Exception as e:
        print(f'Error: {e}')
        sys.exit(1)