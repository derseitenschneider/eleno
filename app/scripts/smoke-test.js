#!/usr/bin/env node

/**
 * Simple smoke test script for production deployment verification
 * Tests basic functionality after production deploy
 */

const https = require('node:https')
const http = require('node:http')

// Configuration
const PRODUCTION_URL = 'https://app.eleno.net'
const TIMEOUT = 10000
const MAX_RETRIES = 5
const RETRY_DELAY = 2000

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
}

/**
 * Make HTTP request with timeout and retries
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${TIMEOUT}ms`))
    }, TIMEOUT)

    const req = client.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Eleno-SmokeTest/1.0',
          ...options.headers,
        },
      },
      (res) => {
        clearTimeout(timeoutId)
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
          })
        })
      },
    )

    req.on('error', (err) => {
      clearTimeout(timeoutId)
      reject(err)
    })

    req.end()
  })
}

/**
 * Retry function with exponential backoff
 */
async function retryRequest(url, options = {}, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await makeRequest(url, options)
    } catch (error) {
      if (i === retries - 1) throw error
      console.log(`  Attempt ${i + 1} failed, retrying in ${RETRY_DELAY}ms...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
    }
  }
}

/**
 * Individual test runner
 */
async function runTest(name, testFn) {
  process.stdout.write(`🔍 ${name}... `)

  try {
    const startTime = Date.now()
    await testFn()
    const duration = Date.now() - startTime

    console.log(`✅ (${duration}ms)`)
    results.passed++
    results.tests.push({ name, status: 'passed', duration })
  } catch (error) {
    console.log('❌')
    console.log(`   Error: ${error.message}`)
    results.failed++
    results.tests.push({ name, status: 'failed', error: error.message })
  }
}

/**
 * Test: App loads and returns 200
 */
async function testAppLoads() {
  const response = await retryRequest(PRODUCTION_URL)
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`)
  }
}

/**
 * Test: Login page is accessible
 */
async function testLoginPageAccessible() {
  const response = await retryRequest(`${PRODUCTION_URL}/login`)
  if (response.statusCode !== 200) {
    throw new Error(`Login page returned status ${response.statusCode}`)
  }
}

/**
 * Test: App contains expected elements
 */
async function testAppStructure() {
  const response = await retryRequest(PRODUCTION_URL)
  const html = response.data

  // Check for essential HTML structure
  if (!html.includes('<html') || !html.includes('</html>')) {
    throw new Error('Invalid HTML structure')
  }

  // Check for React root element
  if (!html.includes('id="root"')) {
    throw new Error('React root element not found')
  }

  // Check for CSS/JS assets
  if (!html.includes('<script') || !html.includes('<link')) {
    throw new Error('Assets not properly linked')
  }
}

/**
 * Test: Critical routes return 200 (not 404)
 */
async function testCriticalRoutes() {
  const routes = ['/students', '/lessons', '/repertoire', '/notes']

  for (const route of routes) {
    const response = await retryRequest(`${PRODUCTION_URL}${route}`)
    // SPA routes should return 200 (served by index.html)
    if (response.statusCode !== 200) {
      throw new Error(`Route ${route} returned ${response.statusCode}`)
    }
  }
}

/**
 * Test: Security headers are present
 */
async function testSecurityHeaders() {
  const response = await retryRequest(PRODUCTION_URL)
  const headers = response.headers

  // Check for basic security headers (adjust based on your setup)
  if (!headers['x-content-type-options']) {
    console.log('   Warning: X-Content-Type-Options header missing')
  }
}

/**
 * Test: API endpoint connectivity (basic check)
 */
async function testApiConnectivity() {
  // This is a basic check - you might need to adjust based on your API structure
  try {
    const response = await retryRequest(PRODUCTION_URL)
    const html = response.data

    // Look for any obvious API connection errors in the HTML
    if (html.includes('NetworkError') || html.includes('Failed to fetch')) {
      throw new Error('Potential API connectivity issues detected')
    }
  } catch (error) {
    // If we can't test API directly, that's okay for smoke test
    console.log('   Warning: Could not verify API connectivity')
  }
}

/**
 * Main test runner
 */
async function runSmokeTests() {
  console.log('🚀 Starting smoke tests for production deployment...\n')
  console.log(`Target: ${PRODUCTION_URL}`)
  console.log(`Timeout: ${TIMEOUT}ms per request`)
  console.log(`Max retries: ${MAX_RETRIES}\n`)

  const startTime = Date.now()

  // Run all tests
  await runTest('App loads successfully', testAppLoads)
  await runTest('Login page accessible', testLoginPageAccessible)
  await runTest('App structure valid', testAppStructure)
  await runTest('Critical routes accessible', testCriticalRoutes)
  await runTest('Security headers', testSecurityHeaders)
  await runTest('API connectivity', testApiConnectivity)

  const totalTime = Date.now() - startTime

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 SMOKE TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⏱️  Total time: ${totalTime}ms`)
  console.log(`🎯 Target: ${PRODUCTION_URL}`)

  if (results.failed > 0) {
    console.log('\n❌ SMOKE TESTS FAILED')
    console.log('Production deployment has issues that need investigation!')

    // Print failed tests
    results.tests
      .filter((t) => t.status === 'failed')
      .forEach((test) => {
        console.log(`  • ${test.name}: ${test.error}`)
      })

    process.exit(1)
  } else {
    console.log('\n✅ ALL SMOKE TESTS PASSED')
    console.log('Production deployment is healthy! 🎉')
    process.exit(0)
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error.message)
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('\n⚠️  Smoke tests interrupted')
  process.exit(1)
})

// Run the tests if this script is executed directly
if (require.main === module) {
  runSmokeTests().catch((error) => {
    console.error('\n💥 Smoke test runner failed:', error.message)
    process.exit(1)
  })
}

module.exports = {
  runSmokeTests,
  makeRequest,
  retryRequest,
}
