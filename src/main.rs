use std::collections::HashMap;
use std::time::Instant;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};

// Optional jemalloc for better memory management
#[cfg(feature = "jemalloc")]
use tikv_jemallocator::Jemalloc;

#[cfg(feature = "jemalloc")]
#[global_allocator]
static GLOBAL: Jemalloc = Jemalloc;

// Efficient data structures
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Person {
    id: u32,
    name: String,
    age: u8,
    score: f64,
}

// Stack-allocated arrays for better performance
const BUFFER_SIZE: usize = 1024;
type Buffer = [u8; BUFFER_SIZE];

fn main() {
    println!("🚀 Rust Performance Optimization Demo");
    println!("=====================================");
    
    // Demonstrate various optimization techniques
    demo_memory_optimization();
    demo_parallel_processing();
    demo_efficient_data_structures();
    demo_simd_like_operations();
    demo_string_optimization();
    demo_allocation_optimization();
    
    println!("\n✅ All performance demos completed!");
}

// Memory optimization: Stack vs Heap allocation
fn demo_memory_optimization() {
    println!("\n📊 Memory Optimization Demo");
    
    let start = Instant::now();
    
    // Stack allocation - faster
    let stack_buffer: Buffer = [0u8; BUFFER_SIZE];
    let stack_time = start.elapsed();
    
    let start = Instant::now();
    // Heap allocation - slower
    let heap_buffer: Vec<u8> = vec![0u8; BUFFER_SIZE];
    let heap_time = start.elapsed();
    
    println!("Stack allocation: {:?}", stack_time);
    println!("Heap allocation: {:?}", heap_time);
    println!("Stack buffer size: {} bytes", stack_buffer.len());
    println!("Heap buffer size: {} bytes", heap_buffer.len());
}

// Parallel processing with Rayon
fn demo_parallel_processing() {
    println!("\n⚡ Parallel Processing Demo");
    
    let numbers: Vec<u32> = (0..1_000_000).collect();
    
    // Sequential processing
    let start = Instant::now();
    let sequential_sum: u32 = numbers.iter().map(|x| x * x).sum();
    let sequential_time = start.elapsed();
    
    // Parallel processing
    let start = Instant::now();
    let parallel_sum: u32 = numbers.par_iter().map(|x| x * x).sum();
    let parallel_time = start.elapsed();
    
    println!("Sequential sum: {} (took {:?})", sequential_sum, sequential_time);
    println!("Parallel sum: {} (took {:?})", parallel_sum, parallel_time);
    println!("Speedup: {:.2}x", sequential_time.as_nanos() as f64 / parallel_time.as_nanos() as f64);
}

// Efficient data structures
fn demo_efficient_data_structures() {
    println!("\n🗂️  Efficient Data Structures Demo");
    
    let mut people = Vec::new();
    let mut lookup = HashMap::new();
    
    // Generate test data
    for i in 0..10000 {
        let person = Person {
            id: i,
            name: format!("Person{}", i),
            age: (i % 100) as u8,
            score: (i as f64) * 0.1,
        };
        lookup.insert(i, person.clone());
        people.push(person);
    }
    
    // Efficient filtering with iterators
    let start = Instant::now();
    let high_scorers: Vec<&Person> = people
        .iter()
        .filter(|p| p.score > 500.0)
        .collect();
    let filter_time = start.elapsed();
    
    // Efficient lookup
    let start = Instant::now();
    let person_1000 = lookup.get(&1000);
    let lookup_time = start.elapsed();
    
    println!("Found {} high scorers in {:?}", high_scorers.len(), filter_time);
    println!("Lookup time: {:?}", lookup_time);
    if let Some(person) = person_1000 {
        println!("Found person: {:?}", person.name);
    }
}

// SIMD-like operations using chunked processing
fn demo_simd_like_operations() {
    println!("\n🔢 SIMD-like Operations Demo");
    
    let data: Vec<f32> = (0..1000000).map(|x| x as f32).collect();
    
    // Process data in chunks for better cache locality
    let start = Instant::now();
    let chunk_sum: f32 = data
        .chunks_exact(8)  // Process 8 elements at a time
        .map(|chunk| chunk.iter().sum::<f32>())
        .sum();
    let chunk_time = start.elapsed();
    
    // Regular processing
    let start = Instant::now();
    let regular_sum: f32 = data.iter().sum();
    let regular_time = start.elapsed();
    
    println!("Chunked sum: {} (took {:?})", chunk_sum, chunk_time);
    println!("Regular sum: {} (took {:?})", regular_sum, regular_time);
}

// String optimization techniques
fn demo_string_optimization() {
    println!("\n📝 String Optimization Demo");
    
    let words = vec!["hello", "world", "rust", "performance", "optimization"];
    
    // Using String::with_capacity for fewer allocations
    let start = Instant::now();
    let mut optimized_concat = String::with_capacity(100);
    for word in &words {
        optimized_concat.push_str(word);
        optimized_concat.push(' ');
    }
    let optimized_time = start.elapsed();
    
    // Regular string concatenation
    let start = Instant::now();
    let mut regular_concat = String::new();
    for word in &words {
        regular_concat.push_str(word);
        regular_concat.push(' ');
    }
    let regular_time = start.elapsed();
    
    println!("Optimized concat: '{}' (took {:?})", optimized_concat.trim(), optimized_time);
    println!("Regular concat: '{}' (took {:?})", regular_concat.trim(), regular_time);
}

// Allocation optimization
fn demo_allocation_optimization() {
    println!("\n🎯 Allocation Optimization Demo");
    
    // Pre-allocate vectors to avoid reallocations
    let start = Instant::now();
    let mut optimized_vec = Vec::with_capacity(10000);
    for i in 0..10000 {
        optimized_vec.push(i);
    }
    let optimized_time = start.elapsed();
    
    // Regular vector growth
    let start = Instant::now();
    let mut regular_vec = Vec::new();
    for i in 0..10000 {
        regular_vec.push(i);
    }
    let regular_time = start.elapsed();
    
    println!("Pre-allocated vec: {} items (took {:?})", optimized_vec.len(), optimized_time);
    println!("Regular vec: {} items (took {:?})", regular_vec.len(), regular_time);
    println!("Speedup: {:.2}x", regular_time.as_nanos() as f64 / optimized_time.as_nanos() as f64);
}

// Efficient function that demonstrates various optimization techniques
#[inline]
fn efficient_calculation(data: &[f64]) -> f64 {
    // Use iterators for better optimization
    data.iter()
        .filter(|&&x| x > 0.0)
        .map(|&x| x * x)
        .sum()
}

// Example of avoiding unnecessary allocations
fn process_data_efficiently(input: &str) -> String {
    // Use iterator chaining to avoid intermediate allocations
    input
        .lines()
        .filter(|line| !line.is_empty())
        .map(|line| line.trim())
        .collect::<Vec<_>>()
        .join("\n")
}
