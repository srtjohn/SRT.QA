/**
* @description
* The postCreateCloudFolderApiRequest command is used to create a cloud folder at server level through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
* @param {required} cloudName
*
* @example
* cy.postCreateCloudFolderApiRequest(serverDetails, cloudFolderDetails)
*/

Cypress.Commands.add('postCreateCloudFolderApiRequest', (serverDetails, cloudFolderDetails) => {
  Cypress.log({
    name: 'postCreateCloudFolderApiRequest'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/CloudFolders`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      cloudName: cloudFolderDetails.cloudName
    }
  }).then(($response) => {
    console.log('response of postCreateCloudFolderApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
