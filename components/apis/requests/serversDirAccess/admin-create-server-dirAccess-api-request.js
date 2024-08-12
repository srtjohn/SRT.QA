/**
* @description
* The postCreateServerLevelDirAccessApiRequest command is used to create a directory access at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} Path
* @param {required} AllowAce
* @param {required} DenyAce
*
* @example
* cy.postCreateServerLevelDirAccessApiRequest(serverDetails, DirectoryDetails)
*/

Cypress.Commands.add('postCreateServerLevelDirAccessApiRequest', (serverDetails, DirectoryDetails) => {
  Cypress.log({
    name: 'postCreateServerLevelDirAccessApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/DirAccess/server`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      Path: DirectoryDetails.Path,
      AllowAce: DirectoryDetails.AllowAce,
      DenyAce: DirectoryDetails.DenyAce
    }
  }).then(($response) => {
    console.log('response of postCreateServerLevelDirAccessApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
