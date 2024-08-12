/**
* @description
* The getFilteredUserInfoApiRequest command is used to get filtered user information through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} userName
* @param {required} serverName
*
* @example
* cy.getFilteredUserInfoApiRequest(serverDetails, bearerToken)
*/

Cypress.Commands.add('getFilteredUserInfoApiRequest', (serverDetails, opts) => {
  Cypress.log({
    name: 'getFilteredUserInfoApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${serverDetails.serverName}/AuthConnectors/native/Users/${opts.username}/Filtered?byUserName=true`,
    headers: {
      Authorization: `Bearer ${opts.bearerToken}`
    }

  }).then(($response) => {
    console.log('response of getFilteredUserInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
