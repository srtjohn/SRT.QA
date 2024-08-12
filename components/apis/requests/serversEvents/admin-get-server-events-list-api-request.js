/**
* @description
* The getServerEventsApiRequest command is used to get the list of Events and event handlers for a server through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} RequestType
*
* @example
* cy.getServerEventsApiRequest(serverDetails, RequestType)
*/

Cypress.Commands.add('getServerEventsApiRequest', (serverDetails, RequestType) => {
  Cypress.log({
    name: 'getServerEventsApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/${RequestType}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerEventsApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
