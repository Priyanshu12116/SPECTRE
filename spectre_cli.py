#!/usr/bin/env python3
"""
SPECTRE Command-Line Interface
Enterprise-ready CLI for automated obfuscation workflows
"""

import argparse
import sys
import os
import json
from pathlib import Path
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from llvm_obfuscator import LLVMObfuscator
from security_analyzer import SecurityAnalyzer
from polymorphic_engine import PolymorphicEngine


class SPECTRECLI:
    """Command-line interface for SPECTRE"""
    
    def __init__(self):
        self.version = "1.0.0"
        
    def run_obfuscation(self, args):
        """Run obfuscation on input file"""
        print("=" * 70)
        print(f"🛡️  SPECTRE Obfuscator v{self.version}")
        print("=" * 70)
        
        # Read input file
        try:
            with open(args.input, 'r') as f:
                source_code = f.read()
            print(f"✓ Loaded: {args.input} ({len(source_code)} bytes)")
        except Exception as e:
            print(f"❌ Error reading input file: {e}")
            return 1
        
        # Detect language
        is_cpp = args.input.endswith(('.cpp', '.cc', '.cxx'))
        language = "C++" if is_cpp else "C"
        print(f"✓ Detected language: {language}")
        
        # Initialize obfuscator
        obfuscator = LLVMObfuscator()
        
        if not obfuscator.llvm_available:
            print("❌ LLVM not available. Please install LLVM.")
            return 1
        
        print(f"✓ LLVM {obfuscator.llvm_version} ready")
        
        # Polymorphic engine
        if args.polymorphic:
            print("🔄 Polymorphic mode: Each build will be unique")
            engine = PolymorphicEngine()
            recipe = engine.create_obfuscation_recipe(args.level)
            print(f"✓ Build ID: {recipe['build_id']}")
        
        # Run obfuscation
        print(f"\n🔧 Starting obfuscation (level: {args.level}, platform: {args.platform})...")
        
        try:
            result = obfuscator.obfuscate(
                source_code=source_code,
                level=args.level,
                platform=args.platform,
                is_cpp=is_cpp
            )
            
            if result['success']:
                print(f"✅ Obfuscation successful!")
                print(f"   Method: {result['report']['obfuscation_method']}")
                print(f"   Object file: {result['report']['output_attributes']['object_file_size']} bytes")
                print(f"   Executable: {result['report']['output_attributes']['executable_size']} bytes")
                print(f"   Time: {result['report']['statistics']['compilation_time']:.2f}s")
                
                # Save output
                if args.output:
                    output_path = args.output
                else:
                    # Auto-generate output name
                    input_path = Path(args.input)
                    output_path = input_path.stem + '_obfuscated' + input_path.suffix
                
                # Save obfuscated IR
                with open(output_path, 'w') as f:
                    f.write(result.get('obfuscated_ir', ''))
                print(f"✓ Saved obfuscated code: {output_path}")
                
                # Save report
                if args.report:
                    report_path = args.report
                    with open(report_path, 'w') as f:
                        json.dump(result['report'], f, indent=2)
                    print(f"✓ Saved report: {report_path}")
                
                return 0
            else:
                print(f"❌ Obfuscation failed: {result.get('error', 'Unknown error')}")
                return 1
                
        except Exception as e:
            print(f"❌ Error during obfuscation: {e}")
            return 1
    
    def run_security_analysis(self, args):
        """Run security analysis on input file"""
        print("=" * 70)
        print(f"🛡️  SPECTRE Security Analyzer v{self.version}")
        print("=" * 70)
        
        # Read input file
        try:
            with open(args.input, 'r') as f:
                source_code = f.read()
            print(f"✓ Loaded: {args.input}")
        except Exception as e:
            print(f"❌ Error reading input file: {e}")
            return 1
        
        # Detect language
        is_cpp = args.input.endswith(('.cpp', '.cc', '.cxx'))
        language = "cpp" if is_cpp else "c"
        
        # Run analysis
        print(f"\n🔍 Analyzing {language.upper()} code for security vulnerabilities...")
        
        analyzer = SecurityAnalyzer()
        result = analyzer.analyze_code(source_code, language)
        
        # Display results
        print(f"\n{'=' * 70}")
        print(f"Security Score: {result['score']}/100 (Grade: {result['grade']})")
        print(f"{'=' * 70}")
        
        summary = result['summary']
        print(f"\n📊 Summary:")
        print(f"   Total Issues: {summary['total_issues']}")
        print(f"   Critical: {summary['critical']}")
        print(f"   High: {summary['high']}")
        print(f"   Medium: {summary['medium']}")
        print(f"   Low: {summary['low']}")
        
        # Display vulnerabilities
        if result['vulnerabilities']:
            print(f"\n🔴 Vulnerabilities ({len(result['vulnerabilities'])}):")
            for vuln in result['vulnerabilities']:
                print(f"\n   [{vuln['severity']}] {vuln['type']}")
                print(f"   {vuln['description']}")
                if 'line' in vuln:
                    print(f"   Line: {vuln['line']}")
                print(f"   💡 {vuln['recommendation']}")
        
        # Display warnings
        if result['warnings']:
            print(f"\n⚠️  Warnings ({len(result['warnings'])}):")
            for warn in result['warnings'][:5]:  # Show first 5
                print(f"   [{warn['severity']}] {warn['type']}: {warn['description']}")
        
        # Display recommendations
        if result['recommendations']:
            print(f"\n📋 Recommendations:")
            for rec in result['recommendations']:
                print(f"   • {rec}")
        
        # Save report
        if args.report:
            with open(args.report, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\n✓ Saved detailed report: {args.report}")
        
        print(f"\n{'=' * 70}")
        
        # Return non-zero if critical issues found
        return 1 if summary['critical'] > 0 else 0
    
    def run_batch(self, args):
        """Run batch obfuscation on multiple files"""
        print("=" * 70)
        print(f"🛡️  SPECTRE Batch Processor v{self.version}")
        print("=" * 70)
        
        # Read file list
        if args.file_list:
            with open(args.file_list, 'r') as f:
                files = [line.strip() for line in f if line.strip()]
        else:
            # Find all C/C++ files in directory
            directory = Path(args.directory)
            files = list(directory.glob('*.c')) + list(directory.glob('*.cpp'))
            files = [str(f) for f in files]
        
        print(f"✓ Found {len(files)} files to process")
        
        # Process each file
        success_count = 0
        fail_count = 0
        
        for i, file_path in enumerate(files, 1):
            print(f"\n[{i}/{len(files)}] Processing: {file_path}")
            
            # Create args for this file
            file_args = argparse.Namespace(
                input=file_path,
                output=None,  # Auto-generate
                level=args.level,
                platform=args.platform,
                polymorphic=args.polymorphic,
                report=None
            )
            
            result = self.run_obfuscation(file_args)
            
            if result == 0:
                success_count += 1
            else:
                fail_count += 1
        
        # Summary
        print(f"\n{'=' * 70}")
        print(f"Batch Processing Complete")
        print(f"✓ Success: {success_count}")
        print(f"❌ Failed: {fail_count}")
        print(f"{'=' * 70}")
        
        return 0 if fail_count == 0 else 1


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='SPECTRE - Stealthy Polymorphic Evasion & Countermeasure Toolkit',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Obfuscate a C file
  python spectre_cli.py obfuscate input.c -o output.c
  
  # Security analysis
  python spectre_cli.py analyze input.c --report report.json
  
  # Batch processing
  python spectre_cli.py batch --directory ./src --level maximum
  
  # Polymorphic obfuscation
  python spectre_cli.py obfuscate input.c --polymorphic
        """
    )
    
    parser.add_argument('--version', action='version', version='SPECTRE 1.0.0')
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Obfuscate command
    obfuscate_parser = subparsers.add_parser('obfuscate', help='Obfuscate source code')
    obfuscate_parser.add_argument('input', help='Input source file (.c or .cpp)')
    obfuscate_parser.add_argument('-o', '--output', help='Output file path')
    obfuscate_parser.add_argument('-l', '--level', 
                                  choices=['quick', 'balanced', 'maximum'],
                                  default='balanced',
                                  help='Obfuscation level (default: balanced)')
    obfuscate_parser.add_argument('-p', '--platform',
                                 choices=['windows', 'linux'],
                                 default='windows',
                                 help='Target platform (default: windows)')
    obfuscate_parser.add_argument('--polymorphic', action='store_true',
                                 help='Enable polymorphic obfuscation (unique per build)')
    obfuscate_parser.add_argument('-r', '--report',
                                 help='Save obfuscation report to file (JSON)')
    
    # Analyze command
    analyze_parser = subparsers.add_parser('analyze', help='Security analysis (SAST)')
    analyze_parser.add_argument('input', help='Input source file (.c or .cpp)')
    analyze_parser.add_argument('-r', '--report',
                               help='Save analysis report to file (JSON)')
    
    # Batch command
    batch_parser = subparsers.add_parser('batch', help='Batch process multiple files')
    batch_parser.add_argument('-d', '--directory', help='Directory containing source files')
    batch_parser.add_argument('-f', '--file-list', help='Text file with list of files')
    batch_parser.add_argument('-l', '--level',
                             choices=['quick', 'balanced', 'maximum'],
                             default='balanced',
                             help='Obfuscation level')
    batch_parser.add_argument('-p', '--platform',
                             choices=['windows', 'linux'],
                             default='windows',
                             help='Target platform')
    batch_parser.add_argument('--polymorphic', action='store_true',
                             help='Enable polymorphic obfuscation')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    # Execute command
    cli = SPECTRECLI()
    
    if args.command == 'obfuscate':
        return cli.run_obfuscation(args)
    elif args.command == 'analyze':
        return cli.run_security_analysis(args)
    elif args.command == 'batch':
        return cli.run_batch(args)
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
