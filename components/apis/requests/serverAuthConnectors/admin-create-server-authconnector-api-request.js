/**
* @description
* The postCreteServerAuthConnectorApiRequest command is used to create a server auth connector through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.postCreteServerAuthConnectorApiRequest(serverDetails)
*/

Cypress.Commands.add('postCreteServerAuthConnectorApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'postCreteServerAuthConnectorApiRequest'

  })
  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/Create`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      AuthDesc: 'Auth'
    }
  }).then(($response) => {
    console.log('response of postCreteServerAuthConnectorApiRequest', $response)
    expect($response.status).to.eq(200)
    console.log()
    return $response.body
  })
})
