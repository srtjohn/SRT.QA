/**
* @description
* The deleteUpdatedVirtualDirectoryApiRequest command is used to delete a virtual directory through API
*
* @example
* cy.deleteUpdatedVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails);
*/

Cypress.Commands.add('deleteUpdatedVirtualDirectoryApiRequest', (virtualDirectoryDetails, serverDetails) => {
  Cypress.log({
    name: 'deleteUpdatedVirtualDirectoryApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/VirtualFolders/${virtualDirectoryDetails.Id}/Owner/${serverDetails.serverName}`,
    headers: {
      Authorization: `Bearer ${virtualDirectoryDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteUpdatedVirtualDirectoryApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
