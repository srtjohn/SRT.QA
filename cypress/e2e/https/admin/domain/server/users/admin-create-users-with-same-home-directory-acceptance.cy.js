import label from '../../../../../../fixtures/label.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains test to ensure admin can create two users with same home directory
 *
 * @issueID - NX-I1300
 *
 * @breadcrumb
 * Login > {existing server} > users > edit user
 *
 * @assertions
 * To verify that admin can create two users with same home directory
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('login', () => {
  const userNames = [`qa-auto-first-user-${Cypress.dayjs().format('ssmmhhMMYY')}`, `qa-auto-second-user-${Cypress.dayjs().format('ssmmhhMMYY')}`]
  const homeDirectory = 'C:\\srtMFTData\\qa auto DO NOT DELETE\\SameHomeDir\\'
  const firstUserDetails = {
    username: userNames[0],
    password: 'testing123',
    serverName: label.autoServerName
  }
  const secondUserDetails = {
    username: userNames[1],
    password: firstUserDetails.password,
    serverName: label.autoServerName
  }
  const localPath = '../fixtures/local.txt'
  const remoteDirFileName = 'file.txt'
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: userNames,
    password: firstUserDetails.password
  }

  function editUserHomeDir (username) {
    cy.get(dashboardSelectors.search).clear().type(username)
    cy.wait(1000)
    cy.contains(htmlTagSelectors.div, username).parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).within(() => {
        cy.waitForNetworkIdle(500, { log: false })
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.get(dashboardSelectors.dashBoardList).contains(label.editUserAssignedGroups).click({ force: true })
    cy.get(generalSelectors.labelSelector).contains(label.next).click()
    cy.get(generalSelectors.labelSelector).contains(label.next).click()
    cy.get(userSelectors.roleBtn).contains(label.defaultHomeDir).click({ force: true })
    cy.get(dashboardSelectors.dashBoardList).contains(label.customDir).click({ force: true })
    cy.get(userSelectors.homeDirInputField).clear().type(homeDirectory)
    cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.finish).click()
    cy.waitForNetworkIdle(1000, { log: false })
  }

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      // Check if ErrorStr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      firstUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(firstUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(firstUserDetails.username)
      secondUserDetails.bearerToken = firstUserDetails.bearerToken
    })
    cy.postCreateUserApiRequest(secondUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(secondUserDetails.username)
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that admin can create a user through API', () => {
    // Navigate to users page
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    editUserHomeDir(firstUserDetails.username)
    editUserHomeDir(secondUserDetails.username)

    // verify home directory is same or not

    // uploading file from first user
    cy.task('sftpUploadFile', { localPath, remoteDirFile: `./${remoteDirFileName}`, configSFTP: { ...configSFTP, username: userNames[0] } }).then(p => {
      expect(`${JSON.stringify(p)}`).to.include(`"Uploaded data stream to ./${remoteDirFileName}"`)
      cy.task('endSFTPConnection')
    })

    // verifying file exists in other user
    cy.task('sftpListFiles', { remoteDir: '/', configSFTP: { ...configSFTP, username: userNames[1] } }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(remoteDirFileName)
      cy.task('endSFTPConnection')
    })
  })

  afterEach('deleting a user and logout', () => {
    // calling delete user function
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, firstUserDetails.serverName, firstUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, secondUserDetails.serverName, secondUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
