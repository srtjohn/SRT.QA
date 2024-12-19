import serverSelectors from '../../../selectors/server-selectors.json'
import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import label from '../../../cypress/fixtures/label.json'
/**
 * Server Creation Command
 *
 * This command is used to create a server
 *
 * This command takes server details as a parameter, (serverName, serverType and serverDatabase are required parameters)
 *
 * @location
 * Login > Add New
 *
 * @params
 * @param {required} serverType    // A variable containing the server type to select
 * @param {required} serverDatabase   // An variable containing the type of database
 * @param {required} serverName  // A variable containing server name and information
 * @param serverDescription // An variable containing server description
 * @param startServerAutomatically // A boolean value to check whether the server start automatically or not
 * @param enableManualConfiguration  // A boolean value to check to manually configure directory locations
 * @param serverBackupDirectory // A variable containing the backup directory
 * @param serverDatabaseCacheDirectory // A variable containing the database cache directory
 * @param reportsDirectory // A variable containing the reports directory
 * @param temporaryCacheDirectory // A variable containing the temporary cache directory
 * @param quickSendCacheDirectory // A variable containing the quick send cache directory
 * @param quarantineDirectory // A variable containing the quarantine directory
 * @param isFTP // A boolean value to allow FTP service
 * @param isFTPS // A boolean value to allow FTPS service
 * @param isSSH // A boolean value to allow SSH service
 * @param isHTTP // A boolean value to allow HTTP service
 * @param isWEBDAV // A boolean value to allow WebDAV service
 * @param enableFTP // A boolean value to enable FTP services
 * @param FTPIp // A variable to select IP address
 * @param FTPPort // A variable to select port number
 * @param FTPFirewallCheck //A boolean value to check if a firewall is enabled
 * @param enableExplicitFTPS // A boolean value to enable  Explicit FTPS services
 * @param enableImplicitFTPS // A boolean value to enable Implicit FTPS services
 * @param TLSVersion // A variable to select TLS version
 * @param enableFIPS // A boolean value to enable FIPS Compilance
 * @param enableCertificates // A boolean value to enable Certificate
 * @param enableSFTP // A boolean value to enable SFTP
 * @param selectSFTPVersion // A variable to select SFTP version
 * @param SFTPIp // A variable to select SFTP IP
 * @param SFTPPort // A variable to select SFTP port
 * @param enableFIPSForSFTP // A boolean value to enable FIPS for SFTP
 * @param kickUser // A boolean value to kick user in SFTP configuration
 * @param enableHTTP // A boolean value to enable HTTP Browser interface
 * @param HTTPIp // A variable to select HTTP IP
 * @param HTTPPort // A variable to select HTTP port
 * @param enableHTTPS // A boolean value to enable HTTPS
 * @param HTTPSIp // A variable to select HTTPS IP
 * @param HTTPSPort // A variable to select HTTPS port
 * @param enableFIPSForHTTPS // A boolean value to enable FIPS for HTTPS
 * @param enableCertificatesForHTTPS // A boolean value to enable certificates for HTTPS
 * @param enableWEBDAV // A boolean value to enable webDAV service
 * @param WEBDAVIp // A variable to select webDAV IP
 * @param WEBDAVPort // A variable to select webDAV port
 * @param enableWEBDAVS // A boolean value to enable WEBDAVS
 * @param WEBDAVSIp // A variable to select WEBDAVS IP
 * @param WEBDAVSPort // A variable to select WEBDAVS port
 * @param enableFIPSForWEBDAVS // A boolean value to enable FIPS for WEBDAVS
 * @param SMTPServerName // A variable containing SMTP server hostname or IP
 * @param SMTPPort // A variable containing SMTP port
 * @param serverUsername // A variable containing server username
 * @param serverPassword // A variable containing server password
 * @param defaultFromAddress // A variable containing default from address
 * @param enableSecureConnection // A boolean value to enable secure connection
 * @param SMSEndpoint // A variable containing the SMS endpoint
 * @param SMSAccessKey // A variable containing the SMS Access Key
 * @param SMSPhoneNumber // A variable containing the SMS phone number
 *
 * @example
 * cy.createServer(serverDetails)
 */
Cypress.Commands.add('createServer', (serverDetails) => {
  Cypress.log({
    name: 'createServerCommand'
  })
  // cy.get(generalSelectors.textSelector).contains(label.autoDomainName).click()
  // cy.waitForNetworkIdle(3000, { log: false })

  cy.get(serverSelectors.titleAddNew).first().click()
  cy.get(serverSelectors.serviceCheckboxContainer).contains(serverDetails.serverType).prev().within(() => {
    cy.get(htmlTagSelectors.input).realClick()
  })
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(generalSelectors.button).contains(label.next).realClick()
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(serverSelectors.serverTypeDropdown).realClick()
  cy.get(serverSelectors.listbox).eq(3).within(() => {
    cy.get(htmlTagSelectors.li).contains(serverDetails.selectDatabase).realClick()
  })
  cy.get(generalSelectors.button).contains(label.next).realClick()
  cy.get(generalSelectors.textSelector).contains(label.serverNameText).next(htmlTagSelectors.div).type(serverDetails.serverName)
  cy.contains(htmlTagSelectors.label, label.StartServerAutomatically)
    .prev(htmlTagSelectors.div).realClick()
  cy.get(generalSelectors.button).contains(label.next).realClick()
  cy.get(generalSelectors.button).contains(label.next).realClick()
  cy.get(generalSelectors.button).contains(label.finish).realClick()
})
