/**
* @description
* The postCreateServerLevelVirtualDirectoryApiRequest command is used to create a server level virtual directory through API
*
* @parameters
* @param {required} bearerToken
* @param {required} ActualPath
* @param {required} Path
* @param {required} AllowAce
* @param {required} DenyAce
*
* @example
* cy.postCreateServerLevelVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails)
*/

Cypress.Commands.add('postCreateServerLevelVirtualDirectoryApiRequest', (virtualDirectoryDetails, serverDetails) => {
  Cypress.log({
    name: 'postCreateServerLevelVirtualDirectoryApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/VirtualFolders/${serverDetails.serverName}`,
    body: {
      ActualPath: virtualDirectoryDetails.ActualPath,
      Path: virtualDirectoryDetails.Path,
      AllowAce: virtualDirectoryDetails.AllowAce,
      DenyAce: virtualDirectoryDetails.DenyAce
    },
    headers: {
      Authorization: `Bearer ${virtualDirectoryDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of postCreateServerLevelVirtualDirectoryApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
