/**
* @description
* The getGroupsListApiRequest command is used to get list of existing groups through API
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getGroupsListApiRequest(groupDetails, serverDetails)
*/

Cypress.Commands.add('getGroupsListApiRequest', (groupDetails, serverDetails) => {
  Cypress.log({
    name: 'getGroupsListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/AuthConnectors/native/Groups`,
    headers: {
      Authorization: `Bearer ${groupDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getGroupsListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
