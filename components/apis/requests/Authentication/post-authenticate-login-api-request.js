/**
* @description
* The postLoginAuthenticateApiRequest command is used to login through API
*
* @parameters
* @param {required} username
* @param {required} password
*
* @example
* cy.postLoginAuthenticateApiRequest({
*   username: 'usernameValue',
*   password: 'passwordValue',
* })
*/

Cypress.Commands.add('postLoginAuthenticateApiRequest', (opts) => {
  Cypress.log({
    name: 'postLoginAuthenticateApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Authenticate/Login`,
    body: {
      UserName: opts.username,
      PassWord: opts.password
    }
  }).then(($response) => {
    console.log('response of postLoginAuthenticateApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
