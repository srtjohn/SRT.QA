/**
* @description
* The getDomainListApiRequest command is used to get the list of domains through Api
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getDomainListApiRequest(bearerToken)
*/

Cypress.Commands.add('getDomainListApiRequest', (token) => {
  Cypress.log({
    name: 'getDomainListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Domains`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(($response) => {
    console.log('response of getDomainListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
