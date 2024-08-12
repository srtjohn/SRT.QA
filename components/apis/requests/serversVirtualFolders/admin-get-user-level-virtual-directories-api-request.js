import label from '../../../../cypress/fixtures/label.json'
/**
* @description
* The getUsersVirtualDirectoriesApiRequest command is used to get the list of virtual directories at user level through Api
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getUsersVirtualDirectoriesApiRequest(serverDetails, userDetails)
*/

Cypress.Commands.add('getUsersVirtualDirectoriesApiRequest', (serverDetails, userDetails) => {
  Cypress.log({
    name: 'getUsersVirtualDirectoriesApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/${label.usersNATIVETab}/Users/${userDetails.username}/VirtualFolders`,
    headers: {
      Authorization: `Bearer ${userDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getUsersVirtualDirectoriesApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
