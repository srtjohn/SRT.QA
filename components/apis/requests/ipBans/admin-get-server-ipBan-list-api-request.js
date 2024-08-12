/**
* @description
* The getIPBanListApiRequest command is used to get the list of banned IPs through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getIPBanListApiRequest(bearerToken)
*/

Cypress.Commands.add('getIPBanListApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getIPBanListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/IPBans/${serverDetails.serverName}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getIPBanListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
