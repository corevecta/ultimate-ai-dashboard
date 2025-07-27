// This file contains the updates needed for the generateMockRequirements function

// First, add advanced features section after functional requirements:
const advancedFeaturesSection = `
### Advanced Features

${advancedFeatures.length > 0 ? advancedFeatures.map((feature: any, index: number) => 
`${index + 1}. **${getFeatureName(feature)}**
   - ${getFeatureDescription(feature)}
   - Integration with core system components
   - Enhanced user experience and productivity
   - Advanced configuration options`
).join('\n\n') : `1. **Advanced Functionality**
   - Extended features and capabilities
   - Premium user features
   - Advanced integrations
   - Future enhancements`}
`

// Update user stories to use helper functions:
const userStoriesUpdate = `
1. As a user, I want to ${coreFeatures[0] ? getFeatureDescription(coreFeatures[0]) : 'access the main functionality'} so that I can achieve my goals efficiently
`

// Update timeline sections:
const timelineUpdate = `
### Phase 2: Core Features (Weeks 5-8)
- ${coreFeatures[0] ? getFeatureName(coreFeatures[0]) : 'Primary feature implementation'}
- ${coreFeatures[1] ? getFeatureName(coreFeatures[1]) : 'Secondary feature development'}
- API development and documentation
- Basic UI/UX implementation

### Phase 3: Advanced Features (Weeks 9-12)
- ${advancedFeatures[0] ? getFeatureName(advancedFeatures[0]) : 'Advanced feature development'}
- ${advancedFeatures[1] ? getFeatureName(advancedFeatures[1]) : 'Enhanced functionality'}
- Third-party integrations
- Performance optimization
`