#!/usr/bin/env node

/**
 * Fix Specification Issues
 * - Corrects platform types based on project naming convention
 * - Identifies and reports other specification problems
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const BACKUP_DIR = path.join(__dirname, 'specification-backups');
const REPORT_FILE = path.join(__dirname, 'specification-issues-report.txt');

// Platform mapping based on project ID patterns
const PLATFORM_PATTERNS = {
  'chrome-extension': /^cvp-chrome-extension-/,
  'firefox-extension': /^cvp-firefox-extension-/,
  'safari-extension': /^cvp-safari-extension-/,
  'edge-extension': /^cvp-edge-extension-/,
  'vscode-extension': /^cvp-vscode-extension-/,
  'mobile-app': /^cvp-mobile-app-/,
  'android-app': /^cvp-android-app-/,
  'ios-app': /^cvp-ios-app-/,
  'api-service': /^cvp-api-service-/,
  'api-rest': /^cvp-api-rest-/,
  'api-graphql': /^cvp-api-graphql-/,
  'discord-bot': /^cvp-discord-bot-/,
  'telegram-bot': /^cvp-telegram-bot-/,
  'slack-app': /^cvp-slack-app-/,
  'whatsapp-bot': /^cvp-whatsapp-bot-/,
  'cli-tool': /^cvp-cli-tool-/,
  'desktop-app': /^cvp-desktop-app-/,
  'electron-app': /^cvp-electron-app-/,
  'web-app': /^cvp-web-app-/,
  'pwa': /^cvp-pwa-/,
  'static-site': /^cvp-static-site-/,
  'wordpress-plugin': /^cvp-wordpress-plugin-/,
  'shopify-app': /^cvp-shopify-app-/,
  'notion-integration': /^cvp-notion-integration-/,
  'obsidian-plugin': /^cvp-obsidian-plugin-/,
  'figma-plugin': /^cvp-figma-plugin-/,
  'game': /^cvp-game-/,
  'blockchain-dapp': /^cvp-blockchain-dapp-/,
  'smart-contract': /^cvp-smart-contract-/,
  'iot-device': /^cvp-iot-device-/,
  'dashboard': /^cvp-dashboard-/,
  'cms': /^cvp-cms-/,
  'ecommerce': /^cvp-ecommerce-/,
  'marketplace': /^cvp-marketplace-/,
  'saas': /^cvp-saas-/,
  // Default for unmatched patterns
  'web-app': /^cvp-/  // Fallback
};

// Common specification issues to check
const SPEC_CHECKS = {
  // Check for empty or missing critical fields
  checkEmptyFields: (spec, projectId) => {
    const issues = [];
    
    // Check project section
    if (!spec.project) {
      issues.push('Missing "project" section');
    } else {
      if (!spec.project.name || spec.project.name.trim() === '') {
        issues.push('Empty or missing project.name');
      }
      if (!spec.project.description || spec.project.description.trim() === '') {
        issues.push('Empty or missing project.description');
      }
      if (spec.project.description?.elevator_pitch === '') {
        issues.push('Empty elevator_pitch in description');
      }
    }
    
    // Check features
    if (!spec.features) {
      issues.push('Missing "features" section');
    } else {
      if (!spec.features.core || spec.features.core.length === 0) {
        issues.push('No core features defined');
      }
    }
    
    // Check technical section
    if (!spec.technical) {
      issues.push('Missing "technical" section');
    } else {
      if (!spec.technical.stack || spec.technical.stack.length === 0) {
        issues.push('No technical stack defined');
      }
    }
    
    // Check business section
    if (!spec.business) {
      issues.push('Missing "business" section');
    }
    
    return issues;
  },
  
  // Check for template/placeholder content
  checkTemplateContent: (spec, projectId) => {
    const issues = [];
    const specString = JSON.stringify(spec).toLowerCase();
    
    // Common placeholder patterns
    const placeholders = [
      'lorem ipsum',
      'todo',
      'tbd',
      'placeholder',
      '[insert',
      'example text',
      'sample description'
    ];
    
    for (const placeholder of placeholders) {
      if (specString.includes(placeholder)) {
        issues.push(`Contains placeholder text: "${placeholder}"`);
      }
    }
    
    return issues;
  },
  
  // Check for incorrect structure
  checkStructure: (spec, projectId) => {
    const issues = [];
    
    // Check if description is an object when it should be a string
    if (spec.project?.description && typeof spec.project.description === 'object') {
      if (spec.project.description.elevator_pitch !== undefined) {
        issues.push('Description has incorrect structure (contains elevator_pitch as sub-field)');
      }
    }
    
    // Check feature structure
    if (spec.features?.core) {
      for (let i = 0; i < spec.features.core.length; i++) {
        const feature = spec.features.core[i];
        if (typeof feature === 'object' && !feature.name) {
          issues.push(`Core feature ${i+1} is missing name property`);
        }
      }
    }
    
    return issues;
  },
  
  // Check for consistency with project ID
  checkConsistency: (spec, projectId) => {
    const issues = [];
    
    // Project name should relate to project ID
    if (spec.project?.name) {
      const projectName = spec.project.name.toLowerCase().replace(/\s+/g, '-');
      const projectIdParts = projectId.toLowerCase().split('-').slice(3); // Remove cvp-platform-type-
      
      // Check if there's any overlap
      const hasOverlap = projectIdParts.some(part => 
        projectName.includes(part) || part.includes(projectName)
      );
      
      if (!hasOverlap && projectIdParts.join('').length > 10) {
        issues.push(`Project name "${spec.project.name}" doesn't match project ID pattern`);
      }
    }
    
    return issues;
  }
};

// Determine correct platform type from project ID
function getCorrectPlatformType(projectId) {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(projectId)) {
      return platform;
    }
  }
  return 'web-app'; // Default fallback
}

// Process single specification
async function processSpecification(projectId, specPath) {
  const report = {
    projectId,
    originalType: null,
    correctedType: null,
    typeFixed: false,
    otherIssues: [],
    error: null
  };
  
  try {
    // Read specification
    const specContent = fs.readFileSync(specPath, 'utf-8');
    const spec = yaml.load(specContent);
    
    if (!spec) {
      report.error = 'Failed to parse YAML';
      return report;
    }
    
    // Get current type
    report.originalType = spec.project?.type || 'missing';
    
    // Determine correct type
    const correctType = getCorrectPlatformType(projectId);
    report.correctedType = correctType;
    
    // Check if type needs fixing
    if (report.originalType !== correctType) {
      report.typeFixed = true;
      
      // Fix the type
      if (!spec.project) spec.project = {};
      spec.project.type = correctType;
    }
    
    // Run other checks
    for (const [checkName, checkFn] of Object.entries(SPEC_CHECKS)) {
      const issues = checkFn(spec, projectId);
      if (issues.length > 0) {
        report.otherIssues.push(...issues);
      }
    }
    
    // If changes were made, save the file
    if (report.typeFixed || process.argv.includes('--fix-all')) {
      // Create backup
      const backupPath = path.join(BACKUP_DIR, projectId, 'specification.yaml');
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(specPath, backupPath);
      
      // Save fixed specification
      const fixedYaml = yaml.dump(spec, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      });
      
      fs.writeFileSync(specPath, fixedYaml);
    }
    
  } catch (err) {
    report.error = err.message;
  }
  
  return report;
}

// Main function
async function main() {
  console.log('🔍 Analyzing and fixing specifications...\n');
  
  const dryRun = process.argv.includes('--dry-run');
  const fixAll = process.argv.includes('--fix-all');
  
  if (dryRun) {
    console.log('🔸 DRY RUN MODE - No changes will be made\n');
  }
  
  // Create backup directory
  if (!dryRun) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // Get all projects
  const projects = fs.readdirSync(PROJECTS_DIR).filter(d => 
    fs.statSync(path.join(PROJECTS_DIR, d)).isDirectory()
  );
  
  const results = {
    total: 0,
    typesMismatched: 0,
    typesFixed: 0,
    withOtherIssues: 0,
    errors: 0,
    byPlatform: {},
    issueTypes: {}
  };
  
  const reportLines = [];
  reportLines.push('SPECIFICATION ANALYSIS REPORT');
  reportLines.push('=' .repeat(80));
  reportLines.push(`Generated: ${new Date().toISOString()}`);
  reportLines.push(`Total Projects: ${projects.length}`);
  reportLines.push(`Mode: ${dryRun ? 'DRY RUN' : 'FIX MODE'}`);
  reportLines.push('=' .repeat(80));
  reportLines.push('');
  
  // Process each project
  for (const projectId of projects) {
    const specPath = path.join(PROJECTS_DIR, projectId, 'ai-generated', 'specification.yaml');
    
    if (!fs.existsSync(specPath)) {
      continue;
    }
    
    results.total++;
    
    const report = await processSpecification(projectId, specPath);
    
    // Update statistics
    if (report.typeFixed) {
      results.typesMismatched++;
      if (!dryRun) results.typesFixed++;
    }
    
    if (report.otherIssues.length > 0) {
      results.withOtherIssues++;
      
      // Track issue types
      for (const issue of report.otherIssues) {
        const issueKey = issue.split(':')[0];
        results.issueTypes[issueKey] = (results.issueTypes[issueKey] || 0) + 1;
      }
    }
    
    if (report.error) {
      results.errors++;
    }
    
    // Track by platform
    const platform = report.correctedType;
    if (!results.byPlatform[platform]) {
      results.byPlatform[platform] = { total: 0, mismatched: 0, issues: 0 };
    }
    results.byPlatform[platform].total++;
    if (report.typeFixed) results.byPlatform[platform].mismatched++;
    if (report.otherIssues.length > 0) results.byPlatform[platform].issues++;
    
    // Add to report if there are issues
    if (report.typeFixed || report.otherIssues.length > 0 || report.error) {
      reportLines.push(`PROJECT: ${projectId}`);
      if (report.typeFixed) {
        reportLines.push(`  ❌ Type Mismatch: ${report.originalType} → ${report.correctedType} ${!dryRun ? '✅ FIXED' : '(needs fix)'}`);
      }
      if (report.otherIssues.length > 0) {
        reportLines.push(`  ⚠️  Other Issues:`);
        for (const issue of report.otherIssues) {
          reportLines.push(`     - ${issue}`);
        }
      }
      if (report.error) {
        reportLines.push(`  🔥 ERROR: ${report.error}`);
      }
      reportLines.push('');
    }
    
    // Progress indicator
    if (results.total % 100 === 0) {
      process.stdout.write(`\rProcessed: ${results.total}/${projects.length}`);
    }
  }
  
  console.log(`\rProcessed: ${results.total}/${projects.length}`);
  console.log('\n');
  
  // Summary statistics
  reportLines.push('');
  reportLines.push('SUMMARY STATISTICS');
  reportLines.push('=' .repeat(80));
  reportLines.push(`Total Specifications Analyzed: ${results.total}`);
  reportLines.push(`Type Mismatches Found: ${results.typesMismatched}`);
  if (!dryRun) {
    reportLines.push(`Type Mismatches Fixed: ${results.typesFixed}`);
  }
  reportLines.push(`Projects with Other Issues: ${results.withOtherIssues}`);
  reportLines.push(`Processing Errors: ${results.errors}`);
  reportLines.push('');
  
  // Platform breakdown
  reportLines.push('BREAKDOWN BY PLATFORM');
  reportLines.push('-' .repeat(80));
  reportLines.push('Platform'.padEnd(25) + 'Total'.padEnd(10) + 'Mismatched'.padEnd(15) + 'Other Issues');
  reportLines.push('-' .repeat(80));
  
  for (const [platform, stats] of Object.entries(results.byPlatform).sort((a, b) => b[1].total - a[1].total)) {
    reportLines.push(
      platform.padEnd(25) + 
      stats.total.toString().padEnd(10) + 
      stats.mismatched.toString().padEnd(15) + 
      stats.issues.toString()
    );
  }
  
  // Issue type breakdown
  if (Object.keys(results.issueTypes).length > 0) {
    reportLines.push('');
    reportLines.push('ISSUE TYPE BREAKDOWN');
    reportLines.push('-' .repeat(80));
    for (const [issue, count] of Object.entries(results.issueTypes).sort((a, b) => b[1] - a[1])) {
      reportLines.push(`${issue}: ${count}`);
    }
  }
  
  // Save report
  const reportContent = reportLines.join('\n');
  fs.writeFileSync(REPORT_FILE, reportContent);
  
  // Print summary
  console.log('📊 SUMMARY:');
  console.log(`   Total Projects: ${results.total}`);
  console.log(`   Type Mismatches: ${results.typesMismatched}`);
  if (!dryRun) {
    console.log(`   Types Fixed: ${results.typesFixed}`);
  }
  console.log(`   Other Issues: ${results.withOtherIssues}`);
  console.log(`   Errors: ${results.errors}`);
  console.log('');
  console.log(`📄 Detailed report saved to: ${REPORT_FILE}`);
  
  if (!dryRun && results.typesFixed > 0) {
    console.log(`📁 Backups saved to: ${BACKUP_DIR}`);
  }
  
  if (dryRun && results.typesMismatched > 0) {
    console.log('\n⚡ To fix the issues, run without --dry-run flag');
  }
}

// Run
if (require.main === module) {
  main().catch(console.error);
}