import label from '../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../selectors/dashboard-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can select languages
 *
 * @file
 * cypress/e2e/admin/server/language/admin-select-language-acceptance.cy.js
 *
 * @breadcrumb
 * Login > select language
 *
 * @assertions
 * To verify that admin can select english language
 * To verify that admin can select spanish language
 * To verify that admin can select deutsch language
 * To verify that admin can select japanese language
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - admin user should have valid credentials
 */

describe('Login > select language', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.englishLang).click()
  })

  it('verify that admin can select english language', () => {
    cy.selectLanguage(label.englishLang)
    cy.checkTextVisibility(dashboardSelectors.dashboardButtonLabel, label.helpEnglish)
  })

  it('verify that admin can select spanish language', () => {
    cy.selectLanguage(label.spanishLang)
    cy.checkTextVisibility(dashboardSelectors.dashboardButtonLabel, label.helpSpanish)
  })

  it('verify that admin can select deutsch language', () => {
    cy.selectLanguage(label.deutschLang)
    cy.checkTextVisibility(dashboardSelectors.dashboardButtonLabel, label.helpDeutsch)
  })

  it('verify that admin can select japanese language', () => {
    cy.selectLanguage(label.japaneseLang)
    cy.checkTextVisibility(dashboardSelectors.dashboardButtonLabel, label.helpJapanese)
  })
})
