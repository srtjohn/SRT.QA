/**
* @description
* The updateServerNodeApiRequest command is used to update a server node through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} ServerNodeName
*
* @example
* cy.updateServerNodeApiRequest(serverDetails)
*/

Cypress.Commands.add('updateServerNodeApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'updateServerNodeApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Nodes/${serverDetails.serverNodeGUID}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      ServerNodeName: serverDetails.updatedServerNodeName
    }
  }).then(($response) => {
    console.log('response of updateServerNodeApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
