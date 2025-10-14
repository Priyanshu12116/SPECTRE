"""
Test the /api/llvm/compile endpoint
"""
import requests
import json

# Simple LLVM IR for testing
test_llvm_ir = """; ModuleID = 'test.cpp'
source_filename = "test.cpp"
target datalayout = "e-m:w-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-w64-windows-gnu"

@.str = private unnamed_addr constant [14 x i8] c"Hello World!\\0A\\00", align 1

declare dso_local i32 @printf(ptr noundef, ...) #1

define dso_local i32 @main() #0 {
  %1 = call i32 (ptr, ...) @printf(ptr noundef @.str)
  ret i32 0
}

attributes #0 = { noinline norecurse uwtable "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #1 = { "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
"""

def test_compile_endpoint():
    """Test the compile endpoint"""
    url = "http://127.0.0.1:5000/api/llvm/compile"
    
    payload = {
        "llvm_ir": test_llvm_ir,
        "password": "test12345",
        "is_cpp": False  # This is C code
    }
    
    print("=" * 80)
    print("Testing /api/llvm/compile endpoint")
    print("=" * 80)
    print(f"URL: {url}")
    print(f"Payload size: {len(json.dumps(payload))} bytes")
    print(f"LLVM IR size: {len(test_llvm_ir)} bytes")
    print()
    
    try:
        print("Sending request...")
        response = requests.post(url, json=payload, timeout=60)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print()
        
        if response.status_code == 200:
            # Success - should be a binary file
            print("✅ SUCCESS!")
            print(f"Response size: {len(response.content)} bytes")
            
            # Save the executable
            output_file = "test_output.exe"
            with open(output_file, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Executable saved to: {output_file}")
            print()
            print("You can now run it:")
            print(f"  {output_file}")
            
        else:
            # Error
            print("❌ ERROR!")
            try:
                error_data = response.json()
                print(f"Error: {error_data.get('error', 'Unknown error')}")
                if 'details' in error_data:
                    print(f"Details: {error_data['details']}")
                if 'type' in error_data:
                    print(f"Type: {error_data['type']}")
            except:
                print(f"Response text: {response.text}")
        
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR!")
        print("The server is not running or not accessible.")
        print()
        print("Make sure to start the server first:")
        print("  python start_server.py")
        
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT!")
        print("The request took too long (> 60 seconds)")
        
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_compile_endpoint()
