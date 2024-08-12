/**
* @description
* The getUserQuotaInfoApiRequest command is used to get quota information about users through API
*
* @parameters
* @param {required} bearerToken
* @param {required} username
* @param {required} serverName
*
* @example
* cy.getUserQuotaInfoApiRequest(userDetails)
*/

Cypress.Commands.add('getUserQuotaInfoApiRequest', (userDetails) => {
  Cypress.log({
    name: 'getUserQuotaInfoApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/${userDetails.serverName}/AuthConnectors/native/Users/${userDetails.username}/QuotaInfo?byUserName=true`,
    headers: {
      Authorization: `Bearer ${userDetails.bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getUserQuotaInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
