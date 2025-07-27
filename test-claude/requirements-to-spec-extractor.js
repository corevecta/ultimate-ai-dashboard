#!/usr/bin/env node

/**
 * Extract specification.yaml from requirements.md using pattern matching
 * Fast, deterministic, no AI needed
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

function extractSpecFromRequirements(requirementsPath) {
  const content = fs.readFileSync(requirementsPath, 'utf-8');
  const lines = content.split('\n');
  
  // Initialize specification structure
  const spec = {
    meta: {
      version: '2.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      source: 'requirements-extractor'
    },
    project: {
      name: '',
      type: '',
      description: {
        elevator_pitch: '',
        detailed: '',
        unique_value: ''
      }
    },
    features: {
      core: [],
      advanced: []
    },
    technical: {
      frontend: {},
      backend: {},
      infrastructure: {}
    },
    monetization: {
      model: '',
      pricing: {
        tiers: []
      }
    }
  };
  
  // Extract project info from title and overview
  const titleMatch = content.match(/^#\s+(.+?)\s*-\s*Technical\s+(Requirements|Specifications)/m);
  if (titleMatch) {
    spec.project.name = titleMatch[1].trim();
  }
  
  // Extract platform type
  const platformMatch = content.match(/\*\*Platform\*\*:\s*(.+)/i) || 
                       content.match(/Platform Type:\s*(.+)/i);
  if (platformMatch) {
    const platform = platformMatch[1].toLowerCase();
    if (platform.includes('api')) spec.project.type = 'api-service';
    else if (platform.includes('chrome')) spec.project.type = 'chrome-extension';
    else if (platform.includes('mobile')) spec.project.type = 'mobile-app';
    else if (platform.includes('web')) spec.project.type = 'web-app';
  }
  
  // Extract description from overview section
  const overviewMatch = content.match(/##\s*Project Overview([\s\S]+?)##/i);
  if (overviewMatch) {
    const overview = overviewMatch[1];
    const firstParagraph = overview.match(/[A-Z][^.!?]+[.!?]/);
    if (firstParagraph) {
      spec.project.description.elevator_pitch = firstParagraph[0].trim();
    }
  }
  
  // Extract features
  let inFeaturesSection = false;
  let currentFeature = null;
  let featureCount = 0;
  
  for (const line of lines) {
    // Feature section detection
    if (/##\s*Feature\s*Specifications/i.test(line) || /##\s*Features/i.test(line)) {
      inFeaturesSection = true;
      continue;
    }
    
    if (inFeaturesSection && /^##\s*(?!Feature)/i.test(line)) {
      inFeaturesSection = false;
    }
    
    if (inFeaturesSection) {
      // New feature heading
      const featureMatch = line.match(/###\s*(?:\d+\.\s*)?(.+)/);
      if (featureMatch) {
        if (currentFeature) {
          const targetArray = featureCount < 5 ? spec.features.core : spec.features.advanced;
          targetArray.push(currentFeature);
        }
        currentFeature = {
          name: featureMatch[1].trim(),
          description: '',
          endpoints: []
        };
        featureCount++;
      }
      
      // Feature description
      if (currentFeature && line.match(/\*\*Description\*\*:\s*(.+)/i)) {
        currentFeature.description = line.replace(/\*\*Description\*\*:\s*/i, '').trim();
      }
      
      // API endpoints
      if (currentFeature && line.match(/^-\s*`(GET|POST|PUT|DELETE|PATCH)\s+(.+)`/)) {
        const endpointMatch = line.match(/^-\s*`(GET|POST|PUT|DELETE|PATCH)\s+(.+)`/);
        currentFeature.endpoints.push({
          method: endpointMatch[1],
          path: endpointMatch[2]
        });
      }
    }
  }
  
  // Add last feature
  if (currentFeature) {
    const targetArray = featureCount < 5 ? spec.features.core : spec.features.advanced;
    targetArray.push(currentFeature);
  }
  
  // Extract technology stack
  const techStackMatch = content.match(/###?\s*Technology Stack([\s\S]+?)###/i);
  if (techStackMatch) {
    const techSection = techStackMatch[1];
    
    // Frontend
    const frontendMatch = techSection.match(/\*\*Frontend\*\*:\s*(.+)/i);
    if (frontendMatch) {
      const frontend = frontendMatch[1];
      if (frontend.includes('React')) spec.technical.frontend.framework = 'React';
      else if (frontend.includes('Vue')) spec.technical.frontend.framework = 'Vue';
      else if (frontend.includes('Angular')) spec.technical.frontend.framework = 'Angular';
      
      if (frontend.includes('TypeScript')) spec.technical.frontend.language = 'TypeScript';
      else spec.technical.frontend.language = 'JavaScript';
    }
    
    // Backend
    const backendMatch = techSection.match(/\*\*Backend\*\*:\s*(.+)/i);
    if (backendMatch) {
      const backend = backendMatch[1];
      if (backend.includes('Node')) spec.technical.backend.framework = 'Node.js';
      else if (backend.includes('Python')) spec.technical.backend.framework = 'Python';
      else if (backend.includes('Java')) spec.technical.backend.framework = 'Java';
      
      if (backend.includes('PostgreSQL')) spec.technical.backend.database = 'PostgreSQL';
      else if (backend.includes('MongoDB')) spec.technical.backend.database = 'MongoDB';
      else if (backend.includes('MySQL')) spec.technical.backend.database = 'MySQL';
    }
  }
  
  // Extract pricing tiers
  const pricingMatch = content.match(/(?:Pricing|Monetization)[\s\S]+?(?:Free|Basic|Starter)[\s\S]+?\$(\d+)[\s\S]+?(?:Pro|Professional)[\s\S]+?\$(\d+)[\s\S]+?(?:Enterprise|Business)/i);
  if (pricingMatch) {
    spec.monetization.model = 'subscription';
    spec.monetization.pricing.tiers = [
      { name: 'Free', price: 0, features: [] },
      { name: 'Pro', price: parseInt(pricingMatch[1]), features: [] },
      { name: 'Enterprise', price: parseInt(pricingMatch[2]), features: [] }
    ];
  }
  
  return spec;
}

// Process single file or batch
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node requirements-to-spec-extractor.js <requirements.md>');
    return;
  }
  
  const inputPath = args[0];
  
  if (fs.existsSync(inputPath)) {
    console.log('📄 Extracting specification from:', inputPath);
    
    try {
      const spec = extractSpecFromRequirements(inputPath);
      
      // Output path
      const outputPath = inputPath.replace('requirements.md', 'specification-extracted.yaml');
      
      // Write YAML
      fs.writeFileSync(outputPath, yaml.stringify(spec));
      
      console.log('✅ Specification extracted to:', outputPath);
      console.log('📊 Extracted:');
      console.log(`   - Project: ${spec.project.name}`);
      console.log(`   - Type: ${spec.project.type}`);
      console.log(`   - Core Features: ${spec.features.core.length}`);
      console.log(`   - Advanced Features: ${spec.features.advanced.length}`);
      
    } catch (error) {
      console.error('❌ Error extracting specification:', error.message);
    }
  } else {
    console.error('❌ File not found:', inputPath);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { extractSpecFromRequirements };