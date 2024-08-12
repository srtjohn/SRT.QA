/**
* @description
* The getServerNodesListApiRequest command is used to get the list of sever nodes through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} ServerName
*
* @example
* cy.getServerNodesListApiRequest(serverDetails)
*/

Cypress.Commands.add('getServerNodesListApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServerNodesListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Nodes`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerNodesListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
