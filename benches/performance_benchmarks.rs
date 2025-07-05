use criterion::{black_box, criterion_group, criterion_main, Criterion};
use std::collections::HashMap;
use rayon::prelude::*;

// Benchmark memory allocation strategies
fn benchmark_memory_allocation(c: &mut Criterion) {
    let mut group = c.benchmark_group("memory_allocation");
    
    group.bench_function("stack_allocation", |b| {
        b.iter(|| {
            let buffer: [u8; 1024] = black_box([0u8; 1024]);
            black_box(buffer)
        })
    });
    
    group.bench_function("heap_allocation", |b| {
        b.iter(|| {
            let buffer: Vec<u8> = black_box(vec![0u8; 1024]);
            black_box(buffer)
        })
    });
    
    group.finish();
}

// Benchmark parallel vs sequential processing
fn benchmark_parallel_processing(c: &mut Criterion) {
    let mut group = c.benchmark_group("parallel_processing");
    let numbers: Vec<u32> = (0..100_000).collect();
    
    group.bench_function("sequential", |b| {
        b.iter(|| {
            let sum: u32 = numbers.iter().map(|x| x * x).sum();
            black_box(sum)
        })
    });
    
    group.bench_function("parallel", |b| {
        b.iter(|| {
            let sum: u32 = numbers.par_iter().map(|x| x * x).sum();
            black_box(sum)
        })
    });
    
    group.finish();
}

// Benchmark string operations
fn benchmark_string_operations(c: &mut Criterion) {
    let mut group = c.benchmark_group("string_operations");
    let words = vec!["hello", "world", "rust", "performance", "optimization"];
    
    group.bench_function("with_capacity", |b| {
        b.iter(|| {
            let mut result = String::with_capacity(100);
            for word in &words {
                result.push_str(word);
                result.push(' ');
            }
            black_box(result)
        })
    });
    
    group.bench_function("regular_concat", |b| {
        b.iter(|| {
            let mut result = String::new();
            for word in &words {
                result.push_str(word);
                result.push(' ');
            }
            black_box(result)
        })
    });
    
    group.finish();
}

// Benchmark vector operations
fn benchmark_vector_operations(c: &mut Criterion) {
    let mut group = c.benchmark_group("vector_operations");
    
    group.bench_function("with_capacity", |b| {
        b.iter(|| {
            let mut vec = Vec::with_capacity(10000);
            for i in 0..10000 {
                vec.push(i);
            }
            black_box(vec)
        })
    });
    
    group.bench_function("regular_push", |b| {
        b.iter(|| {
            let mut vec = Vec::new();
            for i in 0..10000 {
                vec.push(i);
            }
            black_box(vec)
        })
    });
    
    group.finish();
}

// Benchmark data structure operations
fn benchmark_data_structures(c: &mut Criterion) {
    let mut group = c.benchmark_group("data_structures");
    
    // Setup data
    let mut hashmap = HashMap::new();
    let mut vec = Vec::new();
    
    for i in 0..10000 {
        hashmap.insert(i, i * 2);
        vec.push((i, i * 2));
    }
    
    group.bench_function("hashmap_lookup", |b| {
        b.iter(|| {
            let value = hashmap.get(&5000);
            black_box(value)
        })
    });
    
    group.bench_function("vec_linear_search", |b| {
        b.iter(|| {
            let value = vec.iter().find(|(key, _)| *key == 5000);
            black_box(value)
        })
    });
    
    group.finish();
}

// Benchmark chunked processing
fn benchmark_chunked_processing(c: &mut Criterion) {
    let mut group = c.benchmark_group("chunked_processing");
    let data: Vec<f32> = (0..100000).map(|x| x as f32).collect();
    
    group.bench_function("chunked", |b| {
        b.iter(|| {
            let sum: f32 = data
                .chunks_exact(8)
                .map(|chunk| chunk.iter().sum::<f32>())
                .sum();
            black_box(sum)
        })
    });
    
    group.bench_function("regular", |b| {
        b.iter(|| {
            let sum: f32 = data.iter().sum();
            black_box(sum)
        })
    });
    
    group.finish();
}

// Benchmark iterator optimizations
fn benchmark_iterator_optimizations(c: &mut Criterion) {
    let mut group = c.benchmark_group("iterator_optimizations");
    let data: Vec<f64> = (0..100000).map(|x| x as f64 - 50000.0).collect();
    
    group.bench_function("iterator_chain", |b| {
        b.iter(|| {
            let result: f64 = data
                .iter()
                .filter(|&&x| x > 0.0)
                .map(|&x| x * x)
                .sum();
            black_box(result)
        })
    });
    
    group.bench_function("manual_loop", |b| {
        b.iter(|| {
            let mut result = 0.0;
            for &x in &data {
                if x > 0.0 {
                    result += x * x;
                }
            }
            black_box(result)
        })
    });
    
    group.finish();
}

criterion_group!(
    benches,
    benchmark_memory_allocation,
    benchmark_parallel_processing,
    benchmark_string_operations,
    benchmark_vector_operations,
    benchmark_data_structures,
    benchmark_chunked_processing,
    benchmark_iterator_optimizations
);

criterion_main!(benches);