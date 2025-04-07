import { execSync } from "child_process"
import { ShopifyTestReporter } from "../lib/test-utils/test-reporter"

// Create a test reporter
const reporter = new ShopifyTestReporter()

// Define test suites
const testSuites = [
  {
    name: "Shopify API Unit Tests",
    command: "vitest run lib/shopify.test.ts",
  },
  {
    name: "Shopify Integration Tests",
    command: "vitest run tests/integration/shopify-integration.test.ts",
  },
  {
    name: "Shopify User Flow Tests",
    command: "playwright test tests/e2e/shopify-user-flows.test.ts",
  },
  {
    name: "Shopify Performance Tests",
    command: "playwright test tests/performance/shopify-performance.test.ts",
  },
  {
    name: "Shopify Error Handling Tests",
    command: "playwright test tests/error-handling/shopify-error-handling.test.ts",
  },
]

// Run each test suite
console.log("🚀 Starting Shopify Integration Test Suite")

let hasFailures = false

testSuites.forEach((suite) => {
  try {
    reporter.startSuite(suite.name)

    const startTime = Date.now()

    try {
      // Run the test command
      execSync(suite.command, { stdio: "inherit" })

      // If we get here, all tests passed
      const duration = Date.now() - startTime
      reporter.endSuite(duration)
    } catch (error) {
      // If we get here, some tests failed
      const duration = Date.now() - startTime
      reporter.recordTest({
        name: "Suite execution",
        status: "failed",
        duration,
        error: error instanceof Error ? error.message : String(error),
      })
      reporter.endSuite(duration)
      hasFailures = true
    }
  } catch (error) {
    console.error(`Error running test suite ${suite.name}:`, error)
    hasFailures = true
  }
})

// Generate test report
reporter.generateReport()

// Exit with appropriate code
process.exit(hasFailures ? 1 : 0)

