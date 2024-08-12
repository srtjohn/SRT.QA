/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwentyfour-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwentyfour'

  it('all sftp operations for user testsftptwentyfour', () => {
    cy.runSftpOperations(username)
  })
})
