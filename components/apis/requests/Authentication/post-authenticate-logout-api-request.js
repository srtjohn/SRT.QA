/**
* @description
* The postLogoutAuthenticateApiRequest command is used to logout through API
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.postLogoutAuthenticateApiRequest(bearerToken)
*/

Cypress.Commands.add('postLogoutAuthenticateApiRequest', (token) => {
  Cypress.log({
    name: 'postLogoutAuthenticateApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Authenticate/Logout?bearerToken=${token}`
  }).then(($response) => {
    console.log('response of postLogoutAuthenticateApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
