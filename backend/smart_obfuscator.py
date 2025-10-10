"""
SPECTRE Smart Performance-Aware Obfuscation Engine
Intelligently applies obfuscation based on function importance and performance budget
"""

import re
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass

@dataclass
class FunctionInfo:
    """Information about a function"""
    name: str
    line_start: int
    line_end: int
    complexity: int
    calls_count: int
    is_recursive: bool
    category: str  # 'hot_path', 'security', 'normal'
    obfuscation_level: str  # 'light', 'medium', 'heavy'

class SmartObfuscator:
    """
    Intelligent obfuscation engine that analyzes code and applies
    appropriate obfuscation techniques based on performance budget
    """
    
    def __init__(self, performance_budget: int = 20):
        """
        Initialize smart obfuscator
        
        Args:
            performance_budget: Maximum acceptable slowdown percentage (default: 20%)
        """
        self.performance_budget = performance_budget
        self.functions = []
        
    def analyze_code(self, source_code: str) -> Dict[str, Any]:
        """
        Analyze source code to classify functions
        
        Args:
            source_code: C/C++ source code
        
        Returns:
            Analysis results with function classifications
        """
        self.functions = []
        
        # Extract all functions
        functions = self._extract_functions(source_code)
        
        # Analyze each function
        for func in functions:
            info = self._analyze_function(func, source_code)
            self.functions.append(info)
        
        # Classify functions
        self._classify_functions()
        
        return {
            'total_functions': len(self.functions),
            'hot_paths': len([f for f in self.functions if f.category == 'hot_path']),
            'security_sensitive': len([f for f in self.functions if f.category == 'security']),
            'normal': len([f for f in self.functions if f.category == 'normal']),
            'functions': self.functions
        }
    
    def _extract_functions(self, code: str) -> List[Dict]:
        """Extract function definitions from code"""
        functions = []
        
        # Pattern to match function definitions
        # Matches: return_type function_name(params) {
        pattern = r'(\w+)\s+(\w+)\s*\([^)]*\)\s*\{'
        
        for match in re.finditer(pattern, code):
            return_type = match.group(1)
            func_name = match.group(2)
            start_pos = match.start()
            
            # Skip if it's a keyword (if, while, for, switch)
            if return_type in ['if', 'while', 'for', 'switch', 'else']:
                continue
            
            # Find the end of the function (matching closing brace)
            brace_count = 1
            pos = match.end()
            while pos < len(code) and brace_count > 0:
                if code[pos] == '{':
                    brace_count += 1
                elif code[pos] == '}':
                    brace_count -= 1
                pos += 1
            
            end_pos = pos
            func_body = code[start_pos:end_pos]
            
            functions.append({
                'name': func_name,
                'return_type': return_type,
                'start': start_pos,
                'end': end_pos,
                'body': func_body
            })
        
        return functions
    
    def _analyze_function(self, func: Dict, full_code: str) -> FunctionInfo:
        """Analyze a single function"""
        func_body = func['body']
        func_name = func['name']
        
        # Calculate complexity (simple metric: count of control structures)
        complexity = (
            func_body.count('if') +
            func_body.count('for') +
            func_body.count('while') +
            func_body.count('switch') +
            func_body.count('case')
        )
        
        # Count how many times this function is called
        calls_count = len(re.findall(rf'\b{func_name}\s*\(', full_code))
        
        # Check if recursive
        is_recursive = func_name in func_body
        
        # Calculate line numbers
        lines_before = full_code[:func['start']].count('\n')
        lines_in_func = func_body.count('\n')
        
        return FunctionInfo(
            name=func_name,
            line_start=lines_before + 1,
            line_end=lines_before + lines_in_func + 1,
            complexity=complexity,
            calls_count=calls_count,
            is_recursive=is_recursive,
            category='normal',  # Will be classified later
            obfuscation_level='medium'  # Default
        )
    
    def _classify_functions(self):
        """Classify functions into categories"""
        if not self.functions:
            return
        
        # Sort by calls count to find hot paths
        sorted_by_calls = sorted(self.functions, key=lambda f: f.calls_count, reverse=True)
        
        # Identify security-sensitive functions
        security_keywords = ['encrypt', 'decrypt', 'auth', 'login', 'password', 
                           'key', 'hash', 'verify', 'validate', 'secure']
        
        for func in self.functions:
            # Check if security-sensitive
            if any(keyword in func.name.lower() for keyword in security_keywords):
                func.category = 'security'
                func.obfuscation_level = 'heavy'
            
            # Check if it's a hot path (frequently called)
            elif func.calls_count > 5 or func.is_recursive:
                func.category = 'hot_path'
                func.obfuscation_level = 'light'
            
            # Check if it's main function
            elif func.name == 'main':
                func.category = 'normal'
                func.obfuscation_level = 'medium'
            
            else:
                func.category = 'normal'
                func.obfuscation_level = 'medium'
    
    def create_obfuscation_recipe(self, analysis: Dict) -> Dict[str, Any]:
        """
        Create a customized obfuscation recipe based on analysis
        
        Args:
            analysis: Code analysis results
        
        Returns:
            Obfuscation recipe with technique assignments
        """
        recipe = {
            'performance_budget': self.performance_budget,
            'estimated_slowdown': 0,
            'techniques': {}
        }
        
        # Assign techniques based on function category
        for func in self.functions:
            func_recipe = self._get_techniques_for_category(func.category)
            recipe['techniques'][func.name] = {
                'category': func.category,
                'level': func.obfuscation_level,
                'techniques': func_recipe,
                'priority': self._get_priority(func.category)
            }
        
        # Calculate estimated slowdown
        recipe['estimated_slowdown'] = self._estimate_slowdown(recipe)
        
        # Adjust if over budget
        if recipe['estimated_slowdown'] > self.performance_budget:
            recipe = self._adjust_for_budget(recipe)
        
        return recipe
    
    def _get_techniques_for_category(self, category: str) -> List[str]:
        """Get obfuscation techniques for a category"""
        techniques = {
            'hot_path': [
                'variable_renaming',
                'constant_encoding_light'
            ],
            'security': [
                'variable_renaming',
                'string_encryption',
                'control_flow_flattening',
                'opaque_predicates',
                'constant_encoding_heavy',
                'bogus_code_insertion',
                'anti_debugging'
            ],
            'normal': [
                'variable_renaming',
                'string_encryption',
                'control_flow_obfuscation',
                'constant_encoding_medium',
                'bogus_code_insertion'
            ]
        }
        
        return techniques.get(category, techniques['normal'])
    
    def _get_priority(self, category: str) -> int:
        """Get priority for a category (higher = more important)"""
        priorities = {
            'security': 10,
            'normal': 5,
            'hot_path': 1
        }
        return priorities.get(category, 5)
    
    def _estimate_slowdown(self, recipe: Dict) -> int:
        """Estimate performance slowdown percentage"""
        # Simple estimation based on technique weights
        technique_weights = {
            'variable_renaming': 1,
            'constant_encoding_light': 2,
            'constant_encoding_medium': 5,
            'constant_encoding_heavy': 10,
            'string_encryption': 8,
            'control_flow_obfuscation': 12,
            'control_flow_flattening': 20,
            'opaque_predicates': 15,
            'bogus_code_insertion': 10,
            'anti_debugging': 5
        }
        
        total_weight = 0
        for func_name, func_recipe in recipe['techniques'].items():
            for technique in func_recipe['techniques']:
                weight = technique_weights.get(technique, 5)
                # Hot paths contribute more to slowdown
                if func_recipe['category'] == 'hot_path':
                    weight *= 3
                total_weight += weight
        
        # Normalize to percentage
        if len(recipe['techniques']) > 0:
            avg_weight = total_weight / len(recipe['techniques'])
            slowdown = min(100, int(avg_weight))
        else:
            slowdown = 0
        
        return slowdown
    
    def _adjust_for_budget(self, recipe: Dict) -> Dict:
        """Adjust recipe to fit within performance budget"""
        # Reduce techniques for hot paths first
        for func_name, func_recipe in recipe['techniques'].items():
            if func_recipe['category'] == 'hot_path':
                # Keep only minimal obfuscation
                func_recipe['techniques'] = ['variable_renaming']
        
        # Recalculate slowdown
        recipe['estimated_slowdown'] = self._estimate_slowdown(recipe)
        
        # If still over budget, reduce normal functions
        if recipe['estimated_slowdown'] > self.performance_budget:
            for func_name, func_recipe in recipe['techniques'].items():
                if func_recipe['category'] == 'normal':
                    # Reduce to medium obfuscation
                    func_recipe['techniques'] = [
                        'variable_renaming',
                        'constant_encoding_light',
                        'string_encryption'
                    ]
        
        recipe['estimated_slowdown'] = self._estimate_slowdown(recipe)
        recipe['budget_adjusted'] = True
        
        return recipe
    
    def get_recommendations(self, analysis: Dict, recipe: Dict) -> List[str]:
        """Get recommendations based on analysis"""
        recommendations = []
        
        # Check if many hot paths
        if analysis['hot_paths'] > analysis['total_functions'] * 0.3:
            recommendations.append(
                "⚠️ Many hot paths detected. Consider increasing performance budget "
                "or optimizing frequently-called functions."
            )
        
        # Check if security functions found
        if analysis['security_sensitive'] > 0:
            recommendations.append(
                f"✅ {analysis['security_sensitive']} security-sensitive function(s) "
                "will receive heavy obfuscation."
            )
        
        # Check budget
        if recipe['estimated_slowdown'] > self.performance_budget:
            recommendations.append(
                f"⚠️ Estimated slowdown ({recipe['estimated_slowdown']}%) exceeds "
                f"budget ({self.performance_budget}%). Recipe has been adjusted."
            )
        else:
            recommendations.append(
                f"✅ Estimated slowdown ({recipe['estimated_slowdown']}%) is within "
                f"budget ({self.performance_budget}%)."
            )
        
        return recommendations


