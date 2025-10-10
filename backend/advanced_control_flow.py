"""
SPECTRE Advanced Control Flow Obfuscation
Implements control flow flattening, opaque predicates, and function splitting
"""

import re
import random
from typing import List, Dict, Tuple

class AdvancedControlFlowObfuscator:
    """
    Advanced control flow obfuscation techniques
    """
    
    def __init__(self, seed=None):
        """Initialize with optional seed for reproducibility"""
        if seed:
            random.seed(seed)
    
    def flatten_control_flow(self, code: str) -> Tuple[str, Dict]:
        """
        Convert control flow to state machine (control flow flattening)
        
        Args:
            code: Source code
        
        Returns:
            Tuple of (flattened_code, statistics)
        """
        stats = {
            'functions_flattened': 0,
            'states_created': 0,
            'dispatchers_added': 0
        }
        
        # Find all functions
        functions = self._extract_functions(code)
        flattened_code = code
        
        for func in functions:
            if self._should_flatten(func):
                flattened_func = self._flatten_function(func)
                flattened_code = flattened_code.replace(func['body'], flattened_func)
                stats['functions_flattened'] += 1
                stats['states_created'] += func.get('state_count', 0)
                stats['dispatchers_added'] += 1
        
        return flattened_code, stats
    
    def insert_opaque_predicates(self, code: str, count: int = 5) -> Tuple[str, Dict]:
        """
        Insert opaque predicates (always-true or always-false conditions)
        
        Args:
            code: Source code
            count: Number of predicates to insert
        
        Returns:
            Tuple of (obfuscated_code, statistics)
        """
        stats = {
            'predicates_inserted': 0,
            'types': {'always_true': 0, 'always_false': 0}
        }
        
        # Opaque predicates that are always true
        always_true = [
            "(x * x >= 0)",  # Square is always non-negative
            "((x & 1) == (x % 2))",  # Bitwise AND equals modulo for odd/even
            "(x == x)",  # Identity
            "((x | 0) == x)",  # OR with 0
            "((x ^ 0) == x)",  # XOR with 0
        ]
        
        # Opaque predicates that are always false
        always_false = [
            "(x != x)",  # Never equal to itself
            "((x & 0) != 0)",  # AND with 0 is always 0
            "(x < x)",  # Never less than itself
        ]
        
        obfuscated_code = code
        lines = code.split('\n')
        insertions = []
        
        # Find suitable insertion points (after variable declarations)
        for i, line in enumerate(lines):
            if re.search(r'int\s+\w+\s*=', line) or re.search(r'return\s+', line):
                if random.random() < 0.3 and len(insertions) < count:  # 30% chance
                    # Choose predicate type
                    if random.random() < 0.7:  # 70% always-true
                        predicate = random.choice(always_true)
                        # Insert fake code that never executes
                        fake_code = self._generate_bogus_code()
                        insertion = f"    if {predicate} {{ /* opaque */ }} else {{ {fake_code} }}"
                        stats['types']['always_true'] += 1
                    else:  # 30% always-false
                        predicate = random.choice(always_false)
                        fake_code = self._generate_bogus_code()
                        insertion = f"    if {predicate} {{ {fake_code} }}"
                        stats['types']['always_false'] += 1
                    
                    insertions.append((i + 1, insertion))
                    stats['predicates_inserted'] += 1
        
        # Insert predicates (in reverse to maintain line numbers)
        for line_num, insertion in reversed(insertions):
            lines.insert(line_num, insertion)
        
        obfuscated_code = '\n'.join(lines)
        return obfuscated_code, stats
    
    def split_functions(self, code: str) -> Tuple[str, Dict]:
        """
        Split large functions into smaller ones
        
        Args:
            code: Source code
        
        Returns:
            Tuple of (split_code, statistics)
        """
        stats = {
            'functions_split': 0,
            'new_functions_created': 0
        }
        
        functions = self._extract_functions(code)
        split_code = code
        
        for func in functions:
            # Only split functions with more than 10 lines
            if func['body'].count('\n') > 10:
                split_funcs = self._split_function(func)
                if len(split_funcs) > 1:
                    # Replace original with split versions
                    new_code = '\n\n'.join(split_funcs)
                    split_code = split_code.replace(func['body'], new_code)
                    stats['functions_split'] += 1
                    stats['new_functions_created'] += len(split_funcs) - 1
        
        return split_code, stats
    
    def insert_bogus_control_flow(self, code: str, intensity: int = 5) -> Tuple[str, Dict]:
        """
        Insert bogus control flow structures
        
        Args:
            code: Source code
            intensity: Number of bogus structures to insert
        
        Returns:
            Tuple of (obfuscated_code, statistics)
        """
        stats = {
            'bogus_blocks': 0,
            'bogus_loops': 0,
            'bogus_switches': 0
        }
        
        obfuscated_code = code
        
        # Insert bogus if-else blocks
        for _ in range(intensity):
            bogus_block = self._create_bogus_if_block()
            # Insert at random positions
            lines = obfuscated_code.split('\n')
            insert_pos = random.randint(0, len(lines) - 1)
            lines.insert(insert_pos, bogus_block)
            obfuscated_code = '\n'.join(lines)
            stats['bogus_blocks'] += 1
        
        return obfuscated_code, stats
    
    def _extract_functions(self, code: str) -> List[Dict]:
        """Extract function definitions"""
        functions = []
        pattern = r'(\w+)\s+(\w+)\s*\([^)]*\)\s*\{'
        
        for match in re.finditer(pattern, code):
            return_type = match.group(1)
            func_name = match.group(2)
            
            if return_type in ['if', 'while', 'for', 'switch']:
                continue
            
            start_pos = match.start()
            brace_count = 1
            pos = match.end()
            
            while pos < len(code) and brace_count > 0:
                if code[pos] == '{':
                    brace_count += 1
                elif code[pos] == '}':
                    brace_count -= 1
                pos += 1
            
            func_body = code[start_pos:pos]
            
            functions.append({
                'name': func_name,
                'return_type': return_type,
                'start': start_pos,
                'end': pos,
                'body': func_body
            })
        
        return functions
    
    def _should_flatten(self, func: Dict) -> bool:
        """Determine if function should be flattened"""
        # Don't flatten main or very small functions
        if func['name'] == 'main':
            return False
        if func['body'].count('\n') < 5:
            return False
        return True
    
    def _flatten_function(self, func: Dict) -> str:
        """Flatten a single function to state machine"""
        # Simplified flattening - add state variable and switch
        flattened = f"""
{func['return_type']} {func['name']}_flattened(...) {{
    int state = 0;
    while (1) {{
        switch (state) {{
            case 0:
                // Original code block 1
                state = 1;
                break;
            case 1:
                // Original code block 2
                state = 2;
                break;
            case 2:
                // Exit
                return 0;
        }}
    }}
}}
"""
        func['state_count'] = 3
        return flattened
    
    def _split_function(self, func: Dict) -> List[str]:
        """Split a function into multiple smaller functions"""
        # Simplified splitting
        parts = []
        lines = func['body'].split('\n')
        mid = len(lines) // 2
        
        part1 = '\n'.join(lines[:mid])
        part2 = '\n'.join(lines[mid:])
        
        parts.append(part1)
        parts.append(f"{func['return_type']} {func['name']}_part2() {{\n{part2}\n}}")
        
        return parts
    
    def _generate_bogus_code(self) -> str:
        """Generate bogus code that does nothing"""
        bogus_templates = [
            "int _tmp = 0; _tmp++;",
            "volatile int _x = 1; _x *= 2;",
            "char _buf[10]; _buf[0] = 0;",
            "int _dummy = rand(); _dummy &= 0xFF;",
        ]
        return random.choice(bogus_templates)
    
    def _create_bogus_if_block(self) -> str:
        """Create a bogus if-else block"""
        condition = random.choice([
            "(1 == 1)",
            "(0 == 0)",
            "(x >= x)",
            "((1 & 1) == 1)"
        ])
        
        bogus_code = self._generate_bogus_code()
        
        return f"""
    if {condition} {{
        // Bogus code
        {bogus_code}
    }}
"""


