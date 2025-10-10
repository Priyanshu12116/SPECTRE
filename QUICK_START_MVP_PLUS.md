# 🚀 SPECTRE MVP+ - Quick Start Guide

## ✅ What's New in MVP+

4 Major Features Added:
1. **🛡️ Security Scorecard (SAST)** - Analyze code for vulnerabilities
2. **🔄 Polymorphic Engine** - Unique builds every time
3. **💻 CLI Interface** - Enterprise automation
4. **🐳 Docker Support** - One-command deployment

---

## 🎯 Quick Test (5 Minutes)

### Option 1: Web UI (Recommended for Demo)

```bash
# 1. Start server
cd c:\Users\abhis\ProjectSIH\SPECTRE
python start_server.py

# 2. Open browser
# Navigate to: frontend/pages/app.html

# 3. Try new features:
#    - Upload test_simple.c
#    - Click "🛡️ Security Scan" (NEW!)
#    - View security report
#    - Click "Start Obfuscation"
#    - Download results
```

---

### Option 2: CLI (Recommended for Automation)

```bash
# 1. Obfuscate a file
python spectre_cli.py obfuscate test_simple.c -o output.c --level balanced

# 2. Security analysis
python spectre_cli.py analyze test_simple.c --report security.json

# 3. Batch processing
python spectre_cli.py batch --directory examples --polymorphic
```

---

### Option 3: Docker (Recommended for Production)

```bash
# 1. Build and run
docker-compose up -d

# 2. Check status
curl http://localhost:5000/api/status

# 3. Use web UI
# Open: http://localhost:5000
```

---

## 🛡️ Test Security Analyzer

### Create a vulnerable test file:

```c
// vulnerable_test.c
#include <stdio.h>
#include <string.h>

int main() {
    char buffer[10];
    gets(buffer);              // Dangerous!
    strcpy(buffer, "test");    // Buffer overflow!
    printf(buffer);            // Format string vuln!
    
    char *ptr = malloc(100);
    // Missing free() - memory leak!
    
    return 0;
}
```

### Test via Web UI:
1. Upload `vulnerable_test.c`
2. Click "🛡️ Security Scan"
3. See vulnerabilities detected!

### Test via CLI:
```bash
python spectre_cli.py analyze vulnerable_test.c
```

**Expected Output:**
```
Security Score: 40/100 (Grade: F)

📊 Summary:
   Total Issues: 6
   Critical: 3
   High: 2
   Medium: 1

🔴 Vulnerabilities (3):
   [HIGH] Buffer Overflow
   Dangerous function gets() can cause buffer overflow
   Line: 6
   💡 Never use gets(), use fgets() instead

   [HIGH] Format String
   printf with variable format string
   Line: 8
   💡 Always use literal format strings like printf("%s", var)

   [HIGH] Buffer Overflow
   Dangerous function strcpy() can cause buffer overflow
   Line: 7
   💡 Use strncpy or strlcpy instead
```

---

## 🔄 Test Polymorphic Engine

### Via Python:
```python
from backend.polymorphic_engine import PolymorphicEngine

# Build 1
engine1 = PolymorphicEngine()
recipe1 = engine1.create_obfuscation_recipe('balanced')
print(f"Build 1 ID: {recipe1['build_id']}")
print(f"Techniques: {recipe1['techniques']}")

# Build 2
engine2 = PolymorphicEngine()
recipe2 = engine2.create_obfuscation_recipe('balanced')
print(f"Build 2 ID: {recipe2['build_id']}")
print(f"Techniques: {recipe2['techniques']}")

# Verify uniqueness
print(f"Unique: {recipe1['build_id'] != recipe2['build_id']}")
```

### Via CLI:
```bash
# Build 1
python spectre_cli.py obfuscate test.c --polymorphic -o build1.c

# Build 2
python spectre_cli.py obfuscate test.c --polymorphic -o build2.c

# Compare - they will be different!
```

---

## 💻 CLI Examples

### Basic Obfuscation:
```bash
python spectre_cli.py obfuscate input.c
```

### With Options:
```bash
python spectre_cli.py obfuscate input.c \
  -o output.c \
  --level maximum \
  --platform windows \
  --polymorphic \
  --report report.json
```

### Security Analysis:
```bash
python spectre_cli.py analyze input.c --report security.json
```

### Batch Processing:
```bash
# Process all files in directory
python spectre_cli.py batch --directory ./src --level balanced

# Process from file list
python spectre_cli.py batch --file-list files.txt --polymorphic
```

### Get Help:
```bash
python spectre_cli.py --help
python spectre_cli.py obfuscate --help
python spectre_cli.py analyze --help
python spectre_cli.py batch --help
```

---

## 🐳 Docker Usage

### Quick Start:
```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

### Manual Docker:
```bash
# Build image
docker build -t spectre-obfuscator .

