# 📊 Test Metrics & Monitoring System

This directory contains the comprehensive test monitoring and metrics system for the Eleno project. The system provides automated tracking, analysis, and reporting of test health, coverage trends, and performance metrics.

## 🚀 Quick Start

### View Current Dashboard
```bash
npm run monitoring:dashboard:open
```

### Collect Latest Metrics
```bash
npm run monitoring:collect
npm run monitoring:trends
```

### Check for Alerts
```bash
npm run monitoring:alerts
```

### Generate Weekly Report
```bash
npm run monitoring:report:week
```

## 📁 Directory Structure

```
.test-metrics/
├── README.md                    # This file
├── metrics-history.json         # Historical test and coverage data
├── trends.json                  # Calculated trend analysis
├── alerts.json                  # Current alerts and issues
├── dashboard/
│   └── index.html              # Interactive visual dashboard
├── performance/
│   ├── performance-history.json # Build and test performance data
│   ├── benchmarks.json         # Performance benchmark results
│   └── regressions.json        # Detected performance regressions
└── reports/
    ├── weekly/                 # Weekly automated reports
    │   ├── 2024-08-18.html    # HTML report
    │   ├── 2024-08-18.md      # Markdown report
    │   └── 2024-08-18.json    # Raw data
    └── monthly/               # Monthly analytics reports
        ├── 2024-08-01.html
        ├── 2024-08-01.md
        └── 2024-08-01.json
```

## 🔧 Available Commands

### Metrics Collection
- `npm run monitoring:collect` - Collect current test metrics
- `npm run monitoring:trends` - Calculate trend analysis
- `npm run monitoring:summary` - Generate CI-friendly summary

### Alerting & Notifications
- `npm run monitoring:alerts` - Detect and report alerts
- `npm run monitoring:notify` - Send notifications to configured channels

### Dashboard & Visualization
- `npm run monitoring:dashboard` - Generate visual dashboard
- `npm run monitoring:dashboard:open` - Generate and open dashboard

### Performance Monitoring
- `npm run monitoring:performance` - Run performance benchmark
- `npm run monitoring:regressions` - Detect performance regressions
- `npm run monitoring:recommendations` - Get optimization suggestions

### Reporting
- `npm run monitoring:report:week` - Generate weekly report
- `npm run monitoring:report:month` - Generate monthly report
- `npm run monitoring:quality` - Show quality score analysis

## 📊 What Gets Tracked

### Test Metrics
- **Coverage**: Statement, branch, function, and line coverage percentages
- **Test Results**: Pass/fail counts, flaky tests, execution duration
- **Trends**: Coverage improvements/declines over time
- **Pass Rates**: E2E test reliability and failure patterns

### Performance Metrics
- **Build Times**: TypeScript compilation, Vite builds (staging/production)
- **Test Duration**: Unit test and E2E test execution times
- **Bundle Size**: Production bundle size tracking
- **Cache Performance**: Node modules and build cache effectiveness

### Quality Metrics
- **Quality Score**: Overall score (0-100) based on coverage, reliability, and performance
- **Alert Count**: Number of active high/medium/low priority alerts
- **Regression Detection**: Automated detection of performance regressions
- **Trend Analysis**: Historical pattern analysis and predictions

## 🚨 Alert Types

The system monitors for these types of issues:

### Coverage Alerts
- Statement coverage drops below 80%
- Coverage decreases by more than 5% between runs
- Branch coverage below minimum thresholds

### Test Reliability Alerts
- Failed tests in critical test suites
- E2E pass rate below 95%
- Increase in flaky test frequency

### Performance Alerts
- Build time increases by more than 20%
- Bundle size increases by more than 10%
- Test execution time regression

## 🔔 Notification Channels

Configure these environment variables for notifications:

```bash
# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Discord Integration  
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_USER=alerts@company.com
SMTP_PASS=app_password
ALERT_EMAIL_TO=team@company.com
```

## 📈 Dashboard Features

The interactive dashboard provides:

- **Real-time Metrics**: Current coverage, test results, and build status
- **Trend Charts**: 30-day historical views with interactive charts
- **Performance Tracking**: Build time and bundle size trends
- **Alert Notifications**: Prominent display of active issues
- **Quality Score**: Visual indicator of overall test health

## 🔄 Automation

### GitHub Actions Integration
The monitoring system integrates with existing workflows and provides:

- **Automatic Collection**: Metrics collected after every test run
- **Scheduled Reports**: Weekly and monthly automated reports
- **Alert Notifications**: Immediate notifications for critical issues
- **Performance Tracking**: Regression detection in CI/CD

### Manual Triggers
You can manually trigger monitoring workflows:

```bash
# Trigger monitoring workflow
gh workflow run test-monitoring.yml -f report_type=week -f include_performance=true
```

## 🛠️ Troubleshooting

### No Data in Dashboard
```bash
# Check if metrics exist
ls -la .test-metrics/

# Manually collect metrics
npm run monitoring:collect
npm run monitoring:dashboard
```

### Alerts Not Working
```bash
# Test alert detection
npm run monitoring:alerts

# Check notification config
echo $SLACK_WEBHOOK_URL
```

### Performance Issues
```bash
# Run performance benchmark
npm run monitoring:performance

# Check for regressions
npm run monitoring:regressions
```

## 📚 Data Retention

The system automatically manages data retention:

- **Metrics History**: Last 100 data points
- **Performance History**: Last 50 benchmarks
- **Reports**: 90 days retention
- **Artifacts**: 30 days in GitHub Actions

## 🔮 Quality Score Calculation

The quality score (0-100) considers:

- **40%**: Coverage metrics (statements, branches, functions, lines)
- **30%**: Test reliability (pass rates, flaky test frequency)
- **20%**: Performance trends (build times, bundle size)
- **10%**: Active alerts and regressions

## 🤝 Contributing

To improve the monitoring system:

1. **Add New Metrics**: Extend collectors in `../scripts/`
2. **Improve Visualizations**: Enhance dashboard charts and layouts
3. **Add Integrations**: Create new notification channels
4. **Optimize Performance**: Improve script execution and data storage

## 📞 Support

For issues with monitoring:

1. Check the [Test Monitoring Guide](../docs/TEST_MONITORING_GUIDE.md)
2. Review troubleshooting steps above
3. Check GitHub Issues for known problems
4. Create new issue with diagnostic information

---

*This monitoring system provides comprehensive visibility into test health and helps maintain high code quality standards across the Eleno development process.*