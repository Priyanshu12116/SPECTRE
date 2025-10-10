"""
SPECTRE Security Analyzer (SAST)
Static Application Security Testing for C/C++ code
"""

import re
from datetime import datetime
from typing import Dict, List, Tuple

class SecurityAnalyzer:
    """
    Analyzes C/C++ source code for common security vulnerabilities
    """
    
    def __init__(self):
        self.vulnerabilities = []
        self.warnings = []
        self.info = []
        
    def analyze_code(self, source_code: str, language: str = 'c') -> Dict:
        """
        Perform comprehensive security analysis
        
        Args:
            source_code: C/C++ source code string
            language: 'c' or 'cpp'
        
        Returns:
            Dictionary with analysis results
        """
        self.vulnerabilities = []
        self.warnings = []
        self.info = []
        
        # Run all security checks
        self._check_buffer_overflows(source_code)
        self._check_format_strings(source_code)
        self._check_integer_overflows(source_code)
        self._check_memory_issues(source_code)
        self._check_dangerous_functions(source_code)
        self._check_input_validation(source_code)
        self._check_crypto_issues(source_code)
        self._check_race_conditions(source_code)
        
        # Calculate security score
        score = self._calculate_security_score()
        
        # Generate recommendations
        recommendations = self._generate_recommendations()
        
        return {
            'score': score,
            'grade': self._get_grade(score),
            'vulnerabilities': self.vulnerabilities,
            'warnings': self.warnings,
            'info': self.info,
            'recommendations': recommendations,
            'summary': self._generate_summary(),
            'timestamp': datetime.now().isoformat()
        }
    
    def _check_buffer_overflows(self, code: str):
        """Check for potential buffer overflow vulnerabilities"""
        
        # Dangerous functions that can cause buffer overflows
        dangerous_funcs = [
            (r'strcpy\s*\(', 'strcpy', 'Use strncpy or strlcpy instead'),
            (r'strcat\s*\(', 'strcat', 'Use strncat or strlcat instead'),
            (r'sprintf\s*\(', 'sprintf', 'Use snprintf instead'),
            (r'gets\s*\(', 'gets', 'Never use gets(), use fgets() instead'),
            (r'scanf\s*\([^,]*%s', 'scanf with %s', 'Use width specifier like %99s'),
        ]
        
        for pattern, func_name, recommendation in dangerous_funcs:
            matches = re.finditer(pattern, code)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                self.vulnerabilities.append({
                    'type': 'Buffer Overflow',
                    'severity': 'HIGH',
                    'function': func_name,
                    'line': line_num,
                    'description': f'Dangerous function {func_name}() can cause buffer overflow',
                    'recommendation': recommendation
                })
    
    def _check_format_strings(self, code: str):
        """Check for format string vulnerabilities"""
        
        # Check for user-controlled format strings
        patterns = [
            (r'printf\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)', 
             'printf with variable format string'),
            (r'fprintf\s*\([^,]+,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)',
             'fprintf with variable format string'),
            (r'sprintf\s*\([^,]+,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)',
             'sprintf with variable format string'),
        ]
        
        for pattern, desc in patterns:
            matches = re.finditer(pattern, code)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                self.vulnerabilities.append({
                    'type': 'Format String',
                    'severity': 'HIGH',
                    'line': line_num,
                    'description': desc,
                    'recommendation': 'Always use literal format strings like printf("%s", var)'
                })
    
    def _check_integer_overflows(self, code: str):
        """Check for potential integer overflow issues"""
        
        # Check for unchecked arithmetic operations
        patterns = [
            (r'malloc\s*\([^)]*\*[^)]*\)', 'malloc with multiplication'),
            (r'calloc\s*\([^)]*\*[^)]*\)', 'calloc with multiplication'),
            (r'new\s+\w+\[[^]]*\*[^]]*\]', 'new[] with multiplication'),
        ]
        
        for pattern, desc in patterns:
            matches = re.finditer(pattern, code)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                self.warnings.append({
                    'type': 'Integer Overflow',
                    'severity': 'MEDIUM',
                    'line': line_num,
                    'description': f'Potential integer overflow in {desc}',
                    'recommendation': 'Check for overflow before allocation'
                })
    
    def _check_memory_issues(self, code: str):
        """Check for memory management issues"""
        
        # Check for potential memory leaks
        malloc_pattern = r'malloc\s*\('
        free_pattern = r'free\s*\('
        
        malloc_count = len(re.findall(malloc_pattern, code))
        free_count = len(re.findall(free_pattern, code))
        
        if malloc_count > free_count:
            self.warnings.append({
                'type': 'Memory Leak',
                'severity': 'MEDIUM',
                'description': f'Found {malloc_count} malloc() but only {free_count} free()',
                'recommendation': 'Ensure all allocated memory is freed'
            })
        
        # Check for use-after-free patterns (simplified - just check for free without NULL assignment)
        # Look for free() followed by potential use of same variable
        free_matches = re.finditer(r'free\s*\(\s*(\w+)\s*\)', code)
        for match in free_matches:
            var_name = match.group(1)
            # Check if variable is used after free (simplified check)
            after_free = code[match.end():]
            if re.search(rf'\b{var_name}\b', after_free[:200]):  # Check next 200 chars
                # Only warn if not immediately set to NULL
                if not re.search(rf'{var_name}\s*=\s*NULL', after_free[:100]):
                    self.warnings.append({
                        'type': 'Potential Use After Free',
                        'severity': 'MEDIUM',
                        'description': f'Variable "{var_name}" may be used after free()',
                        'recommendation': 'Set pointer to NULL after free()'
                    })
                    break  # Only report once
        
        # Check for double free (simplified)
        free_vars = re.findall(r'free\s*\(\s*(\w+)\s*\)', code)
        if len(free_vars) != len(set(free_vars)):
            # Found duplicate free calls
            self.warnings.append({
                'type': 'Potential Double Free',
                'severity': 'HIGH',
                'description': 'Same variable may be freed multiple times',
                'recommendation': 'Set pointer to NULL after first free()'
            })
    
    def _check_dangerous_functions(self, code: str):
        """Check for use of dangerous/deprecated functions"""
        
        dangerous = [
            ('system', 'Command injection risk', 'Avoid system() calls or sanitize input'),
            ('exec', 'Command injection risk', 'Use execve() with full path'),
            ('popen', 'Command injection risk', 'Sanitize all input'),
            ('tmpnam', 'Race condition', 'Use mkstemp() instead'),
            ('tempnam', 'Race condition', 'Use mkstemp() instead'),
            ('rand', 'Weak randomness', 'Use cryptographically secure RNG'),
            ('srand', 'Weak randomness', 'Use cryptographically secure RNG'),
        ]
        
        for func, risk, recommendation in dangerous:
            pattern = rf'\b{func}\s*\('
            matches = re.finditer(pattern, code)
            for match in matches:
                line_num = code[:match.start()].count('\n') + 1
                self.warnings.append({
                    'type': 'Dangerous Function',
                    'severity': 'MEDIUM',
                    'function': func,
                    'line': line_num,
                    'description': f'{func}(): {risk}',
                    'recommendation': recommendation
                })
    
    def _check_input_validation(self, code: str):
        """Check for missing input validation"""
        
        # Check for direct use of user input
        input_funcs = ['scanf', 'gets', 'fgets', 'getchar', 'cin']
        
        for func in input_funcs:
            pattern = rf'{func}\s*\('
            if re.search(pattern, code):
                self.info.append({
                    'type': 'Input Validation',
                    'severity': 'INFO',
                    'description': f'Found input function {func}()',
                    'recommendation': 'Ensure proper input validation and bounds checking'
                })
    
    def _check_crypto_issues(self, code: str):
        """Check for cryptographic issues"""
        
        # Check for weak crypto
        weak_crypto = [
            ('MD5', 'Cryptographically broken'),
            ('SHA1', 'Cryptographically weak'),
            ('DES', 'Weak encryption'),
            ('RC4', 'Weak encryption'),
        ]
        
        for algo, issue in weak_crypto:
            if re.search(rf'\b{algo}\b', code, re.IGNORECASE):
                self.warnings.append({
                    'type': 'Weak Cryptography',
                    'severity': 'MEDIUM',
                    'algorithm': algo,
                    'description': f'{algo}: {issue}',
                    'recommendation': 'Use SHA-256 or stronger algorithms'
                })
    
    def _check_race_conditions(self, code: str):
        """Check for potential race conditions"""
        
        # Check for TOCTOU (Time-of-check, time-of-use)
        if re.search(r'access\s*\([^)]+\)[^}]*open\s*\(', code):
            self.warnings.append({
                'type': 'Race Condition',
                'severity': 'MEDIUM',
                'description': 'Potential TOCTOU race condition (access/open)',
                'recommendation': 'Use open() directly with appropriate flags'
            })
        
        if re.search(r'stat\s*\([^)]+\)[^}]*open\s*\(', code):
            self.warnings.append({
                'type': 'Race Condition',
                'severity': 'MEDIUM',
                'description': 'Potential TOCTOU race condition (stat/open)',
                'recommendation': 'Use open() directly and check result'
            })
    
    def _calculate_security_score(self) -> int:
        """Calculate overall security score (0-100)"""
        
        # Start with perfect score
        score = 100
        
        # Deduct points for vulnerabilities
        for vuln in self.vulnerabilities:
            if vuln['severity'] == 'HIGH':
                score -= 15
            elif vuln['severity'] == 'MEDIUM':
                score -= 8
            elif vuln['severity'] == 'LOW':
                score -= 3
        
        # Deduct points for warnings
        for warning in self.warnings:
            if warning['severity'] == 'HIGH':
                score -= 10
            elif warning['severity'] == 'MEDIUM':
                score -= 5
            elif warning['severity'] == 'LOW':
                score -= 2
        
        # Ensure score is between 0 and 100
        return max(0, min(100, score))
    
    def _get_grade(self, score: int) -> str:
        """Convert score to letter grade"""
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def _generate_recommendations(self) -> List[str]:
        """Generate prioritized recommendations"""
        
        recommendations = []
        
        # High priority recommendations
        high_vulns = [v for v in self.vulnerabilities if v['severity'] == 'HIGH']
        if high_vulns:
            recommendations.append(
                f"🔴 CRITICAL: Fix {len(high_vulns)} high-severity vulnerabilities immediately"
            )
        
        # Buffer overflow recommendations
        buffer_vulns = [v for v in self.vulnerabilities if v['type'] == 'Buffer Overflow']
        if buffer_vulns:
            recommendations.append(
                "Replace unsafe string functions with safe alternatives (strncpy, snprintf)"
            )
        
        # Format string recommendations
        format_vulns = [v for v in self.vulnerabilities if v['type'] == 'Format String']
        if format_vulns:
            recommendations.append(
                "Always use literal format strings in printf-family functions"
            )
        
        # Memory management recommendations
        memory_issues = [v for v in self.vulnerabilities + self.warnings 
                        if 'Memory' in v['type'] or 'Free' in v['type']]
        if memory_issues:
            recommendations.append(
                "Review memory management: ensure all allocations are freed and no use-after-free"
            )
        
        # Input validation
        if any('Input' in i['type'] for i in self.info):
            recommendations.append(
                "Implement comprehensive input validation and sanitization"
            )
        
        # General recommendations
        if len(self.vulnerabilities) == 0 and len(self.warnings) == 0:
            recommendations.append(
                "✅ No major security issues found! Consider additional hardening techniques."
            )
        
        return recommendations
    
    def _generate_summary(self) -> Dict:
        """Generate analysis summary"""
        
        return {
            'total_issues': len(self.vulnerabilities) + len(self.warnings),
            'critical': len([v for v in self.vulnerabilities if v['severity'] == 'HIGH']),
            'high': len([v for v in self.vulnerabilities if v['severity'] == 'MEDIUM']),
            'medium': len([v for v in self.warnings if v['severity'] == 'MEDIUM']),
            'low': len([v for v in self.warnings if v['severity'] == 'LOW']),
            'info': len(self.info)
        }


# Example usage
if __name__ == "__main__":
    analyzer = SecurityAnalyzer()
    
    # Test code with vulnerabilities
    test_code = """
    #include <stdio.h>
    #include <string.h>
    
    int main() {
        char buffer[100];
        char *input = gets(buffer);  // Dangerous!
        strcpy(buffer, input);       // Buffer overflow!
        printf(input);               // Format string vuln!
        
        char *ptr = malloc(100);
        // Missing free() - memory leak!
        
        return 0;
    }
    """
    
    result = analyzer.analyze_code(test_code)
    
    print(f"Security Score: {result['score']}/100 (Grade: {result['grade']})")
    print(f"\nVulnerabilities: {len(result['vulnerabilities'])}")
    print(f"Warnings: {len(result['warnings'])}")
    print(f"\nRecommendations:")
    for rec in result['recommendations']:
        print(f"  - {rec}")
