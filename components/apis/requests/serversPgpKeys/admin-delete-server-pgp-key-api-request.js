/**
* @description
* The deleteServerPGPKeyApiRequest command is used to delete a PGP key through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} keyName
*
* @example
* cy.deleteServerPGPKeyApiRequest(bearerToken, keyName)
*/

Cypress.Commands.add('deleteServerPGPKeyApiRequest', (serverDetails, keyDetails) => {
  Cypress.log({
    name: 'deleteServerPGPKeyApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/PgpKeys/${keyDetails.keyName}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteServerPGPKeyApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
