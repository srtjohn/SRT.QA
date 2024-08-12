import label from '../../../cypress/fixtures/label.json'
import groupSelectors from '../../../selectors/groups/groups-selectors.json'
/**
 * group creation command
 *
 * This command is used to create a group
 *
 * This command takes group details as a parameter
 *
 * @location
 * Login > {existing server} > groups
 *
 * @params
 * parameters on enter group information page
 * @param {required} groupName  // A variable containing user full name
 * @param {optional} groupDescription  // A variable containing user name
 *
 * @example
 * cy.createGroup(groupDetails)
 */

Cypress.Commands.add('createGroup', (groupDetails) => {
  Cypress.log({
    name: 'createGroupCommand'
  })
  cy.get(groupSelectors.parentGroup).eq(1).within(() => {
    cy.enterText(label.groupName, groupDetails.groupName)
    if (groupDetails.groupDescription) {
      cy.get(groupSelectors.groupDesc).type(groupDetails.groupDescription)
    }
  })
  if (groupDetails.groupDirectoryOption) {
    cy.get(groupSelectors.parentGroup).eq(1).within(() => {
      cy.get(groupSelectors.homeDir).click({ force: true })
    })
    cy.get(groupSelectors.dropDownOptions).contains(groupDetails.groupDirectoryOption).click({ force: true })
    cy.get(groupSelectors.subDir).eq(1).type(groupDetails.groupDirPath.replace(/\//g, '\\'))
  }
  cy.get(groupSelectors.parentGroup).eq(1).within(() => {
    cy.clickButton(label.next)
    cy.clickButton(label.finish)
  })
})
