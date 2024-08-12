/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpseventeen-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpseventeen'

  it('all sftp operations for user testsftpseventeen', () => {
    cy.runSftpOperations(username)
  })
})
