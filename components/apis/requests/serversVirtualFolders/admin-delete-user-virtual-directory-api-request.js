/**
* @description
* The deleteUserVirtualDirectoryApiRequest command is used to delete a virtual directory through API
*
*@parameters
*@param {required} bearerToken
*@param {required} serverName
*@param {required} Id
*@param {required} UserGUID
*
* @example
* cy.deleteUserVirtualDirectoryApiRequest()
*/

Cypress.Commands.add('deleteUserVirtualDirectoryApiRequest', (opts) => {
  Cypress.log({
    name: 'deleteUserVirtualDirectoryApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${opts.serverName}/VirtualFolders/${opts.Id}/Owner/${opts.UserGUID}`,
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteUserVirtualDirectoryApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
