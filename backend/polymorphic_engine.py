"""
SPECTRE Polymorphic Engine
Ensures every build is unique by randomizing obfuscation techniques
"""

import random
import hashlib
import time
from typing import List, Dict, Any

class PolymorphicEngine:
    """
    Randomization engine that makes each obfuscation build unique
    Prevents signature-based detection by varying techniques
    """
    
    def __init__(self, seed=None):
        """
        Initialize polymorphic engine
        
        Args:
            seed: Optional seed for reproducibility (None = random)
        """
        self.seed = seed or int(time.time() * 1000)
        random.seed(self.seed)
        self.build_id = self._generate_build_id()
        
    def _generate_build_id(self) -> str:
        """Generate unique build identifier"""
        data = f"{self.seed}{time.time()}".encode()
        return hashlib.sha256(data).hexdigest()[:16]
    
    def randomize_techniques(self, available_techniques: List[str], 
                            min_techniques: int = 3) -> List[str]:
        """
        Randomly select and order obfuscation techniques
        
        Args:
            available_techniques: List of available technique names
            min_techniques: Minimum number of techniques to apply
        
        Returns:
            List of selected techniques in random order
        """
        # Ensure we have enough techniques
        num_techniques = random.randint(min_techniques, len(available_techniques))
        
        # Randomly select techniques
        selected = random.sample(available_techniques, k=num_techniques)
        
        # Randomly shuffle the order
        random.shuffle(selected)
        
        return selected
    
    def generate_random_key(self, length: int = 16) -> bytes:
        """
        Generate random encryption key
        
        Args:
            length: Key length in bytes
        
        Returns:
            Random bytes for encryption key
        """
        return random.randbytes(length)
    
    def generate_random_xor_key(self) -> int:
        """Generate random XOR key (1-255)"""
        return random.randint(1, 255)
    
    def randomize_string_encryption(self) -> Dict[str, Any]:
        """
        Randomize string encryption parameters
        
        Returns:
            Dictionary with encryption configuration
        """
        algorithms = ['xor', 'xor_multi', 'rot13', 'base64_xor']
        
        return {
            'algorithm': random.choice(algorithms),
            'key': self.generate_random_xor_key(),
            'iterations': random.randint(1, 3),
            'add_noise': random.choice([True, False])
        }
    
    def randomize_control_flow(self) -> Dict[str, Any]:
        """
        Randomize control flow obfuscation parameters
        
        Returns:
            Dictionary with control flow configuration
        """
        return {
            'bogus_blocks': random.randint(2, 8),
            'opaque_predicates': random.randint(1, 5),
            'flatten_depth': random.randint(1, 3),
            'use_switch': random.choice([True, False]),
            'random_jumps': random.choice([True, False])
        }
    
    def randomize_variable_names(self, count: int) -> List[str]:
        """
        Generate random variable names
        
        Args:
            count: Number of variable names to generate
        
        Returns:
            List of random variable names
        """
        prefixes = ['var', 'tmp', 'val', 'data', 'ptr', 'obj', 'ref']
        suffixes = ['_x', '_y', '_z', '_a', '_b', '_c', '']
        
        names = []
        for _ in range(count):
            prefix = random.choice(prefixes)
            suffix = random.choice(suffixes)
            number = random.randint(0, 9999)
            names.append(f"{prefix}{number}{suffix}")
        
        return names
    
    def randomize_constant_encoding(self) -> Dict[str, Any]:
        """
        Randomize constant encoding parameters
        
        Returns:
            Dictionary with encoding configuration
        """
        methods = ['arithmetic', 'bitwise', 'mixed']
        
        return {
            'method': random.choice(methods),
            'complexity': random.randint(1, 5),
            'use_functions': random.choice([True, False])
        }
    
    def randomize_bogus_code(self) -> Dict[str, Any]:
        """
        Randomize bogus code insertion parameters
        
        Returns:
            Dictionary with bogus code configuration
        """
        return {
            'lines_per_block': random.randint(3, 10),
            'num_blocks': random.randint(5, 20),
            'complexity': random.choice(['low', 'medium', 'high']),
            'use_loops': random.choice([True, False]),
            'use_conditionals': random.choice([True, False])
        }
    
    def create_obfuscation_recipe(self, level: str = 'balanced') -> Dict[str, Any]:
        """
        Create a complete randomized obfuscation recipe
        
        Args:
            level: Obfuscation level (quick/balanced/maximum)
        
        Returns:
            Complete obfuscation configuration
        """
        # Base techniques always applied
        base_techniques = [
            'variable_renaming',
            'constant_encoding',
            'bogus_code'
        ]
        
        # Additional techniques based on level
        additional_techniques = {
            'quick': ['string_encryption'],
            'balanced': ['string_encryption', 'control_flow', 'dead_code'],
            'maximum': ['string_encryption', 'control_flow', 'dead_code', 
                       'function_splitting', 'opaque_predicates']
        }
        
        # Get techniques for this level
        available = base_techniques + additional_techniques.get(level, [])
        selected_techniques = self.randomize_techniques(available)
        
        # Create recipe
        recipe = {
            'build_id': self.build_id,
            'seed': self.seed,
            'level': level,
            'techniques': selected_techniques,
            'string_encryption': self.randomize_string_encryption(),
            'control_flow': self.randomize_control_flow(),
            'constant_encoding': self.randomize_constant_encoding(),
            'bogus_code': self.randomize_bogus_code(),
            'variable_names': self.randomize_variable_names(50),
            'timestamp': time.time()
        }
        
        return recipe
    
    def get_polymorphic_stats(self, recipe: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get statistics about the polymorphic build
        
        Args:
            recipe: Obfuscation recipe
        
        Returns:
            Statistics dictionary
        """
        return {
            'build_id': recipe['build_id'],
            'seed': recipe['seed'],
            'unique_signature': hashlib.sha256(
                str(recipe).encode()
            ).hexdigest()[:32],
            'techniques_applied': len(recipe['techniques']),
            'technique_order': recipe['techniques'],
            'randomization_level': 'HIGH',
            'signature_variance': 'Each build is cryptographically unique'
        }


# Example usage and testing
if __name__ == "__main__":
    print("=" * 60)
    print("SPECTRE Polymorphic Engine - Test")
    print("=" * 60)
    
    # Create two builds with different seeds
    print("\n🔄 Build 1:")
    engine1 = PolymorphicEngine()
    recipe1 = engine1.create_obfuscation_recipe('balanced')
    stats1 = engine1.get_polymorphic_stats(recipe1)
    
    print(f"Build ID: {stats1['build_id']}")
    print(f"Signature: {stats1['unique_signature']}")
    print(f"Techniques: {', '.join(recipe1['techniques'])}")
    print(f"String Encryption: {recipe1['string_encryption']['algorithm']}")
    print(f"Control Flow Blocks: {recipe1['control_flow']['bogus_blocks']}")
    
    print("\n🔄 Build 2:")
    engine2 = PolymorphicEngine()
    recipe2 = engine2.create_obfuscation_recipe('balanced')
    stats2 = engine2.get_polymorphic_stats(recipe2)
    
    print(f"Build ID: {stats2['build_id']}")
    print(f"Signature: {stats2['unique_signature']}")
    print(f"Techniques: {', '.join(recipe2['techniques'])}")
    print(f"String Encryption: {recipe2['string_encryption']['algorithm']}")
    print(f"Control Flow Blocks: {recipe2['control_flow']['bogus_blocks']}")
    
    print("\n✅ Verification:")
    print(f"Builds are unique: {stats1['unique_signature'] != stats2['unique_signature']}")
    print(f"Different technique order: {recipe1['techniques'] != recipe2['techniques']}")
    
    print("\n" + "=" * 60)
