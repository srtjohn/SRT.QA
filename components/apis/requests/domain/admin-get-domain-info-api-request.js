/**
* @description
* The getDomainInfoApiRequest command is used to get the domain information through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} domainGUID
*
* @example
* cy.getDomainInfoApiRequest(bearerToken, domainGUID)
*/

Cypress.Commands.add('getDomainInfoApiRequest', (token, domainGUID) => {
  Cypress.log({
    name: 'getDomainInfoApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Domain/${domainGUID}/info`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(($response) => {
    console.log('response of getDomainInfoApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
