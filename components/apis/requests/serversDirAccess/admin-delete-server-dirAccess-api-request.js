/**
* @description
* The deleteServerLevelDirAccessApiRequest command is used to delete a directory access through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} DirectoryId
* @example
* cy.deleteServerLevelDirAccessApiRequest(serverDetails, DirectoryDetails)
*/

Cypress.Commands.add('deleteServerLevelDirAccessApiRequest', (serverDetails, DirectoryDetails) => {
  Cypress.log({
    name: 'deleteServerLevelDirAccessApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/DirAccess/${DirectoryDetails.DirectoryId}/Owner/server`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteServerLevelDirAccessApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
