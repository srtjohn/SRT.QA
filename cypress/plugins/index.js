/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */
const { verifyDownloadTasks } = require('cy-verify-downloads')
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin')
// const { verifyDownloadTasks } = require('cy-verify-downloads')
const Client = require('ssh2-sftp-client')
const sftp = new Client()

module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  /**
   * Details on how to use downloadFile plugin
  */

  on('task', { downloadFile })

  on('task', verifyDownloadTasks)

  // sftp connection task to end the connection
  on('task', {
    endSFTPConnection () {
      return sftp.end()
    }
  })

  // sftp connection task which will return current remote working directory using cwd() command
  on('task', {
    sftpCurrentWorkingDirectory (configSFTP) {
      return sftp.connect(configSFTP)
        .then(() => {
          return sftp.cwd()
        })
    }
  })

  // sftp connection task which will create new directory using mkdir()
  on('task', {
    // ... other tasks ...
    sftpCreateDirectory (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => sftp.exists(opts.remoteDir))
        .then((exists) => {
          if (exists) {
            return 'directory exists' // Add this
          }
          return sftp.mkdir(opts.remoteDir, true).then(() => `${opts.remoteDir} directory created`)
        })
        .finally(() => sftp.end())
    }
    // ... other tasks ...
  })

  // sftp connection task which will remove directory using rmdir()
  on('task', {
    sftpDeleteDirectory (opts) { // Add this
      return sftp.connect(opts.configSFTP)
        .then(() => sftp.rmdir(opts.remoteDir, true))
        .then(() => `Successfully deleted ${opts.remoteDir}`)
        .finally(() => sftp.end())
    }
  })

  on('task', {
    sftpRemoveDirectory (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.rmdir(opts.remoteDirPath, true)
        })
    }
  })
  // sftp connection task which will put data stream to remote location using fastPut() command
  on('task', {
    sftpUploadFile (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.fastPut(opts.localPath, opts.remoteDirFile, true)
        })
    }
  })
  // sftp connection task which will upload directory from remote location using fastGet() command
  on('task', {
    sftpUploadDirectory (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => sftp.uploadDir(opts.localPath, opts.remoteDirFile, true))
    }
  })

  // sftp connection task which will download file from  remote location using fastGet() command
  on('task', {
    sftpDownLoadFile (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.fastGet(opts.newRemoteDir, opts.localPath2, true)
        })
    }
  })

  // sftp connection task which will rename the remote server file or directory using rename command
  on('task', {
    sftpRenameFile (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.rename(opts.remoteDirFile, opts.newRemoteDir)
        })
    }
  })

  // sftp connection task which will upload directory
  on('task', {
    sftpUploadDirectory (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.uploadDir(opts.localPath, opts.remoteDirFile, true)
        })
    }
  })

  // sftp connection task which will download directory
  on('task', {
    sftpDownloadDirectory (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.downloadDir(opts.remoteDir, opts.localPathForDownload, true)
        })
    }
  })

  // sftp connection task which read write text to file on server using put() command
  on('task', {
    sftpEditFile (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.put(Buffer.from(' Text to add in the file'), opts.remoteDirFile, {
            writeStreamOptions: {
              flags: 'a', // w - write and a - append
              encoding: 'utf-8', // use null for binary files
              mode: 0o666 // mode to use for created file (rwx)
            }
          })
        })
    }
  })
  // sftp connection task which copy file on remote server using rcopy()
  on('task', {
    sftpCopyFile (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.rcopy(opts.newRemoteDir, opts.remoteDirCopy)
        })
    }
  })

  // sftp connection task which deletes file on server using delete command
  on('task', {
    sftpDeleteFile (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.delete(opts.newRemoteDir)
        })
    }
  })

  // sftp connection boolean task which check whether directory or file exist (returns d for directory and f for file)
  on('task', {
    sftpDirectoryExist (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.exists(opts.remoteFile)
        })
    }
  })

  // sftp command is used to change permission(read, write, execute) for a file or directory
  on('task', {
    sftpChmod (opts) {
      return sftp.connect(opts.configSFTP)
        .then(() => {
          return sftp.chmod(opts.remoteFile, '0o644')
        })
    }
  })
}
