/**
* @description
* The UpdateUserInfoApiRequest command is used to update user information through Api
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.UpdateUserInfoApiRequest(serverDetails, opts)
*/

Cypress.Commands.add('UpdateUserInfoApiRequest', (serverDetails, opts) => {
  Cypress.log({
    name: 'UpdateUserInfoApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/native/Users/${opts.username}?byUserName=true`,
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    },
    body: {
      UserGUID: opts.UserGUID,
      Username: opts.newUserName,
      AuthGUID: opts.AuthGUID
    }
  }).then(($response) => {
    console.log('response of UpdateUserInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
