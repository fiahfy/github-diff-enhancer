import 'babel-polyfill'
import SyncStorage from './sync-storage'
import Loader from './utils/loader'

(async function() {
  let hosts = (await SyncStorage.get({hosts: []})).hosts
  hosts.push('github.com')

  const url = new URL(location.href)
  if (!hosts.includes(url.host)) {
    return
  }

  const container = document.querySelector('#js-repo-pjax-container')
  if (!container) {
    return
  }

  const version = getEnterprizeVersion()

  const loader = new Loader(version)
  loader.load()

  const observer = new MutationObserver(() => {
    loader.load()
  })
  observer.observe(container, {childList: true})

  function getEnterprizeVersion() {
    const icon = document.querySelector('.site-footer .octicon-mark-github')
    const title = icon.getAttribute('title')
    const matches = title.match(/[\d.]+$/)
    return matches ? matches[0] : null
  }
})()
