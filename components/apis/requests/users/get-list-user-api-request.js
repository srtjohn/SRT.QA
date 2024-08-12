/**
* @description
* The getListUserApiRequest command is used to list users through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getListUserApiRequest(bearerToken, serverName)
*/

Cypress.Commands.add('getListUserApiRequest', (opts) => {
  Cypress.log({
    name: 'getListUserApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${opts.serverName}/AuthConnectors/native/Users`,
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }

  }).then(($response) => {
    console.log('response of getListUserApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
