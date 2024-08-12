/**
* @description
* The getUserCloudFoldersApiRequest command is used to get the list of Cloud Folders at user level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} userName
* @param {required} serverName
*
* @example
* cy.getUserCloudFoldersApiRequest(serverDetails)
*/

Cypress.Commands.add('getUserCloudFoldersApiRequest', (serverDetails, userDetails) => {
  Cypress.log({
    name: 'getUserCloudFoldersApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/native/Users/${userDetails.username}/CloudFolders`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getUserCloudFoldersApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
