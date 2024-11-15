/**
* @description
* The getDomainFilteredSettingsApiRequest command is used to get the domain filtered settings through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} domainGUID
*
* @example
* cy.getDomainFilteredSettingsApiRequest(bearerToken, domainGUID)
*/

Cypress.Commands.add('getDomainFilteredSettingsApiRequest', (token, domainGUID) => {
  Cypress.log({
    name: 'getDomainFilteredSettingsApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Domain/${domainGUID}/Filtered`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(($response) => {
    console.log('response of getDomainFilteredSettingsApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
