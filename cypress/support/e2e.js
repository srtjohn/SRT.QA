// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

/** SUPPORT COMMANDS */
// Import commands.js using ES2015 syntax:
import 'cypress-network-idle'
import 'cypress-file-upload'
import 'cypress-wait-until'

// Alternatively you can use CommonJS syntax:
// require('./commands')

/** API INTERCEPT COMMANDS */
import '../../components/apis/login/login-api-post'
import '../../components/apis/wait-api-response-status-code'

/** UI COMPONENT COMMANDS */
import '../../components/ui/login/login-command'
import '../../components/ui/users/create-user-command'
import '../../components/ui/users/edit-user-command'
import '../../components/ui/Groups/create-group-command'
import '../../components/ui/utils-Commands/utils-Commands'
import '../../components/ui/server/create-server-command'
import '../../components/ui/server/add-server-key-command'
import '../../components/ui/server/delete-server-command'
import '../../components/ui/users/create-virtual-directory-command'
import '../../components/ui/users/delete-virtual-directory-command'
import '../../components/ui/events/add-event-command'
import '../../components/ui/events/add-action-command'
import '../../components/ui/events/delete-event-command'
import './commands'

/** API REQUESTS COMMANDS */

/** Authentication */
import '../../components/apis/requests/Authentication/post-authenticate-login-api-request'
import '../../components/apis/requests/Authentication/post-authenticate-logout-api-request'
import '../../components/apis/requests/Authentication/post-user-login-api-request'

/** servers */
import '../../components/apis/requests/servers/admin-get-server-list-api-request'
import '../../components/apis/requests/servers/admin-delete-server-api-request'
import '../../components/apis/requests/servers/admin-get-server-state-api-request'
import '../../components/apis/requests/servers/admin-create-server-api-request'
import '../../components/apis/requests/servers/admin-get-server-variables-api-request'

/** ipBans */
import '../../components/apis/requests/ipBans/admin-get-server-ipBan-list-api-request'

/** licenses */
import '../../components/apis/requests/Licenses/admin-get-licenses-api-request'
import '../../components/apis/requests/Licenses/admin-get-license-entitlements-api-request'

/** groups */
import '../../components/apis/requests/groups/admin-create-groups-api-request'
import '../../components/apis/requests/groups/admin-delete-groups-api-request'
import '../../components/apis/requests/groups/admin-get-group-info-api-request'
import '../../components/apis/requests/groups/admin-update-group-information-api-request'
import '../../components/apis/requests/groups/admin-get-groups-list-api-request'
import '../../components/apis/requests/groups/admin-get-filtered-group-info-api-request'

/** domain */
import '../../components/apis/requests/domain/admin-get-domain-info-api-request'
import '../../components/apis/requests/domain/admin-get-domain-list-api-request'
import '../../components/apis/requests/domain/admin-get-domain-settings-api-request'

/** sessions */
import '../../components/apis/requests/sessions/admin-get-server-sessions-list-api-request'

/** users */
import '../../components/apis/requests/users/get-list-user-api-request'
import '../../components/apis/requests/users/post-create-user-api-request'
import '../../components/apis/requests/users/update-user-information-api-request'
import '../../components/apis/requests/users/delete-user-api-request'
import '../../components/apis/requests/users/get-user-info-api-request'
import '../../components/apis/requests/users/get-user-filtered-information-api-request'
import '../../components/apis/requests/users/get-user-quota-info-api-request'

/** serversCloudFolders */
import '../../components/apis/requests/serverAuthConnectors/admin-create-server-authconnector-api-request'
import '../../components/apis/requests/serverAuthConnectors/admin-delete-server-authconnector-api-request'

/** serversCloudFolders */
import '../../components/apis/requests/serversCloudFolders/admin-create-cloud-folders-api-request'
import '../../components/apis/requests/serversCloudFolders/admin-get-cloud-folders-api-request'
import '../../components/apis/requests/serversCloudFolders/admin-delete-cloud-folder-api-request'
import '../../components/apis/requests/serversCloudFolders/admin-update-cloud-folder-settings-api-request'

// serversDirAccess */
import '../../components/apis/requests/serversDirAccess/admin-create-server-dirAccess-api-request'
import '../../components/apis/requests/serversDirAccess/admin-get-server-dirAccess-api-request'
import '../../components/apis/requests/serversDirAccess/admin-delete-server-dirAccess-api-request'

/** serversPgpKeys */
import '../../components/apis/requests/serversPgpKeys/admin-get-server-pgp-key-list-api-request'
import '../../components/apis/requests/serversPgpKeys/admin-create-server-pgp-key-api-request'
import '../../components/apis/requests/serversPgpKeys/admin-update-server-pgp-key-api-request'
import '../../components/apis/requests/serversPgpKeys/admin-delete-server-pgp-key-api-request'

/** serversVirtualFolders */
import '../../components/apis/requests/serversVirtualFolders/admin-get-server-level-virtual-directories-api-request'
import '../../components/apis/requests/serversVirtualFolders/admin-get-user-level-virtual-directories-api-request'
import '../../components/apis/requests/serversVirtualFolders/admin-create-user-level-virtual-directory-api-request'
import '../../components/apis/requests/serversVirtualFolders/admin-create-server-level-virtual-directory-api-request'
import '../../components/apis/requests/serversVirtualFolders/admin-update-virtual-folder-info-api-request'
import '../../components/apis/requests/serversVirtualFolders/admin-delete-user-virtual-directory-api-request'
import '../../components/apis/requests/serversVirtualFolders/admin-delete-updated-virtual-directory-api-request'

/** serverEvents */
import '../../components/apis/requests/serversEvents/admin-get-server-events-list-api-request'
import '../../components/apis/requests/serversEvents/admin-update-server-event-handler-api-request'
import '../../components/apis/requests/serversEvents/admin-create-server-event-handlers-api-request'

/** serverNoes */
import '../../components/apis/requests/serversNodes/admin-get-server-node-list-api-request'
import '../../components/apis/requests/serversNodes/admin-get-server-node-settings-api-request'
import '../../components/apis/requests/serversNodes/admin-update-server-node-api-request'
import '../../components/apis/requests/serversNodes/admin-delete-server-node-api-request'
import '../../components/apis/requests/serversNodes/admin-create-server-node-api-request'

/** serversReports */
import '../../components/apis/requests/serversReports/admin-create-server-report-api-request'
import '../../components/apis/requests/serversReports/admin-delete-server-report-api-request'

/** serversSshKeys */
import '../../components/apis/requests/serversSshKeys/admin-create-server-ssh-key-api-request'
import '../../components/apis/requests/serversSshKeys/admin-delete-server-ssh-key-api-request'

/** userCloudFolders */
import '../../components/apis/requests/userCloudFolders/admin-get-user-cloud-folder-api-request'
import '../../components/apis/requests/userCloudFolders/admin-delete-user-cloud-folder-api-request'

/** sftpOperations */
import '../../components/apis/run-all-sftp-operations-api-request'

/* Importing the cypress-iframe plugin. */
import 'cypress-iframe'

const dayjs = require('dayjs')

Cypress.dayjs = dayjs

require('cy-verify-downloads').addCustomCommand()

require('cypress-plugin-api')
const filePath = '../fixtures/1GB.txt'
before(() => {
  cy.task('createFile').then(($resp) => {
    cy.log($resp)
    expect($resp).to.contain(filePath)
  })
})
