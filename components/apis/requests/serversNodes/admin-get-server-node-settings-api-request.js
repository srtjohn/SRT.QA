/**
* @description
* The getServerNodeSettingsApiRequest command is used to get sever node settings through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} ServerName
* @param {required} serverNodeGUID
*
* @example
* cy.getServerNodeSettingsApiRequest(serverDetails)
*/

Cypress.Commands.add('getServerNodeSettingsApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServerNodeSettingsApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Nodes/${serverDetails.serverNodeGUID}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerNodeSettingsApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
