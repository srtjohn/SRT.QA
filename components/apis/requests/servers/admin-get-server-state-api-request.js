/**
* @description
* The getServerState command is used to get the state of a server through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getServersState(serverDetails)
*/

Cypress.Commands.add('getServerState', (serverDetails) => {
  Cypress.log({
    name: 'getServerState'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/State`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerState', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
