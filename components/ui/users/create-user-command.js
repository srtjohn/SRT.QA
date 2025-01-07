import userSelectors from '../../../selectors/user/user-selectors.json'
import label from '../../../cypress/fixtures/label.json'
import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../selectors/dashboard-selectors.json'
/**
 * User creation command
 *
 * This command is used to create a user
 *
 * This command takes user details as a parameter and assign group as optional parameter
 *
 * @location
 * Login > {existing server} > users
 *
 * @params
 * parameters on enter user information page
 * @param {optional} userFullName  // A variable containing user full name
 * @param {required} userName  // A variable containing user name
 * @param {required} password  // A variable containing password
 * @param {required} confirmPassword  // A variable containing confirm password
 * @param {optional} emailAddress  // A variable containing email address
 * @param {optional} mobileNumber  // A variable containing mobile number
 * @param {required} checkboxPreferredNotificationMethod  // A variable containing preferred notification method, by default email is selected
 * @param {optional} additionalUserRoles  // A variable containing additional user roles
 * @param {optional} userDescription  // A variable containing server name
 * parameters on assign to groups page
 * @param {optional} currentGroups  // A variable containing server name
 * @param {optional} availableGroups  // A variable containing server name
 * parameters on configure user options page
 * @param {optional} primaryGroup  // A variable containing server name
 * @param {optional} homeDirectory  // A variable containing server name
 * @param {optional} checkboxCreateHomeDirectoryNow  // A variable containing server name
 * @param {optional} checkboxAlwaysAllowUserLogin  // A variable containing server name
 * @param {optional} checkboxAccountEnabled  // A variable containing server name
 *
 * @example
 * cy.createUser(userDetails)
 * cy.createUser(userDetails,true)
 */

Cypress.Commands.add('createUser', (userDetails) => {
  Cypress.log({
    name: 'createUserCommand'
  })
  cy.enterText(label.userName, userDetails.userName)
  cy.enterText(label.password, userDetails.password)
  cy.enterText(label.confirmPassword, userDetails.password)
  cy.clickButton(label.next)
  cy.checkTextVisibility(userSelectors.userPageHeading, label.assignMembers)
  if (userDetails.groupName) {
    cy.contains(htmlTagSelectors.div, userDetails.groupName).parents(userSelectors.parentCell)
      .prev(htmlTagSelectors.div).click({ force: true })
  }
  cy.clickButton(label.next)
  cy.checkTextVisibility(userSelectors.userPageHeading, label.configureUserOptions)
  if (userDetails.homeDirectoryOption) {
    cy.get(dashboardSelectors.textInput).eq(2).realClick()
    cy.get(userSelectors.dropDownOptions).contains(label.customDir).click()
    cy.contains(htmlTagSelectors.label, label.customDirectoryInput).next().clear().type(userDetails.customDirPath.replace(/\//g, '\\'))
    cy.contains(htmlTagSelectors.label, label.createHomeDir).prev(htmlTagSelectors.div).realClick()
  }
  cy.clickButton(label.finish)
})
