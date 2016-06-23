import 'babel-polyfill'
import SyncStorage from './utils/sync-storage'
import ExtensionLoader from './utils/extension-loader'

(async function() {
  let hosts = (await SyncStorage.get({hosts: []})).hosts
  hosts.push('github.com')

  const url = new URL(location.href)
  if (!hosts.includes(url.host)) {
    return
  }

  (new ExtensionLoader).load()
})()
