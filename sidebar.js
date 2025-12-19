document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Open Options
  document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // GitHub Import
  document.getElementById('importIssues').addEventListener('click', () => loadGitHubData('issues'));
  document.getElementById('importPRs').addEventListener('click', () => loadGitHubData('pulls'));
});

function loadGitHubData(type) {
  const listContainer = document.getElementById('githubList');
  listContainer.innerHTML = '<p>جاري التحميل...</p>';

  chrome.runtime.sendMessage({ action: 'IMPORT_GITHUB', type }, (response) => {
    if (response && response.success) {
      renderList(response.data, type);
    } else {
      listContainer.innerHTML = `<p style="color:red">خطأ: ${response ? response.error : 'Unknown error'}</p>`;
    }
  });
}

function renderList(items, type) {
  const listContainer = document.getElementById('githubList');
  listContainer.innerHTML = '';

  if (!items || items.length === 0) {
    listContainer.innerHTML = '<p>لا توجد بيانات.</p>';
    return;
  }

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'github-item';
    el.innerHTML = `
      <h4><a href="${item.html_url}" target="_blank">${item.title}</a></h4>
      <div class="meta">
        <span>#${item.number}</span>
        <span class="state-${item.state}">${item.state}</span>
      </div>
    `;
    listContainer.appendChild(el);
  });
}
