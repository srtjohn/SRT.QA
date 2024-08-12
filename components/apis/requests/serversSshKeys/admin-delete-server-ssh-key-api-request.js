/**
* @description
* The deleteServerSSHKeyApiRequest command is used to delete a SSH key through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} keyName
* @example
* cy.deleteServerSSHKeyApiRequest(bearerToken, keyName)
*/

Cypress.Commands.add('deleteServerSSHKeyApiRequest', (serverDetails, keyDetails) => {
  Cypress.log({
    name: 'deleteServerSSHKeyApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/SshKeys/${keyDetails.keyName}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteServerSSHKeyApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
