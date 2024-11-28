/**
* @description
* The postCreateGroupApiRequest command is used to create a new Group thorough API
*
* @parameters
* @param {required} bearerToken
* @param {required} groupsName
* @param {required} serverName
*
* @example
* cy.postCreateGroupApiRequest({
*   bearerToken: 'bearerTokenValue',
*   GroupName: 'GroupNameValue',
*   serverName: 'serverNameValue'
* })
*/

Cypress.Commands.add('postCreateGroupApiRequest', (opts, serverDetails, groupDirectory = false) => {
  Cypress.log({
    name: 'postCreateGroupApiRequest'
  })
  const requestBody = {
    groupName: opts.groupName
  }

  if (groupDirectory === true && opts.groupHomeDirPath) {
    requestBody.General = {
      GroupHomeDirEnabled: 1,
      GroupHomeDir: opts.groupHomeDirPath
    }
  }

  cy.api({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/AuthConnectors/native/Groups`,
    body: requestBody,
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of postCreateGroupApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
