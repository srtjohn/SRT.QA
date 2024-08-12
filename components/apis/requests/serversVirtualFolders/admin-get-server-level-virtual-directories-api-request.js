/**
* @description
* The getServersVirtualDirectoriesApiRequest command is used to get the list of virtual directories at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getServersVirtualDirectoriesApiRequest(serverDetails)
*/

Cypress.Commands.add('getServersVirtualDirectoriesApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServersVirtualDirectoriesApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/VirtualFolders`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServersVirtualDirectoriesApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
