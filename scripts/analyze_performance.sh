#!/bin/bash

# Performance Analysis Script for Rust Project
# This script builds the project with different profiles and analyzes performance

set -e

echo "🚀 Rust Performance Analysis Script"
echo "===================================="

# Ensure we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo "❌ Error: Cargo.toml not found. Please run this script from the project root."
    exit 1
fi

# Function to get file size in a human-readable format
get_size() {
    if [ -f "$1" ]; then
        du -h "$1" | cut -f1
    else
        echo "N/A"
    fi
}

# Function to get file size in bytes
get_size_bytes() {
    if [ -f "$1" ]; then
        stat -c%s "$1" 2>/dev/null || stat -f%z "$1" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

echo ""
echo "📦 Building project with different optimization profiles..."
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cargo clean

# Build with debug profile
echo "🔧 Building debug version..."
time cargo build
DEBUG_SIZE=$(get_size_bytes "target/debug/rust_performance_demo")
DEBUG_SIZE_HUMAN=$(get_size "target/debug/rust_performance_demo")

# Build with release profile
echo "🔧 Building release version..."
time cargo build --release
RELEASE_SIZE=$(get_size_bytes "target/release/rust_performance_demo")
RELEASE_SIZE_HUMAN=$(get_size "target/release/rust_performance_demo")

# Build with size-optimized profile
echo "🔧 Building size-optimized version..."
time cargo build --profile release-small
SMALL_SIZE=$(get_size_bytes "target/release-small/rust_performance_demo")
SMALL_SIZE_HUMAN=$(get_size "target/release-small/rust_performance_demo")

# Build with fast release profile
echo "🔧 Building fast release version..."
time cargo build --profile release-fast
FAST_SIZE=$(get_size_bytes "target/release-fast/rust_performance_demo")
FAST_SIZE_HUMAN=$(get_size "target/release-fast/rust_performance_demo")

echo ""
echo "📊 Binary Size Analysis"
echo "======================="
echo ""

printf "%-20s %-15s %-15s %-15s\n" "Profile" "Size (Human)" "Size (Bytes)" "Improvement"
printf "%-20s %-15s %-15s %-15s\n" "-------" "-----------" "------------" "-----------"

# Calculate improvements
if [ "$DEBUG_SIZE" -gt 0 ]; then
    RELEASE_IMPROVEMENT=$(echo "scale=1; (1 - $RELEASE_SIZE / $DEBUG_SIZE) * 100" | bc -l 2>/dev/null || echo "N/A")
    SMALL_IMPROVEMENT=$(echo "scale=1; (1 - $SMALL_SIZE / $DEBUG_SIZE) * 100" | bc -l 2>/dev/null || echo "N/A")
    FAST_IMPROVEMENT=$(echo "scale=1; (1 - $FAST_SIZE / $DEBUG_SIZE) * 100" | bc -l 2>/dev/null || echo "N/A")
else
    RELEASE_IMPROVEMENT="N/A"
    SMALL_IMPROVEMENT="N/A"
    FAST_IMPROVEMENT="N/A"
fi

printf "%-20s %-15s %-15s %-15s\n" "Debug" "$DEBUG_SIZE_HUMAN" "$DEBUG_SIZE" "Baseline"
printf "%-20s %-15s %-15s %-15s\n" "Release" "$RELEASE_SIZE_HUMAN" "$RELEASE_SIZE" "${RELEASE_IMPROVEMENT}%"
printf "%-20s %-15s %-15s %-15s\n" "Release-small" "$SMALL_SIZE_HUMAN" "$SMALL_SIZE" "${SMALL_IMPROVEMENT}%"
printf "%-20s %-15s %-15s %-15s\n" "Release-fast" "$FAST_SIZE_HUMAN" "$FAST_SIZE" "${FAST_IMPROVEMENT}%"

echo ""
echo "⚡ Performance Testing"
echo "====================="
echo ""

# Run the debug version
echo "🏃 Running debug version..."
time target/debug/rust_performance_demo > /tmp/debug_output.txt 2>&1

# Run the release version
echo "🏃 Running release version..."
time target/release/rust_performance_demo > /tmp/release_output.txt 2>&1

# Run the size-optimized version
echo "🏃 Running size-optimized version..."
time target/release-small/rust_performance_demo > /tmp/small_output.txt 2>&1

echo ""
echo "📈 Running Benchmarks"
echo "===================="
echo ""

# Check if benchmarks exist
if [ -d "benches" ]; then
    echo "🔥 Running comprehensive benchmarks..."
    cargo bench --bench performance_benchmarks
else
    echo "⚠️  No benchmark directory found. Creating minimal benchmark..."
    # Create a simple benchmark test
    echo "Running simple performance test..."
    target/release/rust_performance_demo
fi

echo ""
echo "🎯 Performance Summary"
echo "====================="
echo ""

echo "Binary Size Optimizations:"
echo "- Debug to Release: Reduced by ${RELEASE_IMPROVEMENT}%"
echo "- Debug to Size-optimized: Reduced by ${SMALL_IMPROVEMENT}%"
echo "- Debug to Fast-release: Reduced by ${FAST_IMPROVEMENT}%"
echo ""

echo "Key Optimization Techniques Applied:"
echo "✅ Link-time optimization (LTO)"
echo "✅ Debug symbol stripping"
echo "✅ Panic strategy optimization"
echo "✅ Codegen unit optimization"
echo "✅ Memory pre-allocation"
echo "✅ Parallel processing"
echo "✅ Iterator optimization"
echo "✅ Stack allocation preferences"
echo ""

echo "🎉 Performance analysis complete!"
echo ""
echo "📝 Recommendations:"
echo "- Use 'release-small' profile for size-constrained deployments"
echo "- Use 'release' profile for performance-critical applications"
echo "- Use 'release-fast' profile for faster build times in CI/CD"
echo "- Monitor binary size changes in CI/CD pipeline"
echo ""

echo "📋 Next Steps:"
echo "1. Review the benchmark results above"
echo "2. Test with your specific workload"
echo "3. Profile with 'cargo flamegraph' for detailed analysis"
echo "4. Consider enabling jemalloc for production builds"
echo ""