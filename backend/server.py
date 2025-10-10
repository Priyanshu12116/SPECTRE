from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from datetime import datetime
import re
import os
import json
import tempfile
from obfuscator import CodeObfuscator
from advanced_obfuscator import AdvancedObfuscator
from llvm_obfuscator import LLVMObfuscator

app = Flask(__name__)
CORS(app)

# --- IMPORTANT: Set your API key as an environment variable ---
# For Windows: set HUGGINGFACE_API_KEY=your_key_here
# For Linux/Mac: export HUGGINGFACE_API_KEY=your_key_here
API_KEY = os.environ.get('HUGGINGFACE_API_KEY', '')  # Load from environment variable

# --- UPDATED TO A MORE RELIABLE MODEL ---
# Using GPT-2 which is always available and doesn't require special access
API_URL = "https://api-inference.huggingface.co/models/gpt2"

def check_syntax_errors(code):
    """Check for common C/C++ syntax errors"""
    syntax_errors = []
    lines = code.split('\n')
    
    # Check for balanced braces, brackets, and parentheses
    brace_count = code.count('{') - code.count('}')
    bracket_count = code.count('[') - code.count(']')
    paren_count = code.count('(') - code.count(')')
    
    if brace_count > 0:
        syntax_errors.append(f"❌ Missing {brace_count} closing brace(s) '}}'")
    elif brace_count < 0:
        syntax_errors.append(f"❌ Extra {abs(brace_count)} closing brace(s) '}}'")
    
    if bracket_count > 0:
        syntax_errors.append(f"❌ Missing {bracket_count} closing bracket(s) ']'")
    elif bracket_count < 0:
        syntax_errors.append(f"❌ Extra {abs(bracket_count)} closing bracket(s) ']'")
    
    if paren_count > 0:
        syntax_errors.append(f"❌ Missing {paren_count} closing parenthesis ')'")
    elif paren_count < 0:
        syntax_errors.append(f"❌ Extra {abs(paren_count)} closing parenthesis ')'")
    
    # Check for missing semicolons (basic check)
    for i, line in enumerate(lines, 1):
        line = line.strip()
        # Skip empty lines, comments, preprocessor directives, and lines ending with braces
        if not line or line.startswith('//') or line.startswith('/*') or line.startswith('#') or line.endswith('{') or line.endswith('}'):
            continue
        # Check if line should end with semicolon
        if re.match(r'^(int|char|float|double|void|long|short|unsigned|signed|struct|class|return|break|continue|printf|scanf|if|while|for|switch|case|default)', line):
            if not line.endswith(';') and not line.endswith(')') and not line.endswith(':'):
                syntax_errors.append(f"❌ Line {i}: Possible missing semicolon - '{line[:50]}...'")
    
    # Check for unclosed strings
    string_count = len(re.findall(r'(?<!\\)"', code))
    if string_count % 2 != 0:
        syntax_errors.append("❌ Unclosed string literal detected")
    
    # Check for unclosed comments
    if '/*' in code and '*/' not in code:
        syntax_errors.append("❌ Unclosed multi-line comment /* ... */")
    
    # Check for main function
    if 'int main' not in code and 'void main' not in code:
        syntax_errors.append("⚠️ Warning: No main() function found")
    
    return syntax_errors

def perform_basic_security_review(code):
    """Fallback rule-based security review when AI API is unavailable"""
    issues = []
    
    # Check for dangerous functions
    dangerous_funcs = {
        'gets': 'Buffer overflow vulnerability - use fgets() instead',
        'strcpy': 'Potential buffer overflow - use strncpy() or strlcpy()',
        'strcat': 'Potential buffer overflow - use strncat() or strlcat()',
        'sprintf': 'Potential buffer overflow - use snprintf()',
        'scanf': 'Potential buffer overflow - specify field width',
        'system': 'Command injection risk - validate and sanitize input',
        'eval': 'Code injection risk - avoid dynamic code execution',
        'exec': 'Command execution risk - validate input carefully'
    }
    
    for func, warning in dangerous_funcs.items():
        if re.search(rf'\b{func}\s*\(', code):
            issues.append(f"⚠️ **{func}()** detected: {warning}")
    
    # Check for common issues
    if re.search(r'char\s+\w+\[\d+\]', code):
        issues.append("ℹ️ Fixed-size buffer detected - ensure bounds checking")
    
    if 'malloc' in code and 'free' not in code:
        issues.append("⚠️ Memory allocated with malloc() but no corresponding free() - potential memory leak")
    
    if re.search(r'//\s*TODO|//\s*FIXME|//\s*HACK', code, re.IGNORECASE):
        issues.append("ℹ️ Code contains TODO/FIXME comments - review before production")
    
    if not issues:
        return "✅ **No obvious security vulnerabilities detected.**\n\nThe code appears to follow basic security practices. However, this is a basic static analysis. Consider:\n- Thorough testing with various inputs\n- Code review by security experts\n- Using advanced static analysis tools"
    
    review = "**Security Code Review Results:**\n\n"
    review += f"Found {len(issues)} potential issue(s):\n\n"
    review += "\n".join(f"{i+1}. {issue}" for i, issue in enumerate(issues))
    review += "\n\n**Recommendations:**\n- Review and fix the issues above\n- Use compiler warnings (-Wall -Wextra)\n- Consider using static analysis tools (e.g., Clang Static Analyzer, Coverity)\n- Implement input validation and bounds checking"
    
    return review

@app.route("/api/review", methods=["POST"])
def review_code():
    code_to_review = request.json.get("code", "")
    if not code_to_review:
        print("ERROR: No code was sent from the frontend.")
        return jsonify({"review": "No code provided."}), 400

    print("INFO: Received code for review...")
    
    # STEP 1: Check syntax errors first
    print("INFO: Checking syntax errors...")
    syntax_errors = check_syntax_errors(code_to_review)
    
    # STEP 2: Perform security review
    print("INFO: Performing security analysis...")
    security_review = perform_basic_security_review(code_to_review)
    
    # Build comprehensive review report
    review_report = "# 📋 SPECTRE Code Analysis Report\n\n"
    review_report += "---\n\n"
    
    # Syntax Check Section
    review_report += "## 🔍 Syntax Analysis\n\n"
    if syntax_errors:
        review_report += f"**Status:** ❌ **FAILED** - Found {len(syntax_errors)} syntax error(s)\n\n"
        review_report += "**Errors Found:**\n\n"
        for i, error in enumerate(syntax_errors, 1):
            review_report += f"{i}. {error}\n"
        review_report += "\n⚠️ **Please fix syntax errors before proceeding with compilation.**\n\n"
    else:
        review_report += "**Status:** ✅ **PASSED** - No syntax errors detected\n\n"
        review_report += "The code syntax appears to be correct. All braces, brackets, and parentheses are balanced.\n\n"
    
    review_report += "---\n\n"
    
    # Security Review Section
    review_report += "## 🔒 Security Analysis\n\n"
    review_report += security_review + "\n\n"
    
    review_report += "---\n\n"
    review_report += "**Analysis completed at:** " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n"
    
    print("INFO: Review completed successfully")
    return jsonify({"review": review_report})

@app.route("/api/obfuscate", methods=["POST"])
def obfuscate_code():
    """Obfuscate code with verification and reporting (Basic version)"""
    try:
        data = request.json
        code = data.get("code", "")
        password = data.get("password", "SPECTRE_DEFAULT_2025")
        level = data.get("level", "balanced")
        test_input = data.get("test_input", "")
        verify = data.get("verify", True)
        create_vault = data.get("create_vault", True)
        
        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        print(f"INFO: Starting obfuscation (level: {level}, verify: {verify})")
        
        # Initialize obfuscator
        obfuscator = CodeObfuscator()
        
        # Step 1: Create code vault if requested
        vault_created = False
        if create_vault:
            print("INFO: Creating password-protected code vault...")
            vault_path = os.path.join(tempfile.gettempdir(), f"code_vault_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip")
            vault_created = obfuscator.create_code_vault(code, password, vault_path)
        
        # Step 2: Apply obfuscation
        print("INFO: Applying obfuscation transformations...")
        obfuscated_code = obfuscator.apply_obfuscation(code, password, level)
        
        # Step 3: Verify if requested
        verification_result = {'verified': None, 'reason': 'Verification skipped'}
        if verify:
            print("INFO: Verifying obfuscated code...")
            verification_result = obfuscator.verify_obfuscation(code, obfuscated_code, test_input)
        
        # Step 4: Generate report
        config = {
            'level': level,
            'password_protected': create_vault,
            'verify': verify
        }
        report = obfuscator.generate_report(code, obfuscated_code, verification_result, config)
        
        print(f"INFO: Obfuscation complete! Status: {report['status']}")
        
        return jsonify({
            "success": True,
            "obfuscated_code": obfuscated_code,
            "report": report,
            "vault_created": vault_created
        })
        
    except Exception as e:
        print(f"ERROR: Obfuscation failed: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/obfuscate/advanced", methods=["POST"])
