/**
* @description
* The deleteGroupApiRequest command is used to delete a Group through API
*
* @parameters
* @param {required} bearerToken
* @param {required} groupName
* @param {required} serverName
*
* @example
* cy.deleteGroupApiRequest({
*   bearerToken: 'bearerTokenValue',
*   GroupName: 'groupNameValue',
*   serverName: 'serverNameValue'
* })
*/

Cypress.Commands.add('deleteGroupApiRequest', (opts, serverDetails) => {
  Cypress.log({
    name: 'deleteGroupApiRequest'
  })

  cy.api({
    method: 'DELETE',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/AuthConnectors/native/Groups/${opts.groupName}`,
    body: {
      groupName: opts.groupName
    },
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of deleteGroupApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
