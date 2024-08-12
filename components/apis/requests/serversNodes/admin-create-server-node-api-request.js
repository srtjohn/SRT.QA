/**
* @description
* The createServerNodeApiRequest command is used to create a server node through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} ServerNodeName
*
* @example
* cy.createServerNodeApiRequest(serverDetails)
*/

Cypress.Commands.add('createServerNodeApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'createServerNodeApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Nodes/Create`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      ServerNodeName: serverDetails.serverNodeName
    }
  }).then(($response) => {
    console.log('response of createServerNodeApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
