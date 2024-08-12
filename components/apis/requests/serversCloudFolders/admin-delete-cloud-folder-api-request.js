/**
* @description
* The deleteCloudFolderApiRequest command is used to delete a server through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} bearerToken
*
* @example
* cy.deleteCloudFolderApiRequest(serverDetails, cloudFolderDetails)
*/

Cypress.Commands.add('deleteCloudFolderApiRequest', (serverDetails, cloudFolderDetails) => {
  Cypress.log({
    name: 'deleteCloudFolderApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/CloudFolders`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      cloudName: cloudFolderDetails.cloudName
    }
  }).then(($response) => {
    console.log('response of deleteCloudFolderApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
