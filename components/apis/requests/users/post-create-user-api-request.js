/**
* @description
* The postCreateUserApiRequest command is used to create a new user thorough API
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} username
* @param {required} password
*
* @example
* cy.postCreateUserApiRequest({
*   bearerToken: 'bearerTokenValue',
*   serverName: 'serverNameValue',
*   username: 'usernameValue',
*   password: 'passwordValue',
* })
*/

Cypress.Commands.add('postCreateUserApiRequest', (opts) => {
  Cypress.log({
    name: 'postCreateUserApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${opts.serverName}/AuthConnectors/native/Users`,
    body: {
      UserName: opts.username,
      PassWord: opts.password
    },
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of postCreateUserApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
