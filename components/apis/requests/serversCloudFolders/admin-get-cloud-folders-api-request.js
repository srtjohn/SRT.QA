/**
* @description
* The getServerCloudFoldersApiRequest command is used to get the list of Cloud Folders at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.getServerCloudFoldersApiRequest(serverDetails)
*/

Cypress.Commands.add('getServerCloudFoldersApiRequest', (serverDetails) => {
  Cypress.log({
    name: 'getServerCloudFoldersApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/CloudFolders`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerCloudFoldersApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
