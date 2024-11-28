/**
* @description
* The getDomainIpAddressListApiRequest command is used to get the domain ip address list through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} domainGUID
*
* @example
* cy.getDomainIpAddressListApiRequest(bearerToken, domainGUID)
*/

Cypress.Commands.add('getDomainIpAddressListApiRequest', (token, domainGUID) => {
  Cypress.log({
    name: 'getDomainIpAddressListApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Domain/${domainGUID}/IpAddressList`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(($response) => {
    console.log('response of getDomainIpAddressListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
