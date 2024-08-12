/**
* @description
* The getLicensesApiRequest command is used to get licenses and registration codes
*
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getLicensesApiRequest(bearerToken)
*/

Cypress.Commands.add('getLicensesApiRequest', (bearerToken) => {
  Cypress.log({
    name: 'getLicensesApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Licenses`,
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getLicensesApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
