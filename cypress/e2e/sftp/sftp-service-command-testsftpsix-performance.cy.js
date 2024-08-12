/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpsix-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpsix'

  it('all sftp operations for user testsftpsix', () => {
    cy.runSftpOperations(username)
  })
})
