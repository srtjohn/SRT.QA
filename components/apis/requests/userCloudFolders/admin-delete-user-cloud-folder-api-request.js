/**
* @description
* The deleteUserCloudFolderApiRequest command is used to delete a user cloud folder
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} username
* @example
* cy.deleteUserCloudFolderApiRequest(bearerToken, userDetails, cloudFolderDetails)
*/

Cypress.Commands.add('deleteUserCloudFolderApiRequest', (serverDetails, userDetails, cloudFolderDetails) => {
  Cypress.log({
    name: 'deleteUserCloudFolderApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/native/Users/${userDetails.username}/CloudFolders`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: [
      {
        CloudGUID: cloudFolderDetails.cloudGUID
      }
    ]
  }).then(($response) => {
    console.log('response of deleteUserCloudFolderApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
