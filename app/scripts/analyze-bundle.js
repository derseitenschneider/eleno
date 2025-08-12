#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * Analyzes the current build output to generate bundle size reports
 * and track performance impact of changes.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const DIST_PATH = './dist'
const ASSETS_PATH = join(DIST_PATH, 'assets')
const REPORT_PATH = './tests/performance/bundle-report.json'

function analyzeBundle() {
  console.log('🔍 Analyzing bundle...')

  if (!readdirSync('.').includes('dist')) {
    console.error('❌ No dist folder found. Please run "npm run build" first.')
    process.exit(1)
  }

  const bundleAnalysis = {
    timestamp: new Date().toISOString(),
    analysis: {}
  }

  // Analyze assets directory
  if (readdirSync(DIST_PATH).includes('assets')) {
    const assets = readdirSync(ASSETS_PATH)
    
    const jsFiles = assets.filter(file => extname(file) === '.js')
    const cssFiles = assets.filter(file => extname(file) === '.css')
    const otherFiles = assets.filter(file => !jsFiles.includes(file) && !cssFiles.includes(file))

    // JavaScript analysis
    const jsAnalysis = jsFiles.map(file => {
      const filePath = join(ASSETS_PATH, file)
      const stats = statSync(filePath)
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024),
        type: getFileType(file)
      }
    })

    // CSS analysis
    const cssAnalysis = cssFiles.map(file => {
      const filePath = join(ASSETS_PATH, file)
      const stats = statSync(filePath)
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024)
      }
    })

    // Calculate totals
    const totalJSSize = jsAnalysis.reduce((sum, file) => sum + file.size, 0)
    const totalCSSSize = cssAnalysis.reduce((sum, file) => sum + file.size, 0)
    const totalBundleSize = totalJSSize + totalCSSSize

    bundleAnalysis.analysis = {
      summary: {
        totalFiles: assets.length,
        totalJSFiles: jsFiles.length,
        totalCSSFiles: cssFiles.length,
        totalSizeKB: Math.round(totalBundleSize / 1024),
        totalJSSizeKB: Math.round(totalJSSize / 1024),
        totalCSSSizeKB: Math.round(totalCSSSize / 1024)
      },
      javascript: {
        files: jsAnalysis.sort((a, b) => b.size - a.size),
        breakdown: {
          vendor: jsAnalysis.filter(f => f.type === 'vendor'),
          app: jsAnalysis.filter(f => f.type === 'app'),
          chunks: jsAnalysis.filter(f => f.type === 'chunk')
        }
      },
      css: {
        files: cssAnalysis.sort((a, b) => b.size - a.size)
      },
      performance: {
        largestFile: jsAnalysis.sort((a, b) => b.size - a.size)[0],
        bundleHealth: getBundleHealth(totalBundleSize, jsFiles.length)
      }
    }
  }

  // Write report
  writeFileSync(REPORT_PATH, JSON.stringify(bundleAnalysis, null, 2))
  
  // Display summary
  console.log('\n📊 Bundle Analysis Results:')
  console.log('==========================')
  console.log(`Total Bundle Size: ${bundleAnalysis.analysis.summary?.totalSizeKB}KB`)
  console.log(`JavaScript: ${bundleAnalysis.analysis.summary?.totalJSSizeKB}KB (${bundleAnalysis.analysis.summary?.totalJSFiles} files)`)
  console.log(`CSS: ${bundleAnalysis.analysis.summary?.totalCSSSizeKB}KB (${bundleAnalysis.analysis.summary?.totalCSSFiles} files)`)
  
  if (bundleAnalysis.analysis.performance?.largestFile) {
    console.log(`Largest File: ${bundleAnalysis.analysis.performance.largestFile.name} (${bundleAnalysis.analysis.performance.largestFile.sizeKB}KB)`)
  }
  
  console.log(`Bundle Health: ${bundleAnalysis.analysis.performance?.bundleHealth}`)
  console.log(`Report saved to: ${REPORT_PATH}`)
  
  // Performance recommendations
  const recommendations = getRecommendations(bundleAnalysis.analysis)
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:')
    recommendations.forEach(rec => console.log(`   ${rec}`))
  }

  console.log('\n✅ Bundle analysis complete!')
  return bundleAnalysis
}

function getFileType(filename) {
  if (filename.includes('vendor') || filename.includes('node_modules')) {
    return 'vendor'
  } else if (filename.includes('chunk') || filename.includes('.chunk.')) {
    return 'chunk'
  } else {
    return 'app'
  }
}

function getBundleHealth(totalSize, fileCount) {
  const sizeMB = totalSize / (1024 * 1024)
  
  if (sizeMB < 2 && fileCount < 10) return '🟢 Excellent'
  if (sizeMB < 3 && fileCount < 15) return '🟡 Good'
  if (sizeMB < 5 && fileCount < 20) return '🟠 Fair'
  return '🔴 Needs Optimization'
}

function getRecommendations(analysis) {
  const recommendations = []
  
  if (analysis.summary?.totalSizeKB > 5000) {
    recommendations.push('Consider code splitting to reduce bundle size')
  }
  
  if (analysis.summary?.totalJSFiles > 20) {
    recommendations.push('Too many JavaScript files - consider better chunking strategy')
  }
  
  if (analysis.javascript?.files && analysis.javascript.files[0]?.sizeKB > 1000) {
    recommendations.push(`Largest file is ${analysis.javascript.files[0].sizeKB}KB - consider splitting`)
  }
  
  const vendorFiles = analysis.javascript?.breakdown?.vendor || []
  if (vendorFiles.length > 3) {
    recommendations.push('Consider bundling vendor libraries more efficiently')
  }
  
  return recommendations
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeBundle()
}

export { analyzeBundle }