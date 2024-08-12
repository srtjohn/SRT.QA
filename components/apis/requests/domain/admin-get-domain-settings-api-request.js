/**
* @description
* The getDomainSettingsApiRequest command is used to get the domain settings through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} domainGUID
*
* @example
* cy.getDomainSettingsApiRequest(bearerToken, domainGUID)
*/

Cypress.Commands.add('getDomainSettingsApiRequest', (token, domainGUID) => {
  Cypress.log({
    name: 'getDomainSettingsApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Domain/${domainGUID}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(($response) => {
    console.log('response of getDomainSettingsApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
