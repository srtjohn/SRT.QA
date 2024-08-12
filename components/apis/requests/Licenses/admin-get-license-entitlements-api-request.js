/**
* @description
* The getLicenseEntitlementsApiRequest command is used to get license entitlements
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getLicenseEntitlementsApiRequest(bearerToken)
*/

Cypress.Commands.add('getLicenseEntitlementsApiRequest', (bearerToken) => {
  Cypress.log({
    name: 'getLicenseEntitlementsApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Licenses/Entitlements`,
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getLicenseEntitlementsApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
