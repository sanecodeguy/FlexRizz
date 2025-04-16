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
    return script;
  }

  function injectStyles(content) {
    const style = document.createElement('style');
    style.textContent = content;
    document.head.appendChild(style);
  }

  function showActiveUsers(count) {
    console.log('[FlexRizz] Attempting to show active users:', count);
    const portletBody = document.querySelector('.portlet-body');
    if (!portletBody) {
      console.warn('[FlexRizz] Could not find .portlet-body element');
      return;
    }

    // Remove existing row if present
    const existingRow = document.querySelector('.flexrizz-active-users-row');
    if (existingRow) existingRow.remove();

    const activeUsersRow = document.createElement('div');
    activeUsersRow.className = 'flexrizz-active-users-row';
    activeUsersRow.innerHTML = `
      <div style="padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #ddd; 
                  font-family: 'Inter', sans-serif; font-size: 14px;">
        <strong>Active Users:</strong> ${count} ${count === 1 ? 'user' : 'users'} currently using FlexRizz
      </div>
    `;
    
    portletBody.parentNode.insertBefore(activeUsersRow, portletBody);
    console.log('[FlexRizz] Active users display added');
  }

  try {
    // 1. Load CSS first
    const cssContent = await loadRemoteResource(`${GITHUB_BASE}styles.css${CACHE_BUSTER}`);
    injectStyles(cssContent);

    // 2. Load and wait for utils.js
    const utilsContent = await loadRemoteResource(`${GITHUB_BASE}utils.js${CACHE_BUSTER}`);
    const utilsScript = injectScript(utilsContent);
    
    await new Promise((resolve) => {
      utilsScript.onload = resolve;
      utilsScript.onerror = resolve; // Continue even if utils fails
    });

    // 3. Initialize tracking (if utils loaded successfully)
    if (window.FlexRizz?.utils) {
      window.FlexRizz.utils.trackUserActivity();
      const activeUsers = window.FlexRizz.utils.getActiveUsers();
      showActiveUsers(activeUsers);
    } else {
      console.warn('[FlexRizz] Utils not available, showing fallback');
      showActiveUsers('N/A (fallback)');
    }

    // 4. Load inject.js (non-blocking)
    const injectContent = await loadRemoteResource(`${GITHUB_BASE}inject.js${CACHE_BUSTER}`);
    injectScript(injectContent);

  } catch (error) {
    console.error('[FlexRizz] Loading failed:', error);
    
    // Fallback UI
    showActiveUsers('N/A (error)');
    injectScript(`
      console.log('[FlexRizz] Minimal version loaded');
      if (!window.gradeUtils) {
        window.gradeUtils = {
          calculateAbsoluteGrade: (p) => p >= 90 ? 'A+' : 'F'
        };
      }
    `);
  }

  // Periodic check in case DOM loads slowly
  const domCheckInterval = setInterval(() => {
    const portletBody = document.querySelector('.portlet-body');
    if (portletBody) {
      const existingRow = document.querySelector('.flexrizz-active-users-row');
      if (!existingRow) {
        const count = window.FlexRizz?.utils?.getActiveUsers?.() || 'N/A';
        showActiveUsers(count);
      }
    }
  }, 1000);

  // Stop checking after 10 seconds
  setTimeout(() => clearInterval(domCheckInterval), 10000);
})();