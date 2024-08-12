const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents (on, config) {
      return require('../plugins/index.js')(on, config)
    },
    baseUrl: 'https://beta.southrivertech.com'
  },
  projectId: 'vdwu1o',
  chromeWebSecurity: false,
  video: true,
  defaultCommandTimeout: 120000,
  viewportWidth: 1440,
  viewportHeight: 1000,
  watchForFileChanges: false,
  pageLoadTimeout: 45000,
  responseTimeout: 45000,
  requestTimeout: 45000,
  env: {
    baseUrl: 'https://beta.southrivertech.com',
    apiBaseUrl: 'https://beta.southrivertech.com:41443',
    admin: {
      adminBaseUrl: ':41443/',
      adminUsername: process.env.adminUsername,
      adminPassword: process.env.adminPassword
    },
    user: {
      fileOperations: {
        single: 'singlefile',
        bulk: 'bulkfile'
      },
      directoryOperations: {
        single: 'singledir',
        bulk: 'bulkdir'
      },
      userBaseUrl: '/',
      Username: 'testsftp',
      Password: '123456'
    },
    api: {
      domainGUID: 'ed2ecaec-33a3-4ea3-b0e5-a70453775b9b',
      EveryoneGroupGUID: 'db2112ad-feed-0004-0000-000000000000'
    }
  }
})
