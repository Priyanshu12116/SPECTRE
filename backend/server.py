from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
import re
import os

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

@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "Server is running", "timestamp": datetime.now().isoformat()})

if __name__ == "__main__":
    print("Starting SPECTRE Backend Server on http://localhost:5000")
    print("Use Ctrl+C to stop the server")
    # Explicitly bind to localhost for clarity and reliability
    app.run(host="127.0.0.1", port=5000, debug=False)
