/**
* @description
* The deleteUserApiRequest command is used to delete a user through Api
*
* @parameters
* @param {required} serverName
* @param {required} username
* @param {required} bearerToken
*
* @example
* cy.deleteUserApiRequest(bearerToken, serverName, username)
*/

Cypress.Commands.add('deleteUserApiRequest', (bearerToken, serverName, username) => {
  Cypress.log({
    name: 'deleteUserApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverName}/AuthConnectors/native/Users/${username}?byUserName=true`,
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteUserApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
