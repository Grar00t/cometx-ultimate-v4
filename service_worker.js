// service_worker.js

// Open Side Panel on Action Click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for messages from Sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'IMPORT_GITHUB') {
    fetchGitHubData(message.type)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

async function fetchGitHubData(type) {
  // type: 'issues' or 'pulls'
  const { ghToken, ghRepo } = await chrome.storage.sync.get(['ghToken', 'ghRepo']);

  if (!ghToken || !ghRepo) {
    throw new Error('GitHub Token or Repo not configured in Options.');
  }

  const url = `https://api.github.com/repos/${ghRepo}/${type}`;
  
  // Check cache first (simplified)
  const cacheKey = `cache_${type}`;
  const cached = await chrome.storage.local.get(cacheKey);
  // In a real implementation, check timestamp/ETag here.
  
  const headers = {
    'Authorization': `Bearer ${ghToken}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save to cache
    await chrome.storage.local.set({
      [cacheKey]: {
        data: data,
        timestamp: Date.now()
      }
    });

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    // Fallback to cache if available
    if (cached[cacheKey]) {
      return cached[cacheKey].data;
    }
    throw error;
  }
}
