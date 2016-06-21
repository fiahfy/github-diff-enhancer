export default class ExtensionLoader {
  constructor() {
    const version = this.detectVersion()
    if (version === '2.2.6') {
      this.module = new ModuleV2_2_6()
      return
    }
    this.module = new Module()
  }
  detectVersion() {
    const icon = document.querySelector('.site-footer .octicon-mark-github')
    const title = icon.getAttribute('title') || ''
    const matches = title.match(/[\d.]+$/)
    return matches ? matches[0] : null
  }
  load() {
      this.proceed()

      this.module.observe(() => {
        this.proceed()
      })
  }
  proceed() {
    const url = new URL(location.href)
    const match = url.pathname.match(/^\/[^\/]+\/[^\/]+\/pull\/\d+\/files/)
    if (!match) {
      return
    }
    this.module.proceed()
  }
}

class Module {
  observe(callback) {
    const container = document.querySelector('#js-repo-pjax-container')
    if (!container) {
      return
    }

    const observer = new MutationObserver(callback)
    observer.observe(container, {childList: true})
  }
  proceed() {
    this.attachDropdown()
    this.attachLineLinks()
  }
  attachDropdown() {
    const isAttached = !!document.querySelector('#github-diff-enhancer-dropdown')
    if (isAttached) {
      return
    }

    const options = [
      {w: false, title: 'Default'},
      {w: true,  title: 'Whitespace ignored'}
    ]

    const optionsHtml = options.map(option => {
      const url = new URL(location.href)
      let appendedClass = ''
      let checkIcon = ''

      const selected = option.w === url.searchParams.has('w')
      if (selected) {
        appendedClass = ' selected'
        checkIcon = `
          <svg class="octicon octicon-check" height="16" viewBox="0 0 12 16" width="12">
            <path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path>
          </svg>
        `
      }

      if (option.w) {
        url.searchParams.set('w', 1)
      } else {
        url.searchParams.delete('w')
      }
      const href = url.toString()

      return `
        <a class="dropdown-item${appendedClass}" href="${href}">
          ${checkIcon}
          ${option.title}
        </a>
      `
    }).join('')

    const html = `
      <div class="diffbar-item dropdown js-menu-container" id="github-diff-enhancer-dropdown">
        <button class="btn-link muted-link js-menu-target">
          Ignore options
          <span class="dropdown-caret"></span>
        </button>
        <div class="dropdown-menu-content diff-options-content js-menu-content">
          <ul class="dropdown-menu dropdown-menu-sw">
            <div class="dropdown-header">
              View options
            </div>
            ${optionsHtml}
          </ul>
        </div>
      </div>
    `
    const wrapper = document.querySelector('#files_bucket>div>div>div.right')
    wrapper.innerHTML += html
  }
  attachLineLinks() {
    const url = new URL(location.href)
    const isAvailable = url.searchParams.has('w')
    if (!isAvailable) {
      return
    }

    url.searchParams.delete('w')
    const baseUrl = url.toString()

    const tds = document.querySelectorAll('#files_bucket table.diff-table>tbody>tr>td.blob-code')
    tds.forEach(td => {
      if (!td.classList.contains('blob-code-context')
        && !td.classList.contains('blob-code-addition')
        && !td.classList.contains('blob-code-deletion')) {
        return
      }
      const isAttached = td.querySelector('.add-line-comment')
      if (!isAttached) {
        td.innerHTML = `
          <span class="add-line-comment" role="button">
            <svg class="octicon octicon-plus" height="16" viewBox="0 0 12 16" width="12">
              <path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
            </svg>
          </span>
          ${td.innerHTML}
        `
      }
      td.querySelector('.add-line-comment').addEventListener('click', () => {
        const id = td.previousSibling.previousSibling.id
        window.open(`${baseUrl}#${id}`)
      }, false)
    })
  }
}

class ModuleV2_2_6 {
  observe(callback) {
    const container = document.querySelector('#js-repo-pjax-container')
    if (!container) {
      return
    }
    console.log('load')

    const observer = new MutationObserver(callback)
    observer.observe(container, {childList: true})
    observer.observe(container.querySelector('#discussion_bucket'), {attributes: true})
  }
  proceed() {
    this.attachDropdown()
    this.attachLineLinks()
  }
  attachDropdown() {
    const isAttached = !!document.querySelector('#github-diff-enhancer-switch')
    if (isAttached) {
      return
    }

    const options = [
      {w: false, title: 'Default'},
      {w: true,  title: 'Whitespace ignored'}
    ]

    const optionsHtml = options.map(option => {
      const url = new URL(location.href)
      let appendedClass = ''

      const selected = option.w === url.searchParams.has('w')
      if (selected) {
        appendedClass = ' selected'
      }

      if (option.w) {
        url.searchParams.set('w', 1)
      } else {
        url.searchParams.delete('w')
      }
      const href = url.toString()

      return `
        <a class="btn btn-sm${appendedClass}" href="${href}">
          ${option.title}
        </a>
      `
    }).join('')

    const html = `
      <div class="btn-group right" style="margin-left: 10px;" id="github-diff-enhancer-switch">
        ${optionsHtml}
      </div>
    `
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html

    const mark = document.querySelector('#files_bucket>div#diff>div#toc>div.right')
    mark.parentNode.insertBefore(wrapper, mark)
  }
  attachLineLinks() {
    const url = new URL(location.href)
    const isAvailable = url.searchParams.has('w')
    if (!isAvailable) {
      return
    }

    url.searchParams.delete('w')
    const baseUrl = url.toString()

    const tds = document.querySelectorAll('#files_bucket table.diff-table>tbody>tr>td.blob-code')
    tds.forEach(td => {
      if (!td.classList.contains('blob-code-context')
        && !td.classList.contains('blob-code-addition')
        && !td.classList.contains('blob-code-deletion')) {
        return
      }
      const isAttached = td.querySelector('.add-line-comment')
      if (!isAttached) {
        td.innerHTML = `<b class="add-line-comment octicon octicon-plus" role="button"></b>${td.innerHTML}`
      }
      td.querySelector('.add-line-comment').addEventListener('click', () => {
        const id = td.previousSibling.previousSibling.id
        window.open(`${baseUrl}#${id}`)
      }, false)
    })
  }
}
