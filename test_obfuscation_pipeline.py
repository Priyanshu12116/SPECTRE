"""
Test the complete SPECTRE obfuscation pipeline
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Add LLVM and MinGW to PATH
llvm_path = r"C:\Program Files\LLVM\bin"
mingw_path = r"C:\msys64\mingw64\bin"
os.environ['PATH'] = llvm_path + os.pathsep + mingw_path + os.pathsep + os.environ.get('PATH', '')

from llvm_obfuscator import LLVMObfuscator
from anti_analysis import AntiAnalysisInjector

# Read test file
with open('test_obfuscation.c', 'r') as f:
    source_code = f.read()

print("=" * 70)
print("🧪 TESTING SPECTRE OBFUSCATION PIPELINE")
print("=" * 70)

# Step 1: Inject anti-analysis
print("\n📍 Step 1: Injecting Anti-Analysis Landmines...")
anti_analysis = AntiAnalysisInjector(aggressive_mode=True)
protected_code, anti_stats = anti_analysis.inject_all_protections(source_code, 'windows')
print(f"✅ Injected {anti_stats['total_protections']} protection checks")
print(f"   - Anti-Debug: {anti_stats['anti_debug_checks']}")
print(f"   - VM Detection: {anti_stats['vm_detection_checks']}")
print(f"   - Sandbox Detection: {anti_stats['sandbox_detection_checks']}")
print(f"   - Timing Checks: {anti_stats['timing_checks']}")

# Save protected code
with open('test_obfuscation_protected.c', 'w') as f:
    f.write(protected_code)
print(f"✅ Saved protected code to: test_obfuscation_protected.c")

# Step 2: LLVM Obfuscation
print("\n📍 Step 2: Running LLVM Obfuscation...")
obfuscator = LLVMObfuscator()

try:
    result = obfuscator.obfuscate(
        protected_code,
        level='quick',
        platform='windows',
        use_ollvm=False,
        keep_ir=True
    )
    
    if result['success']:
        print("\n" + "=" * 70)
        print("✅ OBFUSCATION TEST SUCCESSFUL!")
        print("=" * 70)
        print(f"\n📊 Statistics:")
        print(f"   - IR Instructions: {result['stats']['ir_instructions']}")
        print(f"   - LLVM Passes: {len(result['stats']['llvm_passes_applied'])}")
        print(f"   - Compilation Time: {result['stats']['compilation_time']:.2f}s")
        print(f"   - Total Protections: {result['stats'].get('total_protections', 0)}")
        
        # Save obfuscated code
        if 'obfuscated_code' in result:
            with open('test_obfuscation_final.c', 'w') as f:
                f.write(result['obfuscated_code'])
            print(f"\n✅ Saved obfuscated code to: test_obfuscation_final.c")
        
        print("\n🎯 Next Steps:")
        print("   1. Compile: clang test_obfuscation_protected.c -o test_protected.exe")
        print("   2. Run: .\\test_protected.exe")
        print("   3. Test in VM to trigger landmines")
        
    else:
        print(f"\n❌ Obfuscation failed: {result.get('error', 'Unknown error')}")
        
except Exception as e:
    print(f"\n❌ Error during obfuscation: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
