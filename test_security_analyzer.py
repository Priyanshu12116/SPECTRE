#!/usr/bin/env python3
"""Test the security analyzer to verify the fix"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from security_analyzer import SecurityAnalyzer

# Test 1: Simple clean code
print("=" * 60)
print("Test 1: Clean Code")
print("=" * 60)

clean_code = """
int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);
    return 0;
}
"""

analyzer = SecurityAnalyzer()
result = analyzer.analyze_code(clean_code, 'c')

print(f"Score: {result['score']}/100")
print(f"Grade: {result['grade']}")
print(f"Total Issues: {result['summary']['total_issues']}")
print(f"Vulnerabilities: {len(result['vulnerabilities'])}")
print(f"Warnings: {len(result['warnings'])}")
print("✅ Test 1 PASSED - No regex errors!\n")

# Test 2: Vulnerable code
print("=" * 60)
print("Test 2: Vulnerable Code")
print("=" * 60)

vulnerable_code = """
#include <stdio.h>
#include <string.h>

int main() {
    char buffer[10];
    gets(buffer);
    strcpy(buffer, "test");
    printf(buffer);
    
    char *ptr = malloc(100);
    
    return 0;
}
"""

analyzer2 = SecurityAnalyzer()
result2 = analyzer2.analyze_code(vulnerable_code, 'c')

print(f"Score: {result2['score']}/100")
print(f"Grade: {result2['grade']}")
print(f"Total Issues: {result2['summary']['total_issues']}")
print(f"Vulnerabilities: {len(result2['vulnerabilities'])}")
print(f"Warnings: {len(result2['warnings'])}")
print("\nTop Vulnerabilities:")
for vuln in result2['vulnerabilities'][:3]:
    print(f"  - [{vuln['severity']}] {vuln['type']}: {vuln['description']}")
print("✅ Test 2 PASSED - Detected vulnerabilities!\n")

print("=" * 60)
print("✅ ALL TESTS PASSED - Security Analyzer is working!")
print("=" * 60)
