/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpsixteen-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpsixteen'

  it('all sftp operations for user testsftpsixteen', () => {
    cy.runSftpOperations(username)
  })
})
