/**
* @description
* The postCreateUserVirtualDirectoryApiRequest command is used to create a virtual directory through API at user level
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} UserGUID
* @param {required} ActualPath
* @param {required} Path
* @param {required} AllowAce
* @param {required} DenyAce
*
* @example
* cy.postCreateUserVirtualDirectoryApiRequest(opts, virtualDirectoryDetails)
*/

Cypress.Commands.add('postCreateUserVirtualDirectoryApiRequest', (opts, virtualDirectoryDetails) => {
  Cypress.log({
    name: 'postCreateUserVirtualDirectoryApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${opts.serverName}/VirtualFolders/${opts.UserGUID}`,
    body: {
      ActualPath: virtualDirectoryDetails.ActualPath,
      Path: virtualDirectoryDetails.Path,
      AllowAce: virtualDirectoryDetails.AllowAce,
      DenyAce: virtualDirectoryDetails.DenyAce
    },
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of postCreateUserVirtualDirectoryApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
