import sys
import os
sys.path.insert(0, 'backend')

from anti_analysis import AntiAnalysisInjector

# Read C++ test file
with open('test_obfuscation.cpp', 'r') as f:
    code = f.read()

print("=" * 70)
print("🧪 Testing C++ Obfuscation with Landmines")
print("=" * 70)

# Inject protections
injector = AntiAnalysisInjector(aggressive_mode=True)
protected, stats = injector.inject_all_protections(code, 'windows')

# Save
with open('test_protected_cpp.cpp', 'w') as f:
    f.write(protected)

print(f"\n✅ Protected C++ code saved to: test_protected_cpp.cpp")
print(f"\n📊 Protection Statistics:")
print(f"   - Anti-Debug Checks: {stats['anti_debug_checks']}")
print(f"   - VM Detection Checks: {stats['vm_detection_checks']}")
print(f"   - Sandbox Detection Checks: {stats['sandbox_detection_checks']}")
print(f"   - Timing Checks: {stats['timing_checks']}")
print(f"   - Total Protections: {stats['total_protections']}")
print("\n" + "=" * 70)
