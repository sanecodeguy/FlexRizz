// Listen for the browserAction to be clicked
chrome.browserAction.onClicked.addListener(function (tab) {
  // Only inject the script if on the right page
  if (tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    chrome.tabs.executeScript(tab.id, { file: 'inject.js' });
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the page has finished loading and is the correct URL
  if (changeInfo.status === 'complete' && tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    // Inject the script to update the page
    chrome.tabs.executeScript(tabId, { file: 'inject.js' });
  }
});

// Listen for content script messages (like page change messages)
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message === 'pageChange') {
    // Inject the script when the page changes
    chrome.tabs.executeScript(sender.tab.id, { file: 'inject.js' });
  }
});
