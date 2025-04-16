// contentLoader.js
(async function() {
  const GITHUB_BASE = 'https://raw.githubusercontent.com/sanecodeguy/FlexRizz/main/';
  const CACHE_BUSTER = `?t=${Date.now()}`;

  // Load Inter font
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  async function loadRemoteResource(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load: ${url}`);
      return await response.text();
    } catch (error) {
      console.error('Resource load error:', error);
      throw error;
    }
  }
  
  function injectScript(content) {
    const script = document.createElement('script');
    script.textContent = content;
    (document.head || document.documentElement).appendChild(script);
  }

  function injectStyles(content) {
    const style = document.createElement('style');
    style.textContent = content;
    document.head.appendChild(style);
  }

  function displayActiveUsers(count) {
    const portletBody = document.querySelector('.portlet-body');
    if (!portletBody) return;

    const activeUsersRow = document.createElement('div');
    activeUsersRow.className = 'flexrizz-active-users-row';
    activeUsersRow.innerHTML = `
        <div style="padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #ddd; font-family: 'Inter', sans-serif;">
            <strong>Active Users:</strong> ${count} users currently using FlexRizz extension
        </div>
    `;
    
    portletBody.parentNode.insertBefore(activeUsersRow, portletBody);
  }

  try {
    // Load CSS first
    const cssContent = await loadRemoteResource(`${GITHUB_BASE}styles.css${CACHE_BUSTER}`);
    injectStyles(cssContent);

    // Load utils.js
    const utilsContent = await loadRemoteResource(`${GITHUB_BASE}utils.js${CACHE_BUSTER}`);
    injectScript(utilsContent);

    // Load inject.js
    const injectContent = await loadRemoteResource(`${GITHUB_BASE}inject.js${CACHE_BUSTER}`);
    injectScript(injectContent);

    // Initialize active users tracking
    await new Promise(resolve => {
      const checkInitialized = setInterval(() => {
        if (window.FlexRizz?.utils) {
          clearInterval(checkInitialized);
          window.FlexRizz.utils.trackUserActivity();
          const activeUsers = window.FlexRizz.utils.getActiveUsers();
          displayActiveUsers(activeUsers);
          resolve();
        }
      }, 100);
    });

  } catch (error) {
    console.error('FlexRizz failed to load remote resources:', error);
    
    // Minimal fallback
    injectScript(`
      console.log('FlexRizz minimal version loaded');
      if (!window.gradeUtils) {
        window.gradeUtils = {
          calculateAbsoluteGrade: (p) => p >= 90 ? 'A+' : 'F'
        };
      }
      
      // Minimal active users display
      setTimeout(() => {
        const portletBody = document.querySelector('.portlet-body');
        if (portletBody) {
          const row = document.createElement('div');
          row.innerHTML = '<div style="padding:10px;background:#f8f9fa;border-bottom:1px solid #ddd;">Active Users: Data unavailable</div>';
          portletBody.parentNode.insertBefore(row, portletBody);
        }
      }, 1000);
    `);
  }
})();