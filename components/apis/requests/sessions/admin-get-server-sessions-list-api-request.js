/**
* @description
* The getServerSessionsListApiRequest command is used to get the Sessions info of servers through Api
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getServerSessionsListApiRequest(ServerDetails)
*/

Cypress.Commands.add('getServerSessionsListApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServerSessionsListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Sessions/${serverDetails.serverName}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerSessionsListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
