/**
* @description
* The deleteServerNodeApiRequest command is used to delete a server node through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverNodeGUID
* @param {required} serverNodeName

* @example
* cy.deleteServerNodeApiRequest(serverDetails)
*/

Cypress.Commands.add('deleteServerNodeApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'deleteServerNodeApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Nodes/${serverDetails.serverNodeGUID}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteServerNodeApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
