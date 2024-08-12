/**
* @description
* The updateGroupInfoApiRequest command is used to update information for an existing group through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} GroupGUID
* @param {required} AuthGUID
* @param {required} updatedGroupName
* @param {required} serverName
*
* @example
* cy.updateGroupInfoApiRequest(groupDetails, serverDetails)
*/

Cypress.Commands.add('updateGroupInfoApiRequest', (groupDetails, serverDetails) => {
  Cypress.log({
    name: 'updateGroupInfoApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/servers/${serverDetails.serverName}/AuthConnectors/native/Groups/${groupDetails.GroupGUID}`,
    headers: {
      Authorization: `Bearer ${groupDetails.bearerToken}`
    },
    body: {
      AuthGUID: groupDetails.AuthGUID,
      GroupName: groupDetails.updatedGroupName,
      GeneralParams: {
        GroupDesc: '',
        GroupHomeDirEnabled: 0,
        GroupHomeDir: ''
      },
      MemberUsers: {}
    }
  }).then(($response) => {
    console.log('response of updateGroupInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
