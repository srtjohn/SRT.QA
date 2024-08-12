/**
* @description
* The deleteAuthConnectorApiRequest command is used to delete a server auth connector through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.deleteAuthConnectorApiRequest(serverDetails)
*/

Cypress.Commands.add('deleteAuthConnectorApiRequest', (serverDetails, AuthGUID) => {
  Cypress.log({
    name: 'deleteAuthConnectorApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/${AuthGUID}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteAuthConnectorApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
