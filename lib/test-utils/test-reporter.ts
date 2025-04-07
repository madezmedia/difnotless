import fs from "fs"
import path from "path"

interface TestResult {
  name: string
  status: "passed" | "failed" | "skipped"
  duration: number
  error?: string
}

interface TestSuiteResult {
  name: string
  tests: TestResult[]
  duration: number
  timestamp: string
  passed: number
  failed: number
  skipped: number
}

export class ShopifyTestReporter {
  private results: TestSuiteResult[] = []
  private currentSuite: TestSuiteResult | null = null

  startSuite(name: string) {
    this.currentSuite = {
      name,
      tests: [],
      duration: 0,
      timestamp: new Date().toISOString(),
      passed: 0,
      failed: 0,
      skipped: 0,
    }

    console.log(`\n🔍 Starting test suite: ${name}`)
  }

  recordTest(result: TestResult) {
    if (!this.currentSuite) {
      throw new Error("No test suite started")
    }

    this.currentSuite.tests.push(result)

    if (result.status === "passed") {
      this.currentSuite.passed++
      console.log(`✅ ${result.name} (${result.duration}ms)`)
    } else if (result.status === "failed") {
      this.currentSuite.failed++
      console.log(`❌ ${result.name} (${result.duration}ms)`)
      if (result.error) {
        console.error(`   Error: ${result.error}`)
      }
    } else {
      this.currentSuite.skipped++
      console.log(`⏭️ ${result.name} (skipped)`)
    }
  }

  endSuite(duration: number) {
    if (!this.currentSuite) {
      throw new Error("No test suite started")
    }

    this.currentSuite.duration = duration
    this.results.push(this.currentSuite)

    console.log(`\n📊 Test suite completed: ${this.currentSuite.name}`)
    console.log(`   Duration: ${duration}ms`)
    console.log(`   Passed: ${this.currentSuite.passed}`)
    console.log(`   Failed: ${this.currentSuite.failed}`)
    console.log(`   Skipped: ${this.currentSuite.skipped}`)

    this.currentSuite = null
  }

  generateReport(outputDir = "test-reports") {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Generate JSON report
    const jsonReport = JSON.stringify(this.results, null, 2)
    fs.writeFileSync(path.join(outputDir, "shopify-test-report.json"), jsonReport)

    // Generate HTML report
    const htmlReport = this.generateHtmlReport()
    fs.writeFileSync(path.join(outputDir, "shopify-test-report.html"), htmlReport)

    // Generate summary
    const summary = this.generateSummary()
    fs.writeFileSync(path.join(outputDir, "shopify-test-summary.txt"), summary)

    console.log(`\n📝 Test reports generated in ${outputDir}`)
  }

  private generateSummary(): string {
    let totalTests = 0
    let totalPassed = 0
    let totalFailed = 0
    let totalSkipped = 0
    let totalDuration = 0

    this.results.forEach((suite) => {
      totalTests += suite.tests.length
      totalPassed += suite.passed
      totalFailed += suite.failed
      totalSkipped += suite.skipped
      totalDuration += suite.duration
    })

    return `
Shopify Integration Test Summary
===============================
Date: ${new Date().toISOString()}

Total Test Suites: ${this.results.length}
Total Tests: ${totalTests}
Passed: ${totalPassed}
Failed: ${totalFailed}
Skipped: ${totalSkipped}
Total Duration: ${totalDuration}ms

Test Suite Details:
${this.results
  .map(
    (suite) => `
- ${suite.name}
  Passed: ${suite.passed}
  Failed: ${suite.failed}
  Skipped: ${suite.skipped}
  Duration: ${suite.duration}ms
`,
  )
  .join("")}
`
  }

  private generateHtmlReport(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopify Integration Test Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      margin-top: 0;
    }
    .summary {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .test-suite {
      margin-bottom: 30px;
      border: 1px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
    }
    .suite-header {
      background-color: #eee;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .suite-body {
      padding: 0;
    }
    .test-case {
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test-case:last-child {
      border-bottom: none;
    }
    .status {
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
    }
    .passed {
      background-color: #d4edda;
      color: #155724;
    }
    .failed {
      background-color: #f8d7da;
      color: #721c24;
    }
    .skipped {
      background-color: #fff3cd;
      color: #856404;
    }
    .error-details {
      background-color: #f8f9fa;
      padding: 10px;
      margin-top: 10px;
      border-radius: 3px;
      font-family: monospace;
      white-space: pre-wrap;
      font-size: 12px;
    }
    .duration {
      color: #6c757d;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>Shopify Integration Test Report</h1>
  <p>Generated on: ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <h2>Summary</h2>
    <div class="summary-item">
      <span>Total Test Suites:</span>
      <span>${this.results.length}</span>
    </div>
    <div class="summary-item">
      <span>Total Tests:</span>
      <span>${this.results.reduce((sum, suite) => sum + suite.tests.length, 0)}</span>
    </div>
    <div class="summary-item">
      <span>Passed:</span>
      <span>${this.results.reduce((sum, suite) => sum + suite.passed, 0)}</span>
    </div>
    <div class="summary-item">
      <span>Failed:</span>
      <span>${this.results.reduce((sum, suite) => sum + suite.failed, 0)}</span>
    </div>
    <div class="summary-item">
      <span>Skipped:</span>
      <span>${this.results.reduce((sum, suite) => sum + suite.skipped, 0)}</span>
    </div>
    <div class="summary-item">
      <span>Total Duration:</span>
      <span>${this.results.reduce((sum, suite) => sum + suite.duration, 0)}ms</span>
    </div>
  </div>
  
  ${this.results
    .map(
      (suite) => `
    <div class="test-suite">
      <div class="suite-header">
        <h3>${suite.name}</h3>
        <div>
          <span class="status passed">${suite.passed} passed</span>
          <span class="status failed">${suite.failed} failed</span>
          <span class="status skipped">${suite.skipped} skipped</span>
          <span class="duration">${suite.duration}ms</span>
        </div>
      </div>
      <div class="suite-body">
        ${suite.tests
          .map(
            (test) => `
          <div class="test-case">
            <div>
              <div>${test.name}</div>
              ${test.error ? `<div class="error-details">${test.error}</div>` : ""}
            </div>
            <div>
              <span class="status ${test.status}">${test.status}</span>
              <span class="duration">${test.duration}ms</span>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("")}
</body>
</html>
`
  }
}

