module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(react-dnd|react-dnd-html5-backend|dnd-core)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
}; 