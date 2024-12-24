chrome.browserAction.onClicked.addListener(function (tab) {
  if (tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    chrome.tabs.executeScript(tab.id, { file: 'inject.js' }); 
  }
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    chrome.tabs.executeScript(tabId, { file: 'inject.js' }); 
  }
});
