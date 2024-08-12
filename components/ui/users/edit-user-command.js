import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import userSelectors from '../../../selectors/user/user-selectors.json'
import label from '../../../cypress/fixtures/label.json'
/**
 * User Edit Command
 *
 * This command is used to Edit a user
 *
 * This command takes user name,Menu option as a parameter and assign group , password as optional parameter
 *
 * @location
 * Login > {existing server} > users
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
 *
* @example
* cy.editUser(userDetails)
*/

Cypress.Commands.add('editUser', (username, menuOption = label.editUserAssignedGroups, assignGroup = false, password = label.password) => {
  cy.contains(htmlTagSelectors.div, username).scrollIntoView().parents(userSelectors.parentCell)
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.button).click({ force: true })
    })

  switch (menuOption) {
    case label.editUserAssignedGroups:
      cy.get(userSelectors.parentUsers).contains(menuOption).click()
      cy.clickButton(label.next)
      cy.checkTextVisibility(userSelectors.userPageHeading, label.assignToGroups)
      if (assignGroup) {
        cy.contains(htmlTagSelectors.div, label.autoGroupName).parents(userSelectors.parentCell)
          .prev(htmlTagSelectors.div).within(() => {
            cy.get(htmlTagSelectors.button).click({ force: true })
          })
        cy.clickButton(label.next)
        cy.clickButton(label.finish)
      } else {
        cy.contains(htmlTagSelectors.div, label.autoGroupName).parents(userSelectors.parentCell)
          .next(htmlTagSelectors.div).click()
        cy.clickButton(label.next)
        cy.clickButton(label.finish)
      }
      break
    case label.setUserPassword:
      cy.get(userSelectors.parentUsers).contains(menuOption).click()
      cy.enterText(label.password, password)
      cy.enterText(label.confirmPassword, password)
      cy.clickButton(label.save)
      break
    case label.sendPassResetEmail:
      cy.get(userSelectors.parentUsers).contains(menuOption).click()
      cy.get(userSelectors.emailAddressField).type(label.email)
      cy.clickButton(label.sendResetEmailButtonText)
      break
    case label.editUserFileDirectories:
      cy.get(userSelectors.parentUsers).contains(menuOption).click()
      break
  }
})
