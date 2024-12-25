const api = typeof browser !== "undefined" ? browser : chrome;

api.browserAction.onClicked.addListener(function (tab) {
  if (tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    api.tabs.executeScript(tab.id, { file: 'inject.js' });
  }
});

api.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.startsWith('https://flexstudent.nu.edu.pk/Student/StudentMarks')) {
    api.tabs.executeScript(tabId, { file: 'inject.js' });
  }
});

api.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message === 'pageChange') {
    api.tabs.executeScript(sender.tab.id, { file: 'inject.js' });
  }
});
