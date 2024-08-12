/**
* @description
* The deleteServerApiRequest command is used to delete a server through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.deleteServerApiRequest(bearerToken)
*/

Cypress.Commands.add('deleteServerApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'deleteServerApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      serverName: serverDetails.serverName
    }
  }).then(($response) => {
    console.log('response of deleteServerApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
