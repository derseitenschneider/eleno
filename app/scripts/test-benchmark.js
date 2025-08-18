#!/usr/bin/env node

/**
 * Test Performance Benchmark Script
 * Compares single-threaded vs parallel test execution performance
 */

import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

const WARMUP_RUNS = 0;
const BENCHMARK_RUNS = 1;

function formatTime(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function runCommand(command, label) {
  console.log(`\n🔄 Running ${label}...`);
  const start = performance.now();
  
  try {
    const output = execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      timeout: 120000 // 2 minutes timeout
    });
    
    const end = performance.now();
    const duration = end - start;
    
    // Extract test count from output
    const testMatch = output.match(/(\d+)\s+passed/);
    const testCount = testMatch ? parseInt(testMatch[1]) : 'unknown';
    
    return {
      duration,
      testCount,
      success: true
    };
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    
    console.error(`❌ ${label} failed:`, error.message);
    return {
      duration,
      testCount: 0,
      success: false,
      error: error.message
    };
  }
}

function calculateStats(results) {
  const validResults = results.filter(r => r.success);
  if (validResults.length === 0) return null;
  
  const times = validResults.map(r => r.duration);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return { avg, min, max, count: validResults.length };
}

async function main() {
  console.log('🚀 Test Performance Benchmark');
  console.log('=====================================');
  
  // Warmup run
  console.log('\n🔥 Warming up...');
  runCommand('npm run test:single', 'Warmup');
  
  console.log('\n📊 Benchmarking test execution modes...');
  
  // Single-threaded runs
  console.log('\n🧵 Single-threaded execution:');
  const singleResults = [];
  for (let i = 0; i < BENCHMARK_RUNS; i++) {
    console.log(`  Run ${i + 1}/${BENCHMARK_RUNS}`);
    const result = runCommand('npm run test:single', `Single-threaded run ${i + 1}`);
    singleResults.push(result);
    console.log(`  ⏱️  ${formatTime(result.duration)} (${result.testCount} tests)`);
  }
  
  // Parallel runs
  console.log('\n⚡ Parallel execution:');
  const parallelResults = [];
  for (let i = 0; i < BENCHMARK_RUNS; i++) {
    console.log(`  Run ${i + 1}/${BENCHMARK_RUNS}`);
    const result = runCommand('npm run test:parallel', `Parallel run ${i + 1}`);
    parallelResults.push(result);
    console.log(`  ⏱️  ${formatTime(result.duration)} (${result.testCount} tests)`);
  }
  
  // Calculate statistics
  const singleStats = calculateStats(singleResults);
  const parallelStats = calculateStats(parallelResults);
  
  console.log('\n📈 BENCHMARK RESULTS');
  console.log('====================================');
  
  if (singleStats) {
    console.log(`\n🧵 Single-threaded:`);
    console.log(`   Average: ${formatTime(singleStats.avg)}`);
    console.log(`   Min:     ${formatTime(singleStats.min)}`);
    console.log(`   Max:     ${formatTime(singleStats.max)}`);
    console.log(`   Runs:    ${singleStats.count}/${BENCHMARK_RUNS} successful`);
  }
  
  if (parallelStats) {
    console.log(`\n⚡ Parallel (6 threads):`);
    console.log(`   Average: ${formatTime(parallelStats.avg)}`);
    console.log(`   Min:     ${formatTime(parallelStats.min)}`);
    console.log(`   Max:     ${formatTime(parallelStats.max)}`);
    console.log(`   Runs:    ${parallelStats.count}/${BENCHMARK_RUNS} successful`);
  }
  
  if (singleStats && parallelStats) {
    const improvement = ((singleStats.avg - parallelStats.avg) / singleStats.avg) * 100;
    const speedup = singleStats.avg / parallelStats.avg;
    
    console.log(`\n🎯 PERFORMANCE IMPROVEMENT:`);
    console.log(`   Speed improvement: ${improvement.toFixed(1)}%`);
    console.log(`   Speed multiplier:  ${speedup.toFixed(2)}x`);
    console.log(`   Time saved:        ${formatTime(singleStats.avg - parallelStats.avg)}`);
    
    if (improvement > 20) {
      console.log(`\n✅ Excellent! Parallel execution is significantly faster.`);
    } else if (improvement > 10) {
      console.log(`\n👍 Good! Parallel execution provides meaningful improvement.`);
    } else if (improvement > 0) {
      console.log(`\n🔧 Minor improvement. Consider optimizing further.`);
    } else {
      console.log(`\n⚠️  Parallel execution is slower. Check for thread overhead or test conflicts.`);
    }
  }
  
  console.log('\n🏁 Benchmark complete!');
}

main().catch(console.error);