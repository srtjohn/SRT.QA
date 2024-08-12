/**
* @description
* The UpdateServerEventHandlerApiRequest command is used to update a server level event through api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} Eventname
*
* @example
* cy.UpdateServerEventHandlerApiRequest(serverDetails, Eventname)
*/

Cypress.Commands.add('UpdateServerEventHandlerApiRequest', (serverDetails, Eventname) => {
  Cypress.log({
    name: 'UpdateServerEventHandlerApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Events`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      ECAData: {
        Name: Eventname
      }
    }
  }).then(($response) => {
    console.log('response of UpdateServerEventHandlerApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
