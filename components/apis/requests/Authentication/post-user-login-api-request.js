/**
* @description
* The postUserLoginApiRequest command is used to login through API
*
* @parameters
* @param {required} username
* @param {required} password
*
* @example
* cy.postUserLoginApiRequest({
*   user: 'usernameValue',
*   pass: 'passwordValue',
* })
*/

Cypress.Commands.add('postUserLoginApiRequest', (opts) => {
  Cypress.log({
    name: 'postUserLoginApiRequest'
  })

  cy.request({
    method: 'POST',
    url: `${Cypress.env('baseUrl')}/WebApi/Login`,
    body: {
      User: opts.username,
      Pass: opts.password
    }
  }).then(($response) => {
    console.log('response of postUserLoginApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