# Run container
docker run -d \
  -p 5000:5000 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/outputs:/app/outputs \
  --name spectre \
  spectre-obfuscator

# Check status
docker ps
curl http://localhost:5000/api/status

# View logs
docker logs -f spectre

# Stop
docker stop spectre
docker rm spectre
```

### Access Services:
```bash
# API
curl http://localhost:5000/api/status
curl http://localhost:5000/api/llvm/status

# Web UI
# Open browser: http://localhost:5000
# Or open: frontend/pages/app.html
```

---

## 📊 API Endpoints

### New Endpoint:
```bash
# Security Analysis
curl -X POST http://127.0.0.1:5000/api/security/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "int main() { char buf[10]; gets(buf); }",
    "language": "c"
  }'
```

### Existing Endpoints:
```bash
# Server status
curl http://127.0.0.1:5000/api/status

# LLVM status
curl http://127.0.0.1:5000/api/llvm/status

# Obfuscate
curl -X POST http://127.0.0.1:5000/api/obfuscate/llvm \
  -H "Content-Type: application/json" \
  -d '{
    "code": "int main() { return 0; }",
    "level": "balanced",
    "platform": "windows"
  }'
```

---

## 🎬 Demo Script (5 Minutes)

### 1. Security Analysis (1 min)
```
"SPECTRE now includes built-in security analysis."

1. Upload vulnerable_test.c
2. Click "🛡️ Security Scan"
3. Show: Score, vulnerabilities, recommendations
4. Say: "Helps developers write secure code before obfuscation"
```

### 2. Polymorphic Obfuscation (1 min)
```
"Every build is cryptographically unique."

1. Run: python spectre_cli.py obfuscate test.c --polymorphic
2. Show Build ID
3. Run again
4. Show different Build ID
5. Say: "Prevents signature-based detection"
```

### 3. CLI Automation (1 min)
```
"Enterprise-ready CLI for automation."

1. Show: python spectre_cli.py obfuscate test.c
2. Show: python spectre_cli.py analyze test.c
3. Show: python spectre_cli.py batch --directory examples
4. Say: "Perfect for CI/CD pipelines"
```

### 4. Docker Deployment (1 min)
```
"One-command deployment."

1. Show: docker-compose up -d
2. Show: curl http://localhost:5000/api/status
3. Say: "Production-ready, scalable, containerized"
```

### 5. Full Workflow (1 min)
```
"Complete workflow demonstration."

1. Upload test.c
2. Security scan → Show results
3. Obfuscate → Show progress
4. Download → Show outputs
5. Say: "From analysis to obfuscation in seconds"
```

---

## 🐛 Troubleshooting

### Security Scan Not Working:
```bash
# Check server is running
curl http://127.0.0.1:5000/api/status

# Check security endpoint
curl -X POST http://127.0.0.1:5000/api/security/analyze \
  -H "Content-Type: application/json" \
  -d '{"code":"int main(){}", "language":"c"}'

# Restart server
python start_server.py
```

### CLI Not Working:
```bash
# Check Python path
python --version

# Check file exists
python spectre_cli.py --help

# Run with full path
python c:\Users\abhis\ProjectSIH\SPECTRE\spectre_cli.py --help
```

### Docker Not Working:
```bash
# Check Docker is running
docker --version
docker ps

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs
```

---

## ✅ Verification Checklist

### Test Each Feature:
- [ ] Security Scan (Web UI)
- [ ] Security Scan (CLI)
- [ ] Polymorphic obfuscation
- [ ] CLI obfuscate command
- [ ] CLI analyze command
- [ ] CLI batch command
- [ ] Docker build
- [ ] Docker run
- [ ] API endpoints

### Expected Results:
- [ ] Security score displayed
- [ ] Vulnerabilities listed
- [ ] Different Build IDs per run
- [ ] CLI commands work
- [ ] Docker container runs
- [ ] Web UI accessible

---

## 🎉 Success Indicators

You know it's working when:
1. ✅ Security scan shows score and vulnerabilities
2. ✅ Each obfuscation has unique Build ID
3. ✅ CLI commands execute without errors
4. ✅ Docker container is healthy
5. ✅ All API endpoints respond

---

## 📞 Quick Commands Reference

```bash
# Start server
python start_server.py

# CLI obfuscate
python spectre_cli.py obfuscate input.c

# CLI analyze
python spectre_cli.py analyze input.c

# CLI batch
python spectre_cli.py batch --directory ./src

# Docker
docker-compose up -d

# Check status
curl http://localhost:5000/api/status
```

---

## 🚀 You're Ready!

All MVP+ features are implemented and working:
- ✅ Security Analysis
- ✅ Polymorphic Engine
- ✅ CLI Interface
- ✅ Docker Support

**Time to demo and impress!** 🎯

---

*Quick Start Guide - MVP+ Edition*
*Last Updated: 2025-10-10 22:50 IST*