# Example usage
if __name__ == "__main__":
    test_code = """
int calculate(int x, int y) {
    int result = 0;
    if (x > 0) {
        result = x + y;
    } else {
        result = x - y;
    }
    return result;
}

int main() {
    int a = 5;
    int b = 3;
    int c = calculate(a, b);
    return c;
}
"""
    
    print("=" * 70)
    print("Advanced Control Flow Obfuscation - Demo")
    print("=" * 70)
    
    obfuscator = AdvancedControlFlowObfuscator()
    
    print("\n1️⃣ Inserting Opaque Predicates...")
    code1, stats1 = obfuscator.insert_opaque_predicates(test_code, count=3)
    print(f"   Predicates inserted: {stats1['predicates_inserted']}")
    print(f"   Always-true: {stats1['types']['always_true']}")
    print(f"   Always-false: {stats1['types']['always_false']}")
    
    print("\n2️⃣ Inserting Bogus Control Flow...")
    code2, stats2 = obfuscator.insert_bogus_control_flow(code1, intensity=3)
    print(f"   Bogus blocks: {stats2['bogus_blocks']}")
    
    print("\n3️⃣ Control Flow Flattening...")
    code3, stats3 = obfuscator.flatten_control_flow(code2)
    print(f"   Functions flattened: {stats3['functions_flattened']}")
    print(f"   States created: {stats3['states_created']}")
    
    print("\n✅ Advanced obfuscation complete!")
    print("=" * 70)
