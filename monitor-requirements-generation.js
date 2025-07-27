const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = '/home/sali/ai/projects/projecthubv3/projects';
const API_BASE = 'http://localhost:3001/api';
const REFRESH_INTERVAL = 5000; // Refresh every 5 seconds

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

// Track active jobs
const activeJobs = new Map();
let startTime = Date.now();

// Count projects and requirements
function getProjectStats() {
  const stats = {
    totalProjects: 0,
    hasSpecification: 0,
    hasRequirements: 0,
    needsRequirements: 0,
    newRequirements: 0
  };
  
  const dirs = fs.readdirSync(PROJECTS_DIR);
  
  for (const dir of dirs) {
    const projectPath = path.join(PROJECTS_DIR, dir);
    
    if (fs.statSync(projectPath).isDirectory()) {
      stats.totalProjects++;
      
      const specPaths = [
        path.join(projectPath, 'specification.yaml'),
        path.join(projectPath, 'ai-generated', 'specification.yaml')
      ];
      
      const requirementsPaths = [
        path.join(projectPath, 'requirements.md'),
        path.join(projectPath, 'ai-generated', 'requirements.md')
      ];
      
      const hasSpecification = specPaths.some(p => fs.existsSync(p));
      const hasRequirements = requirementsPaths.some(p => fs.existsSync(p));
      
      if (hasSpecification) {
        stats.hasSpecification++;
        
        if (hasRequirements) {
          stats.hasRequirements++;
          
          // Check if requirements were created recently (last hour)
          const reqPath = requirementsPaths.find(p => fs.existsSync(p));
          if (reqPath) {
            const fileStat = fs.statSync(reqPath);
            const hourAgo = Date.now() - (60 * 60 * 1000);
            if (fileStat.mtimeMs > hourAgo) {
              stats.newRequirements++;
            }
          }
        } else {
          stats.needsRequirements++;
        }
      }
    }
  }
  
  return stats;
}

// Get memory usage
function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    rss: (used.rss / 1024 / 1024).toFixed(2),
    heapTotal: (used.heapTotal / 1024 / 1024).toFixed(2),
    heapUsed: (used.heapUsed / 1024 / 1024).toFixed(2),
    external: (used.external / 1024 / 1024).toFixed(2)
  };
}

// Check active Claude processes
function getClaudeProcesses() {
  try {
    const { execSync } = require('child_process');
    const output = execSync('ps aux | grep -E "claude|mcp" | grep -v grep | wc -l').toString().trim();
    return parseInt(output) || 0;
  } catch {
    return 0;
  }
}

// Format time duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Display dashboard
function displayDashboard() {
  // Clear console
  console.clear();
  
  const stats = getProjectStats();
  const memory = getMemoryUsage();
  const claudeProcesses = getClaudeProcesses();
  const elapsed = Date.now() - startTime;
  
  console.log(`${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║       REQUIREMENTS GENERATION MONITOR - CLAUDE CLI        ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Progress
  const progress = ((stats.hasRequirements / stats.hasSpecification) * 100).toFixed(1);
  const progressBar = createProgressBar(progress);
  
  console.log(`${colors.bright}📊 PROGRESS${colors.reset}`);
  console.log(`${progressBar} ${progress}%`);
  console.log(`Completed: ${colors.green}${stats.hasRequirements}${colors.reset} / ${stats.hasSpecification} projects`);
  console.log(`Remaining: ${colors.yellow}${stats.needsRequirements}${colors.reset} projects`);
  console.log(`New (last hour): ${colors.cyan}${stats.newRequirements}${colors.reset} files\n`);
  
  // Performance
  console.log(`${colors.bright}⚡ PERFORMANCE${colors.reset}`);
  console.log(`Elapsed Time: ${formatDuration(elapsed)}`);
  
  if (stats.newRequirements > 0) {
    const avgTimePerProject = elapsed / stats.newRequirements;
    const remainingTime = avgTimePerProject * stats.needsRequirements;
    console.log(`Avg Time/Project: ${formatDuration(avgTimePerProject)}`);
    console.log(`Est. Remaining: ${formatDuration(remainingTime)}`);
    console.log(`Rate: ${(stats.newRequirements / (elapsed / 1000 / 60)).toFixed(1)} projects/min`);
  }
  console.log();
  
  // System Status
  console.log(`${colors.bright}🖥️  SYSTEM STATUS${colors.reset}`);
  console.log(`Claude Processes: ${claudeProcesses > 0 ? colors.green : colors.red}${claudeProcesses}${colors.reset} / 6 workers`);
  console.log(`Memory (RSS): ${memory.rss} MB`);
  console.log(`Heap Used: ${memory.heapUsed} / ${memory.heapTotal} MB`);
  console.log(`Worker Status: ${claudeProcesses >= 6 ? colors.green + 'Full capacity' : claudeProcesses > 0 ? colors.yellow + 'Partial' : colors.red + 'Idle'}${colors.reset}`);
  console.log();
  
  // Recent Activity
  console.log(`${colors.bright}📝 RECENT FILES${colors.reset}`);
  const recentFiles = getRecentFiles(5);
  recentFiles.forEach(file => {
    const age = formatDuration(Date.now() - file.mtime);
    console.log(`${colors.green}✓${colors.reset} ${file.project} (${age} ago)`);
  });
  
  // Footer
  console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`Refreshing every ${REFRESH_INTERVAL/1000}s | Press Ctrl+C to exit`);
  console.log(`Started at: ${new Date(startTime).toLocaleTimeString()}`);
}

// Create progress bar
function createProgressBar(percentage) {
  const width = 40;
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  
  let bar = colors.green;
  bar += '█'.repeat(filled);
  bar += colors.reset;
  bar += '░'.repeat(empty);
  
  return `[${bar}]`;
}

// Get recently created requirements files
function getRecentFiles(limit) {
  const files = [];
  const dirs = fs.readdirSync(PROJECTS_DIR);
  
  for (const dir of dirs) {
    const projectPath = path.join(PROJECTS_DIR, dir);
    if (!fs.statSync(projectPath).isDirectory()) continue;
    
    const requirementsPaths = [
      path.join(projectPath, 'requirements.md'),
      path.join(projectPath, 'ai-generated', 'requirements.md')
    ];
    
    for (const reqPath of requirementsPaths) {
      if (fs.existsSync(reqPath)) {
        const stat = fs.statSync(reqPath);
        files.push({
          project: dir,
          path: reqPath,
          mtime: stat.mtimeMs
        });
      }
    }
  }
  
  // Sort by modification time and return most recent
  return files
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit);
}

// Main monitoring loop
function startMonitoring() {
  console.log('Starting requirements generation monitor...\n');
  startTime = Date.now();
  
  // Initial display
  displayDashboard();
  
  // Refresh periodically
  setInterval(() => {
    displayDashboard();
  }, REFRESH_INTERVAL);
}

// Handle exit
process.on('SIGINT', () => {
  console.log('\n\nMonitoring stopped.');
  process.exit(0);
});

// Start monitoring
startMonitoring();