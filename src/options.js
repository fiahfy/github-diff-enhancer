import 'babel-polyfill'
import SyncStorage from './utils/sync-storage'

(() => {
  render()

  document.querySelector('#add').addEventListener('click', async function() {
    const textField = document.querySelector('#host')
    if (!textField.value.length) {
      return
    }
    let hosts = (await SyncStorage.get({hosts: []})).hosts
    hosts.push(textField.value)
    await SyncStorage.set({'hosts': hosts})
    textField.value = ''
    render()
  }, false)

  async function render() {
    let html = ''

    const hosts = (await SyncStorage.get({hosts: []})).hosts
    for (let host of hosts) {
      html += `
        <div>
          <span>${host}</span>
          <input type="button" value="Delete" class="delete" />
        </div>
      `
    }
    document.querySelector('#hosts').innerHTML = html
    const buttons = document.querySelectorAll('.delete')
    for (let button of buttons) {
      button.addEventListener('click', async function() {
        const target = button.previousSibling.previousSibling.innerText
        let hosts = (await SyncStorage.get({hosts: []})).hosts
        hosts = hosts.filter(host => host !== target)
        await SyncStorage.set({'hosts': hosts})
        render()
      }, false)
    }
  }
})()