# Example usage
if __name__ == "__main__":
    test_code = """
    #include <stdio.h>
    
    int encrypt_data(char *data, int key) {
        // Security-sensitive function
        for (int i = 0; i < 100; i++) {
            data[i] ^= key;
        }
        return 0;
    }
    
    int add(int a, int b) {
        return a + b;
    }
    
    int process_loop(int n) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += add(i, i+1);  // Frequently called
        }
        return sum;
    }
    
    int main() {
        char data[100];
        encrypt_data(data, 42);
        int result = process_loop(1000);
        return 0;
    }
    """
    
    print("=" * 70)
    print("Smart Performance-Aware Obfuscation Engine - Demo")
    print("=" * 70)
    
    obfuscator = SmartObfuscator(performance_budget=20)
    
    print("\n📊 Analyzing code...")
    analysis = obfuscator.analyze_code(test_code)
    
    print(f"\nTotal Functions: {analysis['total_functions']}")
    print(f"Hot Paths: {analysis['hot_paths']}")
    print(f"Security-Sensitive: {analysis['security_sensitive']}")
    print(f"Normal: {analysis['normal']}")
    
    print("\n🔍 Function Classification:")
    for func in analysis['functions']:
        print(f"  {func.name:20} | Category: {func.category:12} | "
              f"Level: {func.obfuscation_level:8} | Calls: {func.calls_count}")
    
    print("\n🎯 Creating obfuscation recipe...")
    recipe = obfuscator.create_obfuscation_recipe(analysis)
    
    print(f"\nPerformance Budget: {recipe['performance_budget']}%")
    print(f"Estimated Slowdown: {recipe['estimated_slowdown']}%")
    
    print("\n📋 Recommendations:")
    recommendations = obfuscator.get_recommendations(analysis, recipe)
    for rec in recommendations:
        print(f"  {rec}")
    
    print("\n" + "=" * 70)