def obfuscate_code_advanced():
    """Advanced obfuscation with comprehensive protection layers"""
    try:
        data = request.json
        code = data.get("code", "")
        password = data.get("password", "SPECTRE_ADVANCED_2025")
        level = data.get("level", "balanced")
        platform = data.get("platform", "windows")
        test_input = data.get("test_input", "")
        verify = data.get("verify", True)
        create_vault = data.get("create_vault", True)
        
        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        print(f"INFO: Starting ADVANCED obfuscation (level: {level}, platform: {platform})")
        
        # Initialize advanced obfuscator
        obfuscator = AdvancedObfuscator()
        
        # Step 1: Create code vault if requested
        vault_created = False
        if create_vault:
            print("INFO: Creating password-protected code vault...")
            vault_path = os.path.join(tempfile.gettempdir(), f"code_vault_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip")
            vault_created = obfuscator.create_code_vault(code, password, vault_path)
        
        # Step 2: Apply advanced obfuscation
        print("INFO: Applying advanced obfuscation transformations...")
        obfuscated_code = obfuscator.apply_obfuscation(code, password, level, platform)
        
        # Step 3: Verify if requested
        verification_result = {'verified': None, 'reason': 'Verification skipped'}
        if verify:
            print("INFO: Verifying obfuscated code...")
            verification_result = obfuscator.verify_obfuscation(code, obfuscated_code, test_input, platform)
        
        # Step 4: Generate comprehensive report
        config = {
            'level': level,
            'platform': platform,
            'password_protected': create_vault,
            'verify': verify
        }
        report = obfuscator.generate_report(code, obfuscated_code, verification_result, config)
        
        print(f"INFO: Advanced obfuscation complete! Status: {report['status']}")
        print(f"INFO: Security Score: {report['security_score']}/100")
        
        return jsonify({
            "success": True,
            "obfuscated_code": obfuscated_code,
            "report": report,
            "vault_created": vault_created
        })
        
    except Exception as e:
        print(f"ERROR: Advanced obfuscation failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/obfuscate/llvm", methods=["POST"])
def obfuscate_with_llvm():
    """LLVM-based obfuscation (SIH compliant - object file obfuscation)"""
    try:
        data = request.json
        code = data.get("code", "")
        level = data.get("level", "balanced")
        platform = data.get("platform", "windows")
        use_ollvm = data.get("use_ollvm", False)
        
        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        print(f"INFO: Starting LLVM obfuscation (level: {level}, platform: {platform})")
        
        # Initialize LLVM obfuscator
        obfuscator = LLVMObfuscator()
        
        # Check LLVM availability
        if not obfuscator.llvm_available:
            return jsonify({
                "error": "LLVM toolchain not available. Please install LLVM/Clang.",
                "status": obfuscator.get_status(),
                "install_guide": "See LLVM_INSTALLATION_GUIDE.md for installation instructions"
            }), 500
        
        # Perform LLVM-based obfuscation
        result = obfuscator.obfuscate(code, level, platform, use_ollvm)
        
        if not result['success']:
            return jsonify({
                "error": result['error'],
                "stats": result.get('stats', {})
            }), 500
        
        # Generate comprehensive report
        config = {
            'level': level,
            'platform': platform,
            'use_ollvm': use_ollvm
        }
        report = obfuscator.generate_report(result, config)
        
        print(f"INFO: LLVM obfuscation complete! Status: {report['status']}")
        print(f"INFO: Object file size: {result['object_size']} bytes")
        
        return jsonify({
            "success": True,
            "obfuscated_ir": result['obfuscated_ir'],
            "object_file_size": result['object_size'],
            "executable_size": result['executable_size'],
            "report": report,
            "llvm_method": True,
            "sih_compliant": True
        })
        
    except Exception as e:
        print(f"ERROR: LLVM obfuscation failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/llvm/status", methods=["GET"])
def llvm_status():
    """Check LLVM toolchain status"""
    try:
        obfuscator = LLVMObfuscator()
        status = obfuscator.get_status()
        
        return jsonify({
            "llvm_available": status['llvm_available'],
            "ollvm_available": status['ollvm_available'],
            "tools": status['tools'],
            "ready": status['llvm_available'],
            "message": "LLVM toolchain is ready" if status['llvm_available'] else "LLVM toolchain not found"
        })
    except Exception as e:
        return jsonify({
            "llvm_available": False,
            "error": str(e),
            "message": "Failed to check LLVM status"
        }), 500

@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "Server is running", "timestamp": datetime.now().isoformat()})

if __name__ == "__main__":
    print("Starting SPECTRE Backend Server on http://localhost:5000")
    print("Use Ctrl+C to stop the server")
    # Explicitly bind to localhost for clarity and reliability
    app.run(host="127.0.0.1", port=5000, debug=False)
