# SPECTRE Production Deployment Guide

## 🚀 Production Server Setup

SPECTRE now includes **Waitress**, a production-quality pure-Python WSGI server that eliminates the Flask development server warning.

## ⚡ Quick Start (Production)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install all dependencies (including Waitress)
pip install -r requirements.txt

# 3. Run production server
python wsgi.py
```

The server will start on `http://127.0.0.1:5000` by default.

## 🔧 Configuration

### Environment Variables

You can customize the server using environment variables:

**Windows (PowerShell):**
```powershell
$env:SPECTRE_HOST = "0.0.0.0"  # Listen on all interfaces
$env:SPECTRE_PORT = "8080"      # Custom port
$env:HUGGINGFACE_API_KEY = "your_api_key_here"
python wsgi.py
```

**Linux/Mac (Bash):**
```bash
export SPECTRE_HOST="0.0.0.0"
export SPECTRE_PORT="8080"
export HUGGINGFACE_API_KEY="your_api_key_here"
python wsgi.py
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `SPECTRE_HOST` | `127.0.0.1` | Server bind address |
| `SPECTRE_PORT` | `5000` | Server port |
| `HUGGINGFACE_API_KEY` | `""` | API key for AI features |

## 🆚 Development vs Production

### Development Server (`server.py`)
- ✅ Fast reload on code changes
- ✅ Detailed error messages
- ❌ **NOT suitable for production**
- ❌ Single-threaded
- ❌ Security warnings

**Use for:** Local development and testing

### Production Server (`wsgi.py`)
- ✅ Production-grade WSGI server
- ✅ Multi-threaded (4 threads)
- ✅ Better performance
- ✅ No security warnings
- ✅ Stable and reliable

**Use for:** Deployment, demos, production environments

## 📊 Performance Comparison

| Metric | Development | Production |
|--------|-------------|------------|
| Concurrent Requests | 1 | 4 |
| Stability | Low | High |
| Performance | Basic | Optimized |
| Security | Warnings | Production-ready |

## 🌐 Network Configuration

### Local Access Only (Default)
```bash
# Accessible only from localhost
python wsgi.py
# URL: http://127.0.0.1:5000
```

### Network Access (LAN/WAN)
```bash
# Accessible from other machines
$env:SPECTRE_HOST = "0.0.0.0"
python wsgi.py
# URL: http://YOUR_IP:5000
```

⚠️ **Security Warning:** Only expose to network if you trust all users on that network.

## 🐳 Docker Deployment (Future)

For containerized deployment, you can create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 5000

CMD ["python", "wsgi.py"]
```

## 🔒 Security Best Practices

1. **Use Environment Variables** - Never hardcode API keys
2. **Restrict Network Access** - Use `127.0.0.1` unless needed
3. **Enable HTTPS** - Use reverse proxy (nginx, Apache) for SSL
4. **Rate Limiting** - Implement request throttling
5. **Input Validation** - Already implemented in SPECTRE

## 🔄 Process Management

### Windows (Manual)
```powershell
# Start server
python wsgi.py

# Stop server
Ctrl+C
```

### Linux (systemd service)
Create `/etc/systemd/system/spectre.service`:

```ini
[Unit]
Description=SPECTRE Backend Server
After=network.target

[Service]
Type=simple
User=spectre
WorkingDirectory=/path/to/SPECTRE/backend
Environment="SPECTRE_HOST=127.0.0.1"
Environment="SPECTRE_PORT=5000"
ExecStart=/usr/bin/python3 wsgi.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable spectre
sudo systemctl start spectre
sudo systemctl status spectre
```

## 📈 Monitoring

### Check Server Status
```bash
curl http://localhost:5000/api/status
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2025-10-10T20:27:55"
}
```

### Logs
Waitress logs to stdout/stderr. Redirect for persistent logging:

```bash
python wsgi.py > server.log 2>&1
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
$env:SPECTRE_PORT = "8080"
python wsgi.py
```

### Cannot Access from Other Machines
1. Check firewall settings
2. Ensure `SPECTRE_HOST="0.0.0.0"`
3. Verify network connectivity

### Dependencies Missing
```bash
pip install --upgrade -r requirements.txt
```

## 🎯 Recommended Setup

**For Development:**
```bash
python server.py  # Fast reload, debugging
```

**For Production/Demos:**
```bash
python wsgi.py    # Stable, performant
```

**For Enterprise:**
```bash
# Use reverse proxy (nginx) + Waitress
# Enable HTTPS, rate limiting, monitoring
```

## 📚 Additional Resources

- [Waitress Documentation](https://docs.pylonsproject.org/projects/waitress/)
- [Flask Production Deployment](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [SPECTRE Main README](../README.md)

---

**SPECTRE Production Server** - Powered by Waitress 🚀
