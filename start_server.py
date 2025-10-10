"""
Simple server starter for SPECTRE
"""
import sys
import os

# Add LLVM to PATH (Windows)
llvm_path = r"C:\Program Files\LLVM\bin"
if os.path.exists(llvm_path):
    os.environ['PATH'] = llvm_path + os.pathsep + os.environ.get('PATH', '')
    print(f"✅ Added LLVM to PATH: {llvm_path}")
else:
    print(f"⚠️ LLVM not found at: {llvm_path}")

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from server import app

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 SPECTRE Backend Server")
    print("=" * 60)
    print("Starting server on http://127.0.0.1:5000")
    print("Press Ctrl+C to stop")
    print("=" * 60)
    
    # Run with Flask development server (easier for testing)
    app.run(host='127.0.0.1', port=5000, debug=False)
