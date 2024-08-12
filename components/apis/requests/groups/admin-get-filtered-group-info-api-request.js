/**
* @description
* The getFilteredGroupsInfoApiRequest command is used to get filtered group information through API
*
* @parameters
* @param {required} bearerToken
* @param {required} GroupsName
* @param {required} serverName

*
* @example
* cy.getFilteredGroupsInfoApiRequest(userDetails, groupDetails)
*/

Cypress.Commands.add('getFilteredGroupsInfoApiRequest', (groupDetails, serverDetails) => {
  Cypress.log({
    name: 'getFilteredGroupsInfoApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/AuthConnectors/native/Groups/${groupDetails.groupName}/Filtered?byGroupName=true`,
    headers: {
      Authorization: `Bearer ${groupDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getFilteredGroupsInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
