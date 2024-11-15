/**
* @description
* The updateIPBanListApiRequest command is used to update the list of banned IPs through Api
*
* @parameters
* @param {required} bearerToken
* @param {required} serverName
*
* @example
* cy.updateIPBanListApiRequest(bearerToken)
*/

Cypress.Commands.add('updateIPBanListApiRequest', (serverDetails, IpToBan) => {
  Cypress.log({
    name: 'updateIPBanListApiRequest'
  })

  cy.api({
    method: 'PATCH',
    url: `${Cypress.env('apiBaseUrl')}/api/IPBans/${serverDetails.serverName}`,
    headers: {
      Authorization: `Bearer ${serverDetails.bearerToken}`
    },
    body: {
      IPBans: [
        {
          ServerGUID: serverDetails.serverGUID,
          UserGroupGUID: serverDetails.serverGUID,
          IpAddress: IpToBan,
          StartTimeUTC: 0,
          EndTimeUTC: 0
        }
      ]
    }
  }).then(($response) => {
    console.log('response of updateIPBanListApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
