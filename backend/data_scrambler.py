"""
SPECTRE Data Structure Scrambling
Obfuscates structs, classes, and data layouts to prevent reverse engineering
"""

import re
import random
from typing import List, Dict, Tuple

class DataStructureScrambler:
    """
    Scrambles data structures to make them unintelligible
    """
    
    def __init__(self, seed=None):
        """Initialize with optional seed for reproducibility"""
        if seed:
            random.seed(seed)
    
    def scramble_all_structures(self, code: str) -> Tuple[str, Dict]:
        """
        Scramble all data structures in code
        
        Args:
            code: Source code
        
        Returns:
            Tuple of (scrambled_code, statistics)
        """
        stats = {
            'structs_scrambled': 0,
            'members_reordered': 0,
            'padding_inserted': 0,
            'types_obfuscated': 0
        }
        
        scrambled_code = code
        
        # Find and scramble all structs
        structs = self._extract_structs(code)
        for struct in structs:
            scrambled_struct = self._scramble_struct(struct)
            scrambled_code = scrambled_code.replace(struct['original'], scrambled_struct['code'])
            stats['structs_scrambled'] += 1
            stats['members_reordered'] += scrambled_struct['members_reordered']
            stats['padding_inserted'] += scrambled_struct['padding_added']
        
        # Find and scramble classes (C++)
        classes = self._extract_classes(code)
        for cls in classes:
            scrambled_class = self._scramble_class(cls)
            scrambled_code = scrambled_code.replace(cls['original'], scrambled_class['code'])
            stats['structs_scrambled'] += 1
            stats['members_reordered'] += scrambled_class['members_reordered']
        
        return scrambled_code, stats
    
    def _extract_structs(self, code: str) -> List[Dict]:
        """Extract struct definitions from code"""
        structs = []
        
        # Pattern: struct name { members };
        pattern = r'struct\s+(\w+)\s*\{([^}]+)\}\s*;'
        
        for match in re.finditer(pattern, code, re.DOTALL):
            struct_name = match.group(1)
            members_text = match.group(2)
            original = match.group(0)
            
            # Parse members
            members = self._parse_members(members_text)
            
            structs.append({
                'name': struct_name,
                'members': members,
                'original': original,
                'start': match.start(),
                'end': match.end()
            })
        
        return structs
    
    def _extract_classes(self, code: str) -> List[Dict]:
        """Extract class definitions from C++ code"""
        classes = []
        
        # Pattern: class name { members };
        pattern = r'class\s+(\w+)\s*\{([^}]+)\}\s*;'
        
        for match in re.finditer(pattern, code, re.DOTALL):
            class_name = match.group(1)
            members_text = match.group(2)
            original = match.group(0)
            
            # Parse members (skip access specifiers)
            members_text = re.sub(r'(public|private|protected)\s*:', '', members_text)
            members = self._parse_members(members_text)
            
            classes.append({
                'name': class_name,
                'members': members,
                'original': original,
                'start': match.start(),
                'end': match.end()
            })
        
        return classes
    
    def _parse_members(self, members_text: str) -> List[Dict]:
        """Parse struct/class members"""
        members = []
        
        # Split by semicolons
        lines = [line.strip() for line in members_text.split(';') if line.strip()]
        
        for line in lines:
            # Skip comments and empty lines
            if line.startswith('//') or line.startswith('/*') or not line:
                continue
            
            # Parse: type name [array]
            match = re.match(r'(\w+(?:\s*\*)?)\s+(\w+)(\[.*\])?', line)
            if match:
                member_type = match.group(1).strip()
                member_name = match.group(2)
                array_spec = match.group(3) or ''
                
                members.append({
                    'type': member_type,
                    'name': member_name,
                    'array': array_spec,
                    'original': line
                })
        
        return members
    
    def _scramble_struct(self, struct: Dict) -> Dict:
        """Scramble a single struct"""
        members = struct['members'].copy()
        original_count = len(members)
        
        # 1. Reorder members randomly
        random.shuffle(members)
        
        # 2. Insert padding members
        padding_count = random.randint(1, 3)
        for i in range(padding_count):
            padding_member = {
                'type': random.choice(['char', 'int', 'long']),
                'name': f'_pad{i}_{random.randint(0, 999)}',
                'array': f'[{random.randint(1, 8)}]',
                'original': ''
            }
            # Insert at random position
            insert_pos = random.randint(0, len(members))
            members.insert(insert_pos, padding_member)
        
        # 3. Generate scrambled struct code
        scrambled_code = f"struct {struct['name']} {{\n"
        for member in members:
            scrambled_code += f"    {member['type']} {member['name']}{member['array']};\n"
        scrambled_code += "};"
        
        return {
            'code': scrambled_code,
            'members_reordered': original_count,
            'padding_added': padding_count
        }
    
    def _scramble_class(self, cls: Dict) -> Dict:
        """Scramble a C++ class"""
        members = cls['members'].copy()
        original_count = len(members)
        
        # Reorder members
        random.shuffle(members)
        
        # Insert dummy members
        dummy_count = random.randint(1, 2)
        for i in range(dummy_count):
            dummy_member = {
                'type': 'volatile int',
                'name': f'_dummy{i}_{random.randint(0, 999)}',
                'array': '',
                'original': ''
            }
            insert_pos = random.randint(0, len(members))
            members.insert(insert_pos, dummy_member)
        
        # Generate scrambled class code
        scrambled_code = f"class {cls['name']} {{\n"
        scrambled_code += "public:\n"
        for member in members:
            scrambled_code += f"    {member['type']} {member['name']}{member['array']};\n"
        scrambled_code += "};"
        
        return {
            'code': scrambled_code,
            'members_reordered': original_count,
            'padding_added': dummy_count
        }
    
    def obfuscate_array_access(self, code: str) -> Tuple[str, Dict]:
        """
        Obfuscate array access patterns
        
        Args:
            code: Source code
        
        Returns:
            Tuple of (obfuscated_code, statistics)
        """
        stats = {
            'array_accesses_obfuscated': 0
        }
        
        obfuscated_code = code
        
        # Find array accesses: arr[i]
        pattern = r'(\w+)\[(\w+)\]'
        
        def obfuscate_access(match):
            array_name = match.group(1)
            index = match.group(2)
            
            # Transform: arr[i] -> arr[(i ^ 0) + 0]
            obfuscated = f"{array_name}[(({index} ^ 0) + 0)]"
            stats['array_accesses_obfuscated'] += 1
            return obfuscated
        
        obfuscated_code = re.sub(pattern, obfuscate_access, obfuscated_code)
        
        return obfuscated_code, stats
    
    def add_type_confusion(self, code: str) -> Tuple[str, Dict]:
        """
        Add type confusion through unions and casts
        
        Args:
            code: Source code
        
        Returns:
            Tuple of (obfuscated_code, statistics)
        """
        stats = {
            'type_confusions_added': 0
        }
        
        # Add union definitions for type confusion
        type_confusion_code = """
// Type confusion helpers
union _type_conf_int {
    int i;
    unsigned int ui;
    float f;
};

union _type_conf_ptr {
    void* ptr;
    unsigned long ul;
    char* cptr;
};
"""
        
        obfuscated_code = type_confusion_code + code
        stats['type_confusions_added'] = 2
        
        return obfuscated_code, stats


# Example usage
if __name__ == "__main__":
    test_code = """
struct Person {
    char name[50];
    int age;
    float salary;
};

struct Point {
    int x;
    int y;
};

class Rectangle {
    int width;
    int height;
    int area;
};

int main() {
    struct Person p;
    p.age = 25;
    
    int arr[10];
    arr[5] = 100;
    
    return 0;
}
"""
    
    print("=" * 70)
    print("Data Structure Scrambling - Demo")
    print("=" * 70)
    
    scrambler = DataStructureScrambler()
    
    print("\n1️⃣ Scrambling Structures...")
    code1, stats1 = scrambler.scramble_all_structures(test_code)
    print(f"   Structs scrambled: {stats1['structs_scrambled']}")
    print(f"   Members reordered: {stats1['members_reordered']}")
    print(f"   Padding inserted: {stats1['padding_inserted']}")
    
    print("\n2️⃣ Obfuscating Array Access...")
    code2, stats2 = scrambler.obfuscate_array_access(code1)
    print(f"   Array accesses obfuscated: {stats2['array_accesses_obfuscated']}")
    
    print("\n3️⃣ Adding Type Confusion...")
    code3, stats3 = scrambler.add_type_confusion(code2)
    print(f"   Type confusions added: {stats3['type_confusions_added']}")
    
    print("\n✅ Data structure scrambling complete!")
    print("\n📝 Scrambled Code Preview:")
    print("-" * 70)
    print(code3[:500] + "...")
    print("=" * 70)
