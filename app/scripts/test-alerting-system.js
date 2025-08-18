#!/usr/bin/env node

/**
 * Test Alerting System
 * 
 * Sends notifications for test failures, coverage drops, and performance regressions
 * Integrates with GitHub Actions, Slack, Discord, and email notifications
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Alert configuration
const ALERT_CONFIG = {
  coverage: {
    thresholds: {
      statements: { min: 80, warning: 85, critical: 70 },
      branches: { min: 75, warning: 80, critical: 65 },
      functions: { min: 85, warning: 90, critical: 75 },
      lines: { min: 85, warning: 90, critical: 75 }
    },
    trendAlert: -5 // Alert if coverage drops by more than 5%
  },
  tests: {
    maxFailures: {
      unit: 0,
      e2e: 2,
      critical: 0
    },
    minPassRate: {
      unit: 100,
      e2e: 95,
      critical: 100
    }
  },
  performance: {
    maxBuildSizeIncrease: 10, // Percentage
    maxTestDurationIncrease: 25, // Percentage
    maxBuildTimeIncrease: 20 // Percentage
  }
};

/**
 * Read JSON file safely
 */
function readJsonFile(filePath) {
  try {
    if (!existsSync(filePath)) {
      return null;
    }
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to parse JSON file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Get GitHub context
 */
function getGitHubContext() {
  return {
    repo: process.env.GITHUB_REPOSITORY || 'unknown/repo',
    runId: process.env.GITHUB_RUN_ID || 'unknown',
    workflowName: process.env.GITHUB_WORKFLOW || 'Test Workflow',
    actor: process.env.GITHUB_ACTOR || 'unknown',
    ref: process.env.GITHUB_REF || 'unknown',
    sha: process.env.GITHUB_SHA || 'unknown',
    baseUrl: `https://github.com/${process.env.GITHUB_REPOSITORY || 'unknown/repo'}`
  };
}

/**
 * Format alert message for different channels
 */
function formatAlertMessage(alert, context, format = 'markdown') {
  const { repo, runId, workflowName, actor, baseUrl } = context;
  const severity = alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️';
  
  switch (format) {
    case 'slack':
      return {
        text: `${severity} Test Alert: ${alert.message}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${severity} Test Alert - ${alert.type}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:* ${alert.message}\n*Repository:* ${repo}\n*Workflow:* ${workflowName}\n*Triggered by:* ${actor}`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Workflow Run'
                },
                url: `${baseUrl}/actions/runs/${runId}`
              }
            ]
          }
        ]
      };
      
    case 'discord':
      return {
        embeds: [
          {
            title: `${severity} Test Alert`,
            description: alert.message,
            color: alert.severity === 'high' ? 15158332 : alert.severity === 'medium' ? 16776960 : 3447003,
            fields: [
              { name: 'Type', value: alert.type, inline: true },
              { name: 'Severity', value: alert.severity, inline: true },
              { name: 'Repository', value: repo, inline: true },
              { name: 'Workflow', value: workflowName, inline: true },
              { name: 'Triggered by', value: actor, inline: true }
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'Eleno Test Monitoring'
            }
          }
        ]
      };
      
    case 'github':
      return `## ${severity} Test Alert: ${alert.type}

**Message:** ${alert.message}
**Severity:** ${alert.severity}
**Workflow:** ${workflowName}
**Run ID:** [${runId}](${baseUrl}/actions/runs/${runId})

### Details
- **Value:** ${alert.value}
- **Threshold:** ${alert.threshold}
- **Repository:** ${repo}
- **Triggered by:** ${actor}`;

    case 'email':
      return {
        subject: `[${repo}] ${severity} Test Alert: ${alert.message}`,
        body: `
Test Alert Notification

Repository: ${repo}
Workflow: ${workflowName}
Alert Type: ${alert.type}
Severity: ${alert.severity}

Message: ${alert.message}

Details:
- Current Value: ${alert.value}
- Threshold: ${alert.threshold}
- Triggered by: ${actor}
- Workflow Run: ${baseUrl}/actions/runs/${runId}

This is an automated alert from the Eleno test monitoring system.
        `.trim()
      };
      
    default:
      return alert.message;
  }
}

/**
 * Send GitHub comment notification
 */
async function sendGitHubNotification(alerts, context) {
  if (!process.env.GITHUB_TOKEN) {
    console.log('⚠️ GITHUB_TOKEN not available, skipping GitHub notification');
    return false;
  }
  
  const { repo, runId } = context;
  const [owner, repoName] = repo.split('/');
  
  try {
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Create issue comment or update existing one
    let commentBody = `## 🚨 Test Monitoring Alert\n\n`;
    commentBody += `**Workflow Run:** [${runId}](https://github.com/${repo}/actions/runs/${runId})\n`;
    commentBody += `**Timestamp:** ${new Date().toISOString()}\n\n`;
    
    alerts.forEach(alert => {
      commentBody += formatAlertMessage(alert, context, 'github') + '\n\n';
    });
    
    commentBody += `---\n*This alert was automatically generated by the test monitoring system.*`;
    
    console.log('📝 GitHub notification prepared');
    console.log(commentBody);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send GitHub notification:', error.message);
    return false;
  }
}

/**
 * Send Slack notification
 */
