/**
* @description
* The getServerPGPkeyApiRequest command is used to get the list of PGP keys at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getServerPGPkeyApiRequest(serverDetails)
*/

Cypress.Commands.add('getServerPGPkeyApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServerPGPkeyApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/PgpKeys`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerPGPkeyApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
