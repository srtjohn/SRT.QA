import label from '../../../cypress/fixtures/label.json'
import groupSelectors from '../../../selectors/groups/groups-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import userDirSelectors from '../../../selectors/user-dir-selectors.json'

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
 * @param {required} groupName  // A variable containing group name
 * @param {optional} groupDescription  // A variable containing group description
 *
 * @example
 * cy.createGroup(groupDetails)
 */

Cypress.Commands.add('createGroup', (groupDetails) => {
  Cypress.log({
    name: 'createGroupCommand'
  })
  cy.get(groupSelectors.parentGroup).eq(2).within(() => {
    cy.get(generalSelectors.textSelector).contains(label.groupName).next().type(groupDetails.groupName)
    if (groupDetails.groupDescription) {
      cy.get(generalSelectors.textSelector).contains(label.groupDescription).next().type(groupDetails.groupDescription)
    }
  })
  if (groupDetails.groupDirectoryOption) {
    cy.get(userDirSelectors.toField).realClick()
    cy.get(groupSelectors.dropDownOptions).contains(groupDetails.groupDirectoryOption).click({ force: true })
    cy.get(generalSelectors.textSelector).contains(label.subDir).next().within(()=>{
      cy.get(generalSelectors.textEdit).type(groupDetails.groupDirPath.replace(/\//g, '\\'))
     })
  }
  cy.get(groupSelectors.parentGroup).eq(2).within(() => {
    cy.clickButton(label.next)
    cy.clickButton(label.finish)
  })
})
