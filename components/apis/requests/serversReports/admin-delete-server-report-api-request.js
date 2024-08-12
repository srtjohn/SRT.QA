/**
* @description
* The deleteServerReportApiRequest command is used to delete a Server report through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} keyName
* @example
* cy.deleteServerReportApiRequest(serverDetails)
*/

Cypress.Commands.add('deleteServerReportApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'deleteServerReportApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/Reports/${serverDetails.reportId}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteServerReportApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
