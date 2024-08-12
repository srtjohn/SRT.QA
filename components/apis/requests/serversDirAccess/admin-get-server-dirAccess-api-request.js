/**
* @description
* The getServerLevelDirAccessApiRequest command is used to get the list of Directory Access at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getServerLevelDirAccessApiRequest(serverDetails)
*/

Cypress.Commands.add('getServerLevelDirAccessApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServerLevelDirAccessApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/DirAccess`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerLevelDirAccessApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
