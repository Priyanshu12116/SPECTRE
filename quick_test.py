import sys
import os
sys.path.insert(0, 'backend')

from anti_analysis import AntiAnalysisInjector

# Read test file
with open('test_obfuscation.c', 'r') as f:
    code = f.read()

# Inject protections
injector = AntiAnalysisInjector(aggressive_mode=True)
protected, stats = injector.inject_all_protections(code, 'windows')

# Save
with open('test_protected_only.c', 'w') as f:
    f.write(protected)

print(f"✅ Protected code saved to test_protected_only.c")
print(f"📊 Stats: {stats}")
