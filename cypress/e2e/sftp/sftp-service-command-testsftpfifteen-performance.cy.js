/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpfifteen-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpfifteen'

  it('all sftp operations for user testsftpfifteen', () => {
    cy.runSftpOperations(username)
  })
})
