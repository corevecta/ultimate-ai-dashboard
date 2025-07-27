#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

let lastStats = {
  total: 0,
  completed: 0,
  failed: 0,
  pending: 0,
  recentFiles: []
};

function checkRequirementsStatus() {
  const projectsDir = '/home/sali/ai/projects/projecthubv3/projects';
  const projects = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  const stats = {
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    recentFiles: []
  };
  
  const now = Date.now();
  const recentThreshold = 5 * 60 * 1000; // 5 minutes
  
  for (const projectId of projects) {
    const specPath = path.join(projectsDir, projectId, 'ai-generated', 'specification.yaml');
    const reqPath = path.join(projectsDir, projectId, 'ai-generated', 'requirements.md');
    
    if (fs.existsSync(specPath)) {
      stats.total++;
      
      if (fs.existsSync(reqPath)) {
        const stat = fs.statSync(reqPath);
        const age = now - stat.mtimeMs;
        
        if (age < recentThreshold) {
          stats.recentFiles.push({
            projectId,
            size: stat.size,
            age: Math.floor(age / 1000),
            time: stat.mtime
          });
        }
        
        stats.completed++;
      } else {
        stats.pending++;
      }
    }
  }
  
  // Sort recent files by time
  stats.recentFiles.sort((a, b) => b.time - a.time);
  stats.recentFiles = stats.recentFiles.slice(0, 10);
  
  return stats;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatTime(seconds) {
  if (seconds < 60) return seconds + 's ago';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  return Math.floor(seconds / 3600) + 'h ago';
}

function displayStats() {
  const stats = checkRequirementsStatus();
  const progress = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0;
  
  // Clear screen
  console.clear();
  
  // Header
  console.log(`${colors.bright}${colors.cyan}📊 Requirements Regeneration Monitor${colors.reset}`);
  console.log(`${colors.dim}${new Date().toLocaleTimeString()}${colors.reset}\n`);
  
  // Overall Progress
  console.log(`${colors.bright}Progress:${colors.reset}`);
  const progressBar = generateProgressBar(stats.completed, stats.total, 40);
  console.log(`  ${progressBar} ${progress}%`);
  console.log(`  ${colors.green}✅ Completed: ${stats.completed}${colors.reset}`);
  console.log(`  ${colors.yellow}⏳ Pending: ${stats.pending}${colors.reset}`);
  console.log(`  ${colors.dim}📁 Total: ${stats.total}${colors.reset}\n`);
  
  // Rate calculation
  if (lastStats.completed > 0 && stats.completed > lastStats.completed) {
    const rate = stats.completed - lastStats.completed;
    console.log(`${colors.bright}Performance:${colors.reset}`);
    console.log(`  ${colors.cyan}📈 Rate: ${rate} files/check${colors.reset}`);
    const eta = stats.pending > 0 ? Math.ceil(stats.pending / rate) : 0;
    console.log(`  ${colors.dim}⏱️  ETA: ~${eta} checks${colors.reset}\n`);
  }
  
  // Recent Files
  if (stats.recentFiles.length > 0) {
    console.log(`${colors.bright}Recent Files (last 5 min):${colors.reset}`);
    for (const file of stats.recentFiles) {
      const size = formatBytes(file.size);
      const age = formatTime(file.age);
      console.log(`  ${colors.green}✓${colors.reset} ${file.projectId.substring(0, 40).padEnd(40)} ${size.padStart(8)} ${colors.dim}${age}${colors.reset}`);
    }
  }
  
  // Check for running process
  console.log(`\n${colors.bright}Process Status:${colors.reset}`);
  try {
    const processes = require('child_process').execSync('pgrep -f regenerate-requirements-direct.js', { encoding: 'utf-8' }).trim();
    if (processes) {
      console.log(`  ${colors.green}🟢 Script is running (PID: ${processes.split('\n')[0]})${colors.reset}`);
    } else {
      console.log(`  ${colors.red}🔴 Script is not running${colors.reset}`);
    }
  } catch {
    console.log(`  ${colors.yellow}⚠️  Cannot determine if script is running${colors.reset}`);
  }
  
  lastStats = stats;
}

function generateProgressBar(current, total, width) {
  const percent = total > 0 ? current / total : 0;
  const filled = Math.floor(percent * width);
  const empty = width - filled;
  return `[${colors.green}${'█'.repeat(filled)}${colors.dim}${'░'.repeat(empty)}${colors.reset}]`;
}

// Main monitoring loop
console.log('Starting monitor... Press Ctrl+C to exit\n');

displayStats();
setInterval(displayStats, 5000); // Update every 5 seconds

// Handle graceful exit
process.on('SIGINT', () => {
  console.log('\n\nMonitor stopped.');
  process.exit(0);
});