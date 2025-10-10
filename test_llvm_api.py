"""
Test LLVM API directly to see the error
"""
import requests
import json

# Test code
test_code = """
int add(int a, int b) {
    return a + b;
}

int main() {
    int x = add(5, 3);
    return x;
}
"""

print("Testing LLVM API...")
print("=" * 60)

try:
    response = requests.post(
        'http://127.0.0.1:5000/api/obfuscate/llvm',
        json={
            'code': test_code,
            'level': 'balanced',
            'platform': 'windows'
        },
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
except Exception as e:
    print(f"Error: {e}")
    print(f"Response text: {response.text if 'response' in locals() else 'No response'}")
