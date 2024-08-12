/**
* @description
* The postCreateServerSSHKey command is used to create a new SSH key through API
*
* @parameters
* @param {required} bearerToken
* @param {required} KeyType
* @param {required} keyName
* @param {required} KeyAlg
* @param {required} KeyLen
*
* @example
* cy.postCreateServerSSHKey(opts, serverDetails, keyLen)
*/

Cypress.Commands.add('postCreateServerSSHKey', (opts, serverDetails) => {
  Cypress.log({
    name: 'postCreateServerSSHKey'
  })

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/SshKeys`,
    body: {
      Document: {
        KeyType: opts.KeyType,
        Name: opts.keyName,
        KeyAlg: opts.KeyAlg,
        KeyLen: opts.keyLen
      }
    },
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of postCreateServerSSHKey', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
