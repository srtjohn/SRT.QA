/**
* @description
* The postCreateServerReportApiRequest command is used to create a new server report through API
*
* @parameters
* @param {required} bearerToken
* @param {required} ServerGUID
* @param {required} serverName
*
* @example
* cy.postCreateServerReportApiRequest(serverDetails)
*/

Cypress.Commands.add('postCreateServerReportApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'postCreateServerReportApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/Reports`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      ServerGUID: serverDetails.ServerGUID,
      Report: {
        OwnerGUID: serverDetails.ServerGUID
      }
    }
  }).then(($response) => {
    console.log('response of postCreateServerReportApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
