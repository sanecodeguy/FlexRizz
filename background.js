// background.js
const extAPI = typeof browser !== 'undefined' ? browser : chrome;

extAPI.runtime.onInstalled.addListener(() => {
  console.log('FlexRizz extension installed');
});

// Firefox-compatible browser action handler
extAPI.browserAction?.onClicked.addListener((tab) => {
  if (tab.url.includes('flexstudent.nu.edu.pk/')) {
    extAPI.tabs.executeScript(tab.id, { file: 'contentLoader.js' });
  }
});

extAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('flexstudent.nu.edu.pk/')) {
    extAPI.tabs.executeScript(tabId, { file: 'contentLoader.js' });
  }
});
