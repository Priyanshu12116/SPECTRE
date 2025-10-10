# SPECTRE Docker Container
# Production-ready containerized deployment

FROM ubuntu:22.04

# Prevent interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    clang-15 \
    llvm-15 \
    llvm-15-dev \
    python3 \
    python3-pip \
    gcc \
    g++ \
    make \
    cmake \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic links for LLVM tools
RUN ln -s /usr/bin/clang-15 /usr/bin/clang && \
    ln -s /usr/bin/llvm-dis-15 /usr/bin/llvm-dis && \
    ln -s /usr/bin/llvm-as-15 /usr/bin/llvm-as && \
    ln -s /usr/bin/opt-15 /usr/bin/opt && \
    ln -s /usr/bin/llc-15 /usr/bin/llc

# Set working directory
WORKDIR /app

# Copy application files
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
COPY start_server.py /app/
COPY assets/ /app/assets/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r /app/backend/requirements.txt

# Create directories for uploads and outputs
RUN mkdir -p /app/uploads /app/outputs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/status || exit 1

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=backend/server.py

# Run server
CMD ["python3", "start_server.py"]
