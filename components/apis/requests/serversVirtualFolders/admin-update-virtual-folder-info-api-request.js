/**
* @description
* The updateVirtualDirectoryInfoApiRequest command is update information for an existing virtual folder at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} Path
* @param {required} Id
* @param {required} serverName
* @param {required} ActualPath
* @param {required} newPath
* @param {required} AllowAce
* @param {required} DenyAce
*
* @example
* cy.updateVirtualDirectoryInfoApiRequest(virtualDirectoryDetails, serverDetails)
*/

Cypress.Commands.add('updateVirtualDirectoryInfoApiRequest', (virtualDirectoryDetails, serverDetails) => {
  Cypress.log({
    name: 'updateVirtualDirectoryInfoApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/VirtualFolders/${virtualDirectoryDetails.Id}/Owner/${serverDetails.serverName}`,
    headers: {
      Authorization: `Bearer ${virtualDirectoryDetails.bearerToken}`
    },
    body: {
      Id: virtualDirectoryDetails.Id,
      LinkId: virtualDirectoryDetails.LinkId,
      UserGroupGUID: serverDetails.serverName,
      ActualPath: virtualDirectoryDetails.ActualPath,
      Path: virtualDirectoryDetails.newPath,
      AllowAce: virtualDirectoryDetails.AllowAce,
      DenyAce: virtualDirectoryDetails.DenyAce

    }
  }).then(($response) => {
    console.log('response of updateVirtualDirectoryInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
