/**
* @description
* The UpdateServerPGPKeyApiRequest command is used to update a PGP key through Api
*
* @parameters
* @param {required} serverName
* @param {required} bearerToken
* @param {required} keyName
* @example
* cy.UpdateServerPGPKeyApiRequest(bearerToken, keyName)
*/

Cypress.Commands.add('UpdateServerPGPKeyApiRequest', (serverDetails, keyDetails) => {
  Cypress.log({
    name: 'UpdateServerPGPKeyApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/PgpKeys`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      ServerGUID: serverDetails.serverGUID,
      Id: keyDetails.Id,
      Document: {
        Name: keyDetails.newKeyName
      }
    }
  }).then(($response) => {
    console.log('response of UpdateServerPGPKeyApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
