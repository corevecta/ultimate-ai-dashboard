// Condensed prompt for requirements generation
function createCondensedPrompt(projectId, spec) {
  return `
# Generate requirements.md for ${projectId}

Read specification.yaml and create requirements.md (min 2000 words).

PLATFORM DETECTION:
Project ID: ${projectId}
Pattern: cvp-[platform]-[name]
Detected platform: ${projectId.split('-').slice(1, 3).join('-')}

OVERRIDE RULE: If spec.project.type says "${spec.project?.type}" but ID indicates "${projectId.split('-')[1]}-${projectId.split('-')[2]}", trust the ID.

${projectId.includes('api-service') ? 'This is an API SERVICE, not a web app.' : ''}
${projectId.includes('chrome-extension') ? 'This is a CHROME EXTENSION, not a web app.' : ''}
${projectId.includes('mobile-app') ? 'This is a MOBILE APP, not a web app.' : ''}

Write requirements for: ${projectId.split('-').slice(3).join(' ').replace(/-/g, ' ').toUpperCase()}

Include:
1. Project Overview (for correct platform type)
2. 8-12 specific features with:
   - Description, User Flow, API Endpoints/Implementation
   - Data Models, Dependencies
3. Technical Architecture (platform-appropriate stack)
4. Implementation Roadmap (3 phases)
5. Development Guidelines
6. Testing Strategy

${projectId.includes('city-service-reporter') ? `
Example features: Report submission API, Location services, Photo uploads, Status tracking, Department routing, Notifications, Analytics, Admin APIs
` : ''}

Focus on what ${projectId} ACTUALLY does, not generic templates.

Start writing requirements.md now.
`;
}

// Export for use in regeneration scripts
module.exports = { createCondensedPrompt };