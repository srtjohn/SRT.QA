/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpeighteen-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpeighteen'

  it('all sftp operations for user testsftpeighteen', () => {
    cy.runSftpOperations(username)
  })
})
