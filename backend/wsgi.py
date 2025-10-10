"""
WSGI Production Server Entry Point for SPECTRE Backend
Uses Waitress - a production-quality pure-Python WSGI server
"""
from waitress import serve
from server import app
import os

def run_production_server():
    """Run the Flask app with Waitress production server"""
    host = os.environ.get('SPECTRE_HOST', '127.0.0.1')
    port = int(os.environ.get('SPECTRE_PORT', 5000))
    
    print("=" * 60)
    print("🚀 SPECTRE Backend - Production Server")
    print("=" * 60)
    print(f"Server: Waitress (Production WSGI)")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"URL: http://{host}:{port}")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print()
    
    # Serve the Flask app with Waitress
    # threads=4 allows handling multiple concurrent requests
    serve(app, host=host, port=port, threads=4)

if __name__ == "__main__":
    run_production_server()
