document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.sync.get(['ghToken', 'ghRepo'], (items) => {
    if (items.ghToken) document.getElementById('ghToken').value = items.ghToken;
    if (items.ghRepo) document.getElementById('ghRepo').value = items.ghRepo;
  });

  // Save settings
  document.getElementById('save').addEventListener('click', () => {
    const ghToken = document.getElementById('ghToken').value;
    const ghRepo = document.getElementById('ghRepo').value;

    chrome.storage.sync.set({ ghToken, ghRepo }, () => {
      const status = document.getElementById('status');
      status.textContent = 'تم الحفظ بنجاح!';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });
});
