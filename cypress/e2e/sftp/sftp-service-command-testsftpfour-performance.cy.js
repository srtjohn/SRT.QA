/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpfour-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpfour'

  it('all sftp operations for user testsftpfour', () => {
    cy.runSftpOperations(username)
  })
})
