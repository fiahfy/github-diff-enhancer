(function() {
  var attachDropdown = function() {
    var element = document.querySelector('#github-diff-enhancer-dropdown');
    if (element) {
      return;
    }

    var options = [
      {
        w: false,
        title: 'Default'
      },
      {
        w: true,
        title: 'Whitespace ignored'
      }
    ];

    var optionsHtml = options.map(function(option) {
      var url = new URL(location.href);
      var appendedClass = '';
      var checkIcon = '';

      var selected = option.w === url.searchParams.has('w');
      if (selected) {
        appendedClass = ' selected';
        checkIcon = ''
          + '<svg aria-hidden="true" class="octicon octicon-check" height="16" version="1.1" viewBox="0 0 12 16" width="12">'
          + '  <path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path>'
          + '</svg>';
      }

      if (option.w) {
        url.searchParams.set('w', 1);
      } else {
        url.searchParams.delete('w');
      }

      // build url
      var search = url.searchParams.toString();
      if (search) {
        search = '?' + search;
      }
      var href = url.origin + url.pathname + search;

      return ''
        + '<a class="dropdown-item' + appendedClass + '" href="' + href + '">'
        + checkIcon
        + '  ' + option.title
        + '</a>';
    }).join('')

    var html = ''
      + '<div class="diffbar-item dropdown js-menu-container" id="github-diff-enhancer-dropdown">'
      + '  <button class="btn-link muted-link js-menu-target">'
      + '    Ignore options'
      + '    <span class="dropdown-caret"></span>'
      + '  </button>'
      + '  <div class="dropdown-menu-content diff-options-content js-menu-content">'
      + '    <ul class="dropdown-menu dropdown-menu-sw">'
      + '      <div class="dropdown-header">'
      + '        View options'
      + '      </div>'
      + optionsHtml
      + '    </ul>'
      + '  </div>'
      + '</div>';

    var wrapper = document.querySelector('#files_bucket>div>div>div.right');
    wrapper.innerHTML += html;
  };

  var attachLineLinks = function() {
    var url = new URL(location.href);
    var isAvailable = url.searchParams.has('w');
    if (!isAvailable) {
      return;
    }

    url.searchParams.delete('w');
    var search = url.searchParams.toString();
    if (search) {
      search = '?' + search;
    }
    var baseUrl = url.origin + url.pathname + search;

    var tds = document.querySelectorAll('#files_bucket table.diff-table>tbody>tr>td.blob-code');
    [].forEach.call(tds, function(td) {
      var classes = (td.getAttribute('class') || '').split(' ')
      if (classes.indexOf('blob-code-context') == -1
        && classes.indexOf('blob-code-addition') == -1
        && classes.indexOf('blob-code-deletion') == -1) {
        return;
      }
      td.innerHTML = ''
        + '<span class="add-line-comment" role="button">'
        + '  <svg aria-hidden="true" class="octicon octicon-plus" height="16" version="1.1" viewBox="0 0 12 16" width="12">'
        + '    <path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>'
        + '  </svg>'
        + '</span>'
        + td.innerHTML;
      td.querySelector('span').addEventListener('click', function() {
        var id = td.previousSibling.previousSibling.getAttribute('id');
        window.open(baseUrl + '#' + id);
      }, false);
    });
  };

  var load = function() {
    var url = new URL(location.href);
    var match = url.pathname.match(/^\/[^\/]+\/[^\/]+\/pull\/\d+\/files/);
    if (!match) {
      return;
    }

    attachDropdown();
    attachLineLinks();
  };

  // check for available page
  var target = document.querySelector('#js-repo-pjax-container');
  if (!target) {
    return;
  }

  load();

  var observer = new MutationObserver(load);
  var target = document.querySelector('#js-repo-pjax-container');
  observer.observe(target, {childList: true});
})();
