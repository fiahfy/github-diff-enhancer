class SyncStorage {
  get(args) {
    return new Promise(resolve => {
      chrome.storage.sync.get(args, result => {
          resolve(result)
      })
    })
  }
  set(args) {
    return new Promise(resolve => {
      chrome.storage.sync.set(args, () => {
        resolve()
      })
    })
  }
}

export default new SyncStorage
