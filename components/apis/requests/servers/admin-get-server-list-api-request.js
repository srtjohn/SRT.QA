/**
* @description
* The getServerListApiRequest command is used to get the list of servers through Api
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getServerListApiRequest(bearerToken)
*/

Cypress.Commands.add('getServerListApiRequest', (token) => {
  Cypress.log({
    name: 'getServerListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(($response) => {
    console.log('response of getServerListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
