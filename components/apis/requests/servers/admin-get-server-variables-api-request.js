/**
* @description
* The getServerLevelVariablesApiRequest command is used to get the list of variables at server level through Api
* @parameters
* @param {required} bearerToken
*
* @example
* cy.getServerLevelVariablesApiRequest(bearerToken)
*/

Cypress.Commands.add('getServerLevelVariablesApiRequest', (bearerToken) => {
  Cypress.log({
    name: 'getServerLevelVariablesApiRequest'
  })

  cy.api({
    method: 'GET',
    url: `${Cypress.env('apiBaseUrl')}/api/Servers/Vars?level=server`,
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  }).then(($response) => {
    console.log('response of getServerLevelVariablesApiRequest', $response)
    expect($response.status).to.eq(200)
    return $response.body
  })
})