async function sendSlackNotification(alerts, context) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('⚠️ SLACK_WEBHOOK_URL not configured, skipping Slack notification');
    return false;
  }
  
  try {
    for (const alert of alerts) {
      const message = formatAlertMessage(alert, context, 'slack');
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      
      if (response.ok) {
        console.log(`✅ Slack notification sent for ${alert.type} alert`);
      } else {
        console.error(`❌ Failed to send Slack notification: ${response.statusText}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send Slack notification:', error.message);
    return false;
  }
}

/**
 * Send Discord notification
 */
async function sendDiscordNotification(alerts, context) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('⚠️ DISCORD_WEBHOOK_URL not configured, skipping Discord notification');
    return false;
  }
  
  try {
    for (const alert of alerts) {
      const message = formatAlertMessage(alert, context, 'discord');
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      
      if (response.ok) {
        console.log(`✅ Discord notification sent for ${alert.type} alert`);
      } else {
        console.error(`❌ Failed to send Discord notification: ${response.statusText}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send Discord notification:', error.message);
    return false;
  }
}

/**
 * Send email notification
 */
async function sendEmailNotification(alerts, context) {
  const emailConfig = {
    smtp: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.ALERT_EMAIL_FROM,
    to: process.env.ALERT_EMAIL_TO
  };
  
  if (!emailConfig.smtp || !emailConfig.user || !emailConfig.to) {
    console.log('⚠️ Email configuration incomplete, skipping email notification');
    return false;
  }
  
  try {
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: emailConfig.smtp,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });
    
    for (const alert of alerts) {
      const emailContent = formatAlertMessage(alert, context, 'email');
      
      await transporter.sendMail({
        from: emailConfig.from,
        to: emailConfig.to,
        subject: emailContent.subject,
        text: emailContent.body
      });
      
      console.log(`✅ Email notification sent for ${alert.type} alert`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error.message);
    return false;
  }
}

/**
 * Filter alerts by severity and environment
 */
function filterAlerts(alerts) {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production' || process.env.CI === 'true';
  const branch = process.env.GITHUB_REF_NAME || 'unknown';
  
  return alerts.filter(alert => {
    // Always alert on main branch
    if (branch === 'main') {
      return true;
    }
    
    // In production/CI, alert on medium and high severity
    if (isProduction) {
      return alert.severity === 'medium' || alert.severity === 'high';
    }
    
    // In development, only alert on high severity
    return alert.severity === 'high';
  });
}

/**
 * Load alerts from metrics collector
 */
function loadAlerts() {
  const alertsPath = join(rootDir, '.test-metrics/alerts.json');
  const alertData = readJsonFile(alertsPath);
  
  if (!alertData || !alertData.alerts) {
    return [];
  }
  
  return alertData.alerts;
}

/**
 * Generate alert summary for CI step
 */
function generateAlertSummary(alerts) {
  if (alerts.length === 0) {
    return `## ✅ No Test Alerts

All test metrics are within acceptable thresholds.`;
  }
  
  let summary = `## 🚨 Test Alerts (${alerts.length})\n\n`;
  
  const groupedAlerts = alerts.reduce((groups, alert) => {
    if (!groups[alert.type]) {
      groups[alert.type] = [];
    }
    groups[alert.type].push(alert);
    return groups;
  }, {});
  
  Object.entries(groupedAlerts).forEach(([type, typeAlerts]) => {
    summary += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Alerts\n\n`;
    
    typeAlerts.forEach(alert => {
      const severity = alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️';
      summary += `- ${severity} **${alert.severity.toUpperCase()}**: ${alert.message}\n`;
    });
    
    summary += '\n';
  });
  
  return summary;
}

/**
 * Main execution
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      console.log('🔍 Checking for alerts...');
      const alerts = loadAlerts();
      const filteredAlerts = filterAlerts(alerts);
      
      console.log(`📊 Found ${alerts.length} total alerts, ${filteredAlerts.length} after filtering`);
      
      if (filteredAlerts.length > 0) {
        console.log('🚨 Alerts detected:');
        filteredAlerts.forEach(alert => {
          console.log(`  - ${alert.severity.toUpperCase()}: ${alert.message}`);
        });
      }
      
      // Exit with error code if alerts exist
      if (filteredAlerts.length > 0) {
        process.exit(1);
      }
      break;
      
    case 'notify':
      console.log('📢 Sending alert notifications...');
      const allAlerts = loadAlerts();
      const notifyAlerts = filterAlerts(allAlerts);
      
      if (notifyAlerts.length === 0) {
        console.log('✅ No alerts to notify');
        break;
      }
      
      const context = getGitHubContext();
      
      // Send notifications to configured channels
      const notifications = await Promise.allSettled([
        sendGitHubNotification(notifyAlerts, context),
        sendSlackNotification(notifyAlerts, context),
        sendDiscordNotification(notifyAlerts, context),
        sendEmailNotification(notifyAlerts, context)
      ]);
      
      const successCount = notifications.filter(n => n.status === 'fulfilled' && n.value).length;
      console.log(`📬 Sent notifications to ${successCount} channels`);
      break;
      
    case 'summary':
      const summaryAlerts = loadAlerts();
      const summary = generateAlertSummary(summaryAlerts);
      console.log(summary);
      break;
      
    default:
      console.log('Usage: node test-alerting-system.js [check|notify|summary]');
      console.log('  check   - Check for alerts and exit with error code if found');
      console.log('  notify  - Send notifications for active alerts');
      console.log('  summary - Generate alert summary for CI');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Alerting system error:', error);
  process.exit(1);
});