(function() {
  window.FlexRizz = window.FlexRizz || {};

  // Track active users
  function displayActiveUsers() {
    const portletBody = document.querySelector('.portlet-body');
    if (!portletBody) return;

    const activeUsersCount = window.FlexRizz.utils.getActiveUsers();

    const activeUsersRow = document.createElement('div');
    activeUsersRow.className = 'active-users-row';
    activeUsersRow.innerHTML = `
            <div style="padding: 10px; background-color: var(--primary-light); border-bottom: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: var(--space-md);">
                <strong>Active Users:</strong> ${activeUsersCount} users currently using FlexRizz extension
            </div>
        `;

    portletBody.parentNode.insertBefore(activeUsersRow, portletBody);
  }

  window.FlexRizz.init = function() {
    window.FlexRizz.utils.trackUserActivity();
    displayActiveUsers();
  };

  const portlet = document.querySelector('.m-portlet');
  if (!portlet) return;

  if (document.querySelector('#injected-support-image')) return;

  // Fix blue backgrounds in the original UI
  const headTools = document.querySelector('.m-portlet__head-tools');
  if (headTools) {
    headTools.style.backgroundColor = 'transparent';
  }

  const headCaption = document.querySelector('.m-portlet__head-caption');
  if (headCaption) {
    headCaption.style.backgroundColor = 'transparent';
  }
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("extension-content");
  imageContainer.style.margin = "0px 0";
  imageContainer.style.textAlign = "center";
  imageContainer.style.background = "#F2F3F8";
  imageContainer.style.padding = "0px";
  imageContainer.style.border = "1px solid #F2F3F8";
  imageContainer.style.borderRadius = "0px";

  const supportImg = document.createElement("img");
  supportImg.src = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGQwZTN0bmZ6dnFlNm52ZjZrZXF1ajdqeHl6bTRzNXNheTF4ZTBicSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/SgGORf2HB9tNMnbmzu/giphy.gif";
  supportImg.alt = "Support us";
  supportImg.id = "injected-support-image";
  supportImg.style.display = "inline-block";
  supportImg.style.width = "auto";
  supportImg.style.height = "auto";
  supportImg.style.background = "transparent";
  supportImg.style.margin = "0 auto";
  supportImg.style.verticalAlign = "middle";

  imageContainer.appendChild(supportImg);
  portlet.prepend(imageContainer);

  function getExtensionUrl(path) {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL(path);
    }
    if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
      return browser.runtime.getURL(path);
    }
    return path;
  }

  // Load CSS
  if (!document.querySelector('link[href="styles.css"]')) {
    const cssLink = document.createElement('link');
    cssLink.href = getExtensionUrl('styles.css');
    cssLink.rel = 'stylesheet';
    document.head.appendChild(cssLink);
  }

  // Load font
  if (!document.querySelector('#inter-font')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'inter-font';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }

  // Define utility functions directly as fallback
  const fallbackUtils = {
    getLetter: (index) => {
      if (index === 2) return 'F';
      if (index === 3) return 'D';
      if (index === 4) return 'D+';
      if (index === 5) return 'C-';
      if (index === 6) return 'C';
      if (index === 7) return 'C+';
      if (index === 8) return 'B-';
      if (index === 9) return 'B';
      if (index === 10) return 'B+';
      if (index === 11) return 'A-';
      if (index === 12) return 'A';
      return 'A+';
    },
    calculateAbsoluteGrade: (percentage) => {
      if (percentage >= 90) return "A+";
      if (percentage >= 86) return "A";
      if (percentage >= 82) return "A-";
      if (percentage >= 78) return "B+";
      if (percentage >= 74) return "B";
      if (percentage >= 70) return "B-";
      if (percentage >= 66) return "C+";
      if (percentage >= 62) return "C";
      if (percentage >= 58) return "C-";
      if (percentage >= 54) return "D+";
      if (percentage >= 50) return "D";
      return "F";
    },
    getGradePoints: (grade) => {
      const gradePoints = {
        "A+": 4.0, "A": 4.0, "A-": 3.67,
        "B+": 3.33, "B": 3.0, "B-": 2.67,
        "C+": 2.33, "C": 2.0, "C-": 1.67,
        "D+": 1.33, "D": 1.0, "F": 0
      };
      return gradePoints[grade] || 0;
    },
    getGradeClass: (grade) => {
      return `grade-${grade.replace('+', 'plus').replace('-', 'minus')}`;
    },
    getGrade: (mca, score) => {
      const ret = ['?', '?', '?'];
      if (isNaN(mca) || isNaN(score)) return ret;

      mca = Math.round(mca);
      score = Math.round(score);

      if (score < 30) {
        ret[0] = 'F';
        return ret;
      }

      const percentage = (score / 100) * 100;
      ret[0] = this.calculateAbsoluteGrade(percentage);
      return ret;
    },
  };

  function loadUtils() {
    return new Promise((resolve) => {
      if (window.gradeUtils && typeof window.gradeUtils.getGrade === 'function') {
        return resolve(window.gradeUtils);
      }

      const script = document.createElement('script');
      script.src = getExtensionUrl('utils.js');

      script.onload = function() {
        if (window.gradeUtils && typeof window.gradeUtils.getGrade === 'function') {
          resolve(window.gradeUtils);
        } else {
          console.error('Utils loaded but getGrade missing');
          resolve(fallbackUtils);
        }
      };

      script.onerror = function() {
        console.warn('Failed to load utils.js, using fallback');
        resolve(fallbackUtils);
      };

      document.head.appendChild(script);
    });
  }

  // Enable dark mode by default
  document.body.classList.add('dark-mode');

  // Main initialization
  loadUtils().then((utils) => {
    window.gradeUtils = utils;
    init();
  }).catch(error => {
    console.error('Utils loading failed completely:', error);
  });

  function init() {
    let shouldRoundUp = true;
    let panelVisible = false;
    let stopAutoClick = false;
    let selectedCourse = null;
    let allCourseData = [];
    let panelContainer = null;
    let courseListEl = null;
    let contentEl = null;
    let summaryCardEl = null;
    let searchInput = null;
    const LAST_COURSE_KEY = 'flexrizz_last_course';

    // Complete database of all courses
    const allCourses = {
      "CL1002": { name: "PF Lab", grading: "Absolute", credits: 1, semester: 1 },
      "CS1002": { name: "PF", grading: "Absolute", credits: 3, semester: 1 },
      "CL1000": { name: "IICT", grading: "Absolute", credits: 1, semester: 1 },
      "NS1001": { name: "Applied Physics", grading: "Relative", credits: 3, semester: 1 },
      "MT1003": { name: "Calculus", grading: "Relative", credits: 3, semester: 1 },
      "SS1012": { name: "Functional English", grading: "Relative", credits: 2, semester: 1 },
      "SL1012": { name: "Functional English Lab", grading: "Relative", credits: 1, semester: 1 },
      "SS1013": { name: "ICP", grading: "Relative", credits: 2, semester: 1 },

      "CL1004": { name: "OOP Lab", grading: "Absolute", credits: 1, semester: 2 },
      "CS1004": { name: "OOP", grading: "Absolute", credits: 3, semester: 2 },
      "EE1005": { name: "DLD", grading: "Absolute", credits: 3, semester: 2 },
      "EL1005": { name: "DLD Lab", grading: "Absolute", credits: 1, semester: 2 },
      "MT1008": { name: "Multivariable Calculus", grading: "Relative", credits: 3, semester: 2 },
      "SS2043": { name: "Civics", grading: "Relative", credits: 2, semester: 2 },
      "SS1007": { name: "Islamic Studies", grading: "Relative", credits: 2, semester: 2 },
      "SS1014": { name: "Expo", grading: "Relative", credits: 2, semester: 2 },
      "SL1014": { name: "Expo Lab", grading: "Relative", credits: 1, semester: 2 },
      "CS2001": { name: "Data Structures", grading: "Absolute", credits: 3, semester: 3 },
      "CL2001": { name: "Data Structures Lab", grading: "Absolute", credits: 1, semester: 3 },
      "MT1004": { name: "Linear Algebra", grading: "Relative", credits: 3, semester: 3 },
      "MG1009": { name: "Fundamentals of Mgmt (Elective)", grading: "Relative", credits: 2, semester: 3 },
      "CS1005": { name: "Discrete Structures", grading: "Absolute", credits: 3, semester: 3 },
      "CS3005": { name: "Theory of Automata", grading: "Absolute", credits: 3, semester: 3 },
      "EE2003": { name: "COAL", grading: "Absolute", credits: 3, semester: 3 },
      "EL2003": { name: "COAL Lab", grading: "Absolute", credits: 1, semester: 3 },
      "SS2050": { name: "Organizational Behavior (Elective)", grading: "Relative", credits: 2, semester: 3 },
      "MG2002": { name: "Engineering Economics (Elective)", grading: "Relative", credits: 2, semester: 3 },
      "DS2001": { name: "Introduction to Data Science", grading: "Absolute", credits: 3, semester: 3 },
      "DL2001": { name: "Introduction to Data Science Lab", grading: "Absolute", credits: 1, semester: 3 },
      "MT2005": { name: "Probability and Statistics", grading: "Relative", credits: 3, semester: 4 },
      "SS2044": { name: "International Relations", grading: "Relative", credits: 2, semester: 3 },
      "AI2002": { name: "AI", grading: "Absolute", credits: 3, semester: 4 },
      "AL2002": { name: "AI Lab", grading: "Absolute", credits: 1, semester: 4 },
      "CL2005": { name: "DB Lab", grading: "Absolute", credits: 1, semester: 4 },
      "CL2006": { name: "OS Lab", grading: "Absolute", credits: 1, semester: 4 },
      "CS2005": { name: "DB", grading: "Absolute", credits: 3, semester: 4 },
      "CS2006": { name: "OS", grading: "Absolute", credits: 3, semester: 4 },
      "CS3004": { name: "SDA", grading: "Relative", credits: 3, semester: 4 },
      "SS1015": { name: "Pakistan Studies", grading: "Absolute", credits: 3, semester: 4 },
    };
    const assessmentNameMapping = {
      'Assignment': 'Assignment',
      'Quiz': 'Quiz',
      'Sessional-I': 'Sessional I',
      'Sessional-II': 'Sessional II',
      'Lab Work': 'Lab Work',
      'Project': 'Project',
    };

    function getAssessmentName(row) {
      const button = row.querySelector('button.btn.btn-link[data-target]');
      if (button) {
        const dataTarget = button.getAttribute('data-target');
        const assessmentType = dataTarget.split('-').pop();
        return assessmentNameMapping[assessmentType] || assessmentType;
      }
      return row.querySelector('.assessmentName')?.textContent.trim() || 'Assessment';
    }

    function detectRegisteredCourses() {
      const registeredCourses = {};
      const courseTabs = document.querySelectorAll('.m-portlet__head-tools .nav-link.m-tabs__link');
      courseTabs.forEach(tab => {
        const href = tab.getAttribute('href');
        if (href && href.startsWith('#')) {
          const courseCode = href.substring(1);
          if (allCourses[courseCode]) {
            registeredCourses[courseCode] = allCourses[courseCode];
          }
        }
      });
      return registeredCourses;
    }

    const detectCurrentSemester = () => {
      const semesterDropdown = document.querySelector('select#SemId');
      if (!semesterDropdown) return 1;
      const selectedOption = semesterDropdown.options[semesterDropdown.selectedIndex];
      const semesterText = selectedOption.textContent.trim();
      const semesterMap = {
        'Fall 2024': 1, 'Spring 2025': 2, 'Fall 2025': 3, 'Spring 2026': 4,
      };
      return semesterMap[semesterText] || 1;
    };

    let currentSemester = detectCurrentSemester();
    let courses = detectRegisteredCourses();

    function loadHtml2Pdf() {
      return new Promise((resolve, reject) => {
        if (typeof html2pdf !== "undefined") {
          return resolve();
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html2pdf.js@0.9.2/dist/html2pdf.bundle.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2pdf.js"));
        document.head.appendChild(script);
      });
    }

    function collectCourseData(code) {
      const gradingType = courses[code].grading;
      const credits = courses[code].credits;
      const courseLink = document.querySelector(`a.nav-link[href="#${code}"]`);
      if (!courseLink) return null;

      courseLink.click();
      const activeDiv = document.querySelector('.tab-pane.active');
      if (!activeDiv) return null;

      let totalWeightage = 0;
      let totalObtMarks = 0;
      let totalAverage = 0;
      let assessmentDetails = [];

      const tables = activeDiv.querySelectorAll('.sum_table');
      tables.forEach((table) => {
        let rowCalculatedAverage = 0;
        let tableWeightageSum = 0;

        const rows = table.querySelectorAll('.calculationrow');
        rows.forEach((row) => {
          const assessmentName = getAssessmentName(row);
          const weightRow = row.querySelector('.weightage');
          const averageRow = row.querySelector('.AverageMarks');
          const totalMarksRow = row.querySelector('.GrandTotal');
          const obtMarksRow = row.querySelector('.ObtMarks');

          if (!weightRow || !averageRow || !totalMarksRow || !obtMarksRow ||
            weightRow.textContent.trim() === "0" ||
            totalMarksRow.textContent.trim() === "0") {
            return;
          }

          const weight = parseFloat(weightRow.textContent);
          const average = parseFloat(averageRow.textContent);
          const total = parseFloat(totalMarksRow.textContent);
          const obt = parseFloat(obtMarksRow.textContent);

          tableWeightageSum += weight;
          rowCalculatedAverage += (average / total) * weight;

          assessmentDetails.push({
            name: assessmentName,
            weight: weight,
            classAverage: average,
            totalMarks: total,
            yourScore: obt,
            percentage: (obt / total) * 100,
            classAveragePercentage: (average / total) * 100
          });
        });

        const totalSection = table.querySelector('[class*="totalColumn_"]');
        if (totalSection) {
          const colWeightage = totalSection.querySelector('.totalColweightage');
          if (colWeightage && tableWeightageSum !== 0 && rowCalculatedAverage !== 0) {
            rowCalculatedAverage = (rowCalculatedAverage / tableWeightageSum) * parseFloat(colWeightage.textContent);
            totalAverage += rowCalculatedAverage;
          }

          const colObtMarks = totalSection.querySelector('.totalColObtMarks');
          if (colWeightage && colObtMarks) {
            totalWeightage += parseFloat(colWeightage.textContent);
            totalObtMarks += parseFloat(colObtMarks.textContent);
          }
        }
      });

      const finalCalculateAverage = isNaN(totalAverage) ? 0 : totalAverage;
      const finalMarks = shouldRoundUp ? Math.ceil(totalObtMarks) : totalObtMarks;

      let grade = "I";
      if (gradingType === "Absolute") {
        const percentage = totalWeightage > 0 ? (finalMarks / totalWeightage) * 100 : 0;
        grade = window.gradeUtils.calculateAbsoluteGrade(percentage);
      } else if (gradingType === "Relative") {
        const percentage = totalWeightage > 0 ? Math.round((finalMarks / totalWeightage) * 100) : 0;
        const mca = totalWeightage > 0 ? Math.round((totalAverage / totalWeightage) * 100) : 0;
        grade = window.gradeUtils.getGrade(mca, percentage)[0];
      }

      return {
        code,
        name: courses[code].name,
        gradingType,
        credits,
        classAverage: finalCalculateAverage,
        yourScore: finalMarks,
        totalMarks: totalWeightage,
        grade,
        assessments: assessmentDetails,
        percentage: totalWeightage > 0 ? (finalMarks / totalWeightage) * 100 : 0
      };
    }

    function computeAllCourseData() {
      allCourseData = [];
      Object.keys(courses).forEach((code) => {
        const data = collectCourseData(code);
        if (data) allCourseData.push(data);
      });
    }

    function getSavedLastCourse() {
      try {
        return localStorage.getItem(LAST_COURSE_KEY);
      } catch (e) {
        return null;
      }
    }

    function saveLastCourse(code) {
      try {
        localStorage.setItem(LAST_COURSE_KEY, code);
      } catch (e) { }
    }

    function renderSummaryCard() {
      if (!summaryCardEl) return;
      let totalCredits = 0;
      let totalGradePoints = 0;
      allCourseData.forEach(c => {
        totalCredits += c.credits;
        totalGradePoints += window.gradeUtils.getGradePoints(c.grade) * c.credits;
      });
      const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 'N/A';
      summaryCardEl.innerHTML = `
        <div class="fr-summary-card-title">Semester Overview</div>
        <div class="fr-summary-card-values">
          <div class="fr-summary-item">
            <span class="fr-summary-label">SGPA</span>
            <span class="fr-summary-value">${sgpa}</span>
          </div>
          <div class="fr-summary-item">
            <span class="fr-summary-label">Total Credits</span>
            <span class="fr-summary-value">${totalCredits}</span>
          </div>
          <div class="fr-summary-item">
            <span class="fr-summary-label">Courses</span>
            <span class="fr-summary-value">${allCourseData.length}</span>
          </div>
        </div>
      `;
    }

    function renderCourseList(filterText) {
      if (!courseListEl) return;
      courseListEl.innerHTML = '';
      const filter = (filterText || '').toLowerCase();
      const filtered = allCourseData.filter(c => {
        if (!filter) return true;
        return c.code.toLowerCase().includes(filter) || c.name.toLowerCase().includes(filter);
      });

      if (filtered.length === 0) {
        courseListEl.innerHTML = '<div class="fr-empty-state"><span class="fr-empty-state-text">No courses found</span></div>';
        return;
      }

      filtered.forEach(c => {
        const item = document.createElement('button');
        item.className = 'fr-course-item' + (selectedCourse === c.code ? ' active' : '');
        item.setAttribute('role', 'option');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-selected', selectedCourse === c.code ? 'true' : 'false');
        item.dataset.code = c.code;

        const gradeClass = window.gradeUtils.getGradeClass(c.grade);
        item.innerHTML = `
          <div class="fr-course-item-info">
            <span class="fr-course-item-code">${c.code}</span>
            <span class="fr-course-item-name">${c.name}</span>
          </div>
          <span class="fr-course-item-grade ${gradeClass}">${c.grade}</span>
        `;

        item.addEventListener('click', () => selectCourse(c.code));
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectCourse(c.code);
          }
        });

        courseListEl.appendChild(item);
      });
    }

    function renderCourseContent(code) {
      if (!contentEl) return;
      const data = allCourseData.find(c => c.code === code);
      if (!data) {
        contentEl.innerHTML = '<div class="fr-empty-state"><span class="fr-empty-state-text">No marks available yet</span></div>';
        return;
      }

      const gradeClass = window.gradeUtils.getGradeClass(data.grade);
      let html = `
        <div class="fr-cards-header">
          <div>
            <h3 class="fr-cards-course-title">${data.name} <span class="${gradeClass}">(${data.grade})</span></h3>
            <div class="fr-cards-course-meta">${data.code} — ${data.credits} credits — ${data.gradingType}</div>
          </div>
        </div>
      `;

      if (data.assessments.length === 0) {
        html += '<div class="fr-empty-state"><span class="fr-empty-state-text">No marks available yet</span></div>';
      } else {
        html += '<div class="fr-cards-grid">';
        data.assessments.forEach(a => {
          html += `
            <div class="fr-card" role="group" aria-label="${a.name}">
              <div class="fr-card-label">${a.name}</div>
              <div class="fr-card-value">${a.yourScore.toFixed(1)} / ${a.totalMarks.toFixed(1)}</div>
              <div class="fr-card-sub">Avg: ${a.classAverage.toFixed(1)} — Weight: ${a.weight.toFixed(0)}%</div>
            </div>
          `;
        });

        html += `
          <div class="fr-card" role="group" aria-label="Total">
            <div class="fr-card-label">Total</div>
            <div class="fr-card-value">${data.yourScore.toFixed(1)} / ${data.totalMarks.toFixed(1)}</div>
            <div class="fr-card-sub">${data.percentage.toFixed(1)}% — ${data.gradingType}</div>
          </div>
        `;
        html += '</div>';
      }

      contentEl.innerHTML = html;
    }

    function selectCourse(code) {
      selectedCourse = code;
      saveLastCourse(code);
      renderCourseList(searchInput ? searchInput.value : '');
      renderCourseContent(code);
    }

    function createPanel() {
      const existingPanel = portlet.querySelector('.fr-panel');
      if (existingPanel) existingPanel.remove();

      stopAutoClick = false;
      computeAllCourseData();

      panelContainer = document.createElement('div');
      panelContainer.className = 'fr-panel';

      const sidebar = document.createElement('div');
      sidebar.className = 'fr-course-sidebar';

      const sidebarHeader = document.createElement('div');
      sidebarHeader.className = 'fr-course-sidebar-header';

      searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'fr-search';
      searchInput.placeholder = 'Search courses...';
      searchInput.setAttribute('aria-label', 'Search courses');
      searchInput.addEventListener('input', () => {
        renderCourseList(searchInput.value);
      });

      if (allCourseData.length > 6) {
        sidebarHeader.appendChild(searchInput);
      }

      courseListEl = document.createElement('div');
      courseListEl.className = 'fr-course-list';
      courseListEl.setAttribute('role', 'listbox');
      courseListEl.setAttribute('aria-label', 'Course list');

      sidebar.appendChild(sidebarHeader);
      sidebar.appendChild(courseListEl);

      const contentArea = document.createElement('div');
      contentArea.className = 'fr-content';

      summaryCardEl = document.createElement('div');
      summaryCardEl.className = 'fr-summary-card';
      contentArea.appendChild(summaryCardEl);

      contentEl = document.createElement('div');
      contentArea.appendChild(contentEl);

      panelContainer.appendChild(sidebar);
      panelContainer.appendChild(contentArea);

      const portletBody = portlet.querySelector('.m-portlet__body');
      if (portletBody) {
        portlet.insertBefore(panelContainer, portletBody);
      }

      renderSummaryCard();

      const savedCode = getSavedLastCourse();
      if (savedCode && allCourseData.find(c => c.code === savedCode)) {
        selectedCourse = savedCode;
      } else if (allCourseData.length > 0) {
        selectedCourse = allCourseData[0].code;
      }

      renderCourseList('');
      if (selectedCourse) {
        renderCourseContent(selectedCourse);
      } else {
        contentEl.innerHTML = '<div class="fr-empty-state"><span class="fr-empty-state-text">No marks available yet</span></div>';
      }
    }

    function showToast(message, isSuccess = true) {
      const toast = document.createElement('div');
      toast.className = `toast-notification ${isSuccess ? 'toast-success' : 'toast-error'}`;

      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        maxWidth: 'calc(100% - 48px)',
        padding: '16px 24px',
        borderRadius: 'var(--border-radius)',
        color: 'var(--text-light)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(-30px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'none',
        background: isSuccess ? 'var(--success-color)' : 'var(--danger-color)'
      });

      const icon = document.createElement('span');
      icon.innerHTML = isSuccess ? '\u2713' : '\u2717';
      icon.style.fontWeight = 'bold';
      icon.style.fontSize = '1.2em';
      toast.appendChild(icon);

      const messageEl = document.createElement('span');
      messageEl.textContent = message;
      toast.appendChild(messageEl);

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
        toast.style.pointerEvents = 'auto';
      }, 10);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-30px)';
        setTimeout(() => {
          toast.remove();
        }, 400);
      }, 4000);
    }

    const createToggleButtons = () => {
      const existingContainer = portlet.querySelector('.toggle-container');
      if (existingContainer) return;

      const container = document.createElement('div');
      container.className = 'toggle-container';
      container.style.cssText = `
                display: flex;
                gap: var(--space-md);
                padding: var(--space-lg) var(--space-xl);
                background: var(--card-bg);
                border-bottom: 1px solid var(--border-light);
                flex-wrap: wrap;
                align-items: center;
            `;

      const semesterContainer = document.createElement('div');
      semesterContainer.className = 'semester-selector';
      semesterContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin-right: auto;
                flex-wrap: wrap;
            `;

      const semesterLabel = document.createElement('span');
      semesterLabel.style.cssText = `
                color: var(--text-primary);
                font-size: 0.9rem;
            `;
      semesterLabel.textContent = 'Semester:';

      const decreaseBtn = document.createElement('button');
      decreaseBtn.innerHTML = '&minus;';
      decreaseBtn.className = 'modern-btn semester-btn';
      decreaseBtn.style.cssText = `
                padding: 5px 12px;
                font-weight: bold;
                cursor: pointer;
                min-width: 30px;
            `;

      const semesterDisplay = document.createElement('span');
      semesterDisplay.className = 'semester-display';
      semesterDisplay.style.cssText = `
                min-width: 30px;
                text-align: center;
                font-weight: bold;
                color: var(--primary-color);
            `;
      semesterDisplay.textContent = currentSemester;

      const increaseBtn = document.createElement('button');
      increaseBtn.innerHTML = '+';
      increaseBtn.className = 'modern-btn semester-btn';
      increaseBtn.style.cssText = `
                padding: 5px 12px;
                font-weight: bold;
                cursor: pointer;
                min-width: 30px;
            `;

      const darkModeContainer = document.createElement('div');
      darkModeContainer.className = 'dark-mode-toggle-container';

      const darkModeLabel = document.createElement('span');
      darkModeLabel.className = 'dark-mode-toggle-label';
      darkModeLabel.textContent = 'Dark Mode';

      const darkModeToggle = document.createElement('label');
      darkModeToggle.className = 'ios-toggle';

      const darkModeCheckbox = document.createElement('input');
      darkModeCheckbox.type = 'checkbox';
      darkModeCheckbox.checked = document.body.classList.contains('dark-mode');

      const darkModeSlider = document.createElement('span');
      darkModeSlider.className = 'ios-toggle-slider';

      darkModeToggle.appendChild(darkModeCheckbox);
      darkModeToggle.appendChild(darkModeSlider);

      darkModeContainer.appendChild(darkModeLabel);
      darkModeContainer.appendChild(darkModeToggle);

      darkModeCheckbox.addEventListener('change', () => {
        if (darkModeCheckbox.checked) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      });

      semesterContainer.appendChild(semesterLabel);
      semesterContainer.appendChild(decreaseBtn);
      semesterContainer.appendChild(semesterDisplay);
      semesterContainer.appendChild(increaseBtn);

      const transcriptButton = document.createElement('button');
      transcriptButton.id = 'show-transcript-button';
      transcriptButton.className = 'modern-btn';
      transcriptButton.innerHTML = `${panelVisible ? 'Hide' : 'Show'} Transcript`;

      const transcriptStatus = document.createElement('span');
      transcriptStatus.className = `status-indicator ${panelVisible ? 'status-on' : 'status-off'}`;
      transcriptButton.appendChild(transcriptStatus);

      const roundingButton = document.createElement('button');
      roundingButton.id = 'toggle-rounding-button';
      roundingButton.className = 'modern-btn';
      roundingButton.innerHTML = `Rounding: ${shouldRoundUp ? 'ON' : 'OFF'}`;

      const roundingStatus = document.createElement('span');
      roundingStatus.className = `status-indicator ${shouldRoundUp ? 'status-on' : 'status-off'}`;
      roundingButton.appendChild(roundingStatus);

      const editMarksButton = document.createElement('button');
      editMarksButton.id = 'edit-marks-button';
      editMarksButton.className = 'modern-btn';
      editMarksButton.innerHTML = 'Edit Marks';
      const editMarksStatus = document.createElement('span');
      editMarksStatus.className = 'status-indicator status-off';
      editMarksButton.appendChild(editMarksStatus);

      let editModeActive = false;

      editMarksButton.addEventListener('click', () => {
        editModeActive = !editModeActive;

        if (editModeActive) {
          enableEditMode();
        } else {
          disableEditMode();
        }

        editMarksButton.innerHTML = editModeActive ? 'Exit Edit' : 'Edit Marks';
        editMarksStatus.className = `status-indicator ${editModeActive ? 'status-on' : 'status-off'}`;

        if (!editModeActive) {
          createPanel();
        }
      });

      const customGradesButton = document.createElement('button');
      customGradesButton.id = 'custom-grades-button';
      customGradesButton.className = 'modern-btn';
      customGradesButton.innerHTML = 'Custom Grades';
      const customGradesStatus = document.createElement('span');
      customGradesStatus.className = 'status-indicator status-off';
      customGradesButton.appendChild(customGradesStatus);

      let customGradesActive = false;
      let currentCustomGrades = {};

      function enableEditMode() {
        if (!contentEl) return;
        const cards = contentEl.querySelectorAll('.fr-card');
        cards.forEach(card => {
          const valueEl = card.querySelector('.fr-card-value');
          if (!valueEl || valueEl.dataset.original) return;

          const text = valueEl.textContent;
          const match = text.match(/([\d.]+)\s*\/\s*([\d.]+)/);
          if (!match) return;

          const obt = parseFloat(match[1]);
          const total = parseFloat(match[2]);

          valueEl.dataset.original = text;
          valueEl.dataset.total = total;

          const input = document.createElement('input');
          input.type = 'number';
          input.step = '0.1';
          input.min = 0;
          input.max = total;
          input.value = obt;
          input.style.cssText = 'width: 80px; padding: 4px 8px; border: 1px solid var(--primary-color); border-radius: var(--border-radius-sm); background: var(--card-bg); color: var(--text-primary); text-align: center; font: inherit; font-weight: var(--font-weight-bold); font-size: var(--font-size-xl);';

          valueEl.textContent = '';
          valueEl.appendChild(input);
        });
      }

      function disableEditMode() {
        if (!contentEl) return;
        const cards = contentEl.querySelectorAll('.fr-card');
        cards.forEach(card => {
          const valueEl = card.querySelector('.fr-card-value');
          if (!valueEl || !valueEl.dataset.original) return;

          valueEl.textContent = valueEl.dataset.original;
          delete valueEl.dataset.original;
          delete valueEl.dataset.total;
        });
      }

      const updateSGPA = () => {
        renderSummaryCard();
      };

      const resetToCalculatedGrades = () => {
        customGradesActive = false;
        currentCustomGrades = {};
        customGradesStatus.className = 'status-indicator status-off';
        customGradesButton.innerHTML = 'Custom Grades';
        customGradesButton.classList.remove('active');

        if (panelVisible) {
          createPanel();
        }
      };

      decreaseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentSemester = Math.max(1, currentSemester - 1);
        semesterDisplay.textContent = currentSemester;
        decreaseBtn.disabled = (currentSemester <= 1);
        increaseBtn.disabled = false;
      });

      increaseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentSemester = currentSemester + 1;
        semesterDisplay.textContent = currentSemester;
        increaseBtn.disabled = (currentSemester >= 8);
        decreaseBtn.disabled = false;
      });

      transcriptButton.addEventListener('click', () => {
        const existingPanel = portlet.querySelector('.fr-panel');
        if (existingPanel) {
          if (existingPanel.style.display === 'none') {
            existingPanel.style.display = 'flex';
            transcriptButton.innerHTML = 'Hide Transcript';
            transcriptStatus.className = 'status-indicator status-on';
            panelVisible = true;
          } else {
            existingPanel.style.display = 'none';
            transcriptButton.innerHTML = 'Show Transcript';
            transcriptStatus.className = 'status-indicator status-off';
            panelVisible = false;
          }
        } else {
          createPanel();
          transcriptButton.innerHTML = 'Hide Transcript';
          transcriptStatus.className = 'status-indicator status-on';
          panelVisible = true;
        }
      });

      roundingButton.addEventListener('click', () => {
        shouldRoundUp = !shouldRoundUp;
        roundingButton.innerHTML = `Rounding: ${shouldRoundUp ? 'ON' : 'OFF'}`;
        roundingStatus.className = `status-indicator ${shouldRoundUp ? 'status-on' : 'status-off'}`;

        if (panelVisible) {
          computeAllCourseData();
          renderSummaryCard();
          if (selectedCourse) renderCourseContent(selectedCourse);
        }
      });

      customGradesButton.addEventListener('click', () => {
        if (customGradesActive) {
          resetToCalculatedGrades();
          return;
        }

        const modal = document.createElement('div');
        modal.className = 'custom-grades-modal';
        Object.assign(modal.style, {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          padding: '20px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: '1000',
          width: 'min(90vw, 800px)',
          maxHeight: '70vh',
          overflowY: 'auto',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family)',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: '15px',
          borderRadius: 'var(--border-radius)'
        });

        modal.innerHTML = `
                    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                        <h3 style="margin: 0; color: var(--primary-color); font-size: 1.3rem;">
                            Custom Grades
                        </h3>
                        <p style="margin: 5px 0 0; color: var(--text-secondary); font-size: 0.85rem;">
                            Enter custom grades for each course
                        </p>
                    </div>
                    
                    <div class="grade-inputs-container" style="overflow-y: auto; padding-right: 5px;">
                        <div class="grade-inputs-grid" style="
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                            gap: 12px;
                            align-items: center;
                        ">
                            ${Object.entries(courses).map(([code, course]) => `
                                <div class="grade-input-row" style="display: flex; align-items: center; gap: 10px;">
                                    <label style="color: var(--text-primary); font-size: 0.9rem; min-width: 120px;">
                                        ${course.name} (${code}):
                                    </label>
                                    <input type="text" class="grade-input" id="${code}-grade" 
                                           placeholder="${currentCustomGrades[code] || 'Auto'}"
                                           value="${currentCustomGrades[code] || ''}"
                                           style="
                                               background: var(--card-bg); 
                                               border: 1px solid var(--border-color); 
                                               color: var(--text-primary); 
                                               padding: 8px 12px; 
                                               width: 100%;
                                               text-align: center; 
                                               border-radius: var(--border-radius-sm); 
                                               font-family: var(--font-family); 
                                               font-weight: 500;
                                           ">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-actions" style="
                        display: flex;
                        justify-content: flex-end;
                        gap: 12px;
                        padding-top: 10px;
                        border-top: 1px solid var(--border-color);
                    ">
                        <button id="cancel-custom-grades" class="modern-btn secondary" style="padding: 8px 16px;">
                            Cancel
                        </button>
                        <button id="apply-custom-grades" class="modern-btn" style="padding: 8px 16px;">
                            Apply
                        </button>
                    </div>
                `;

        document.body.appendChild(modal);

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        Object.assign(backdrop.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: '999',
          backdropFilter: 'blur(3px)'
        });
        document.body.appendChild(backdrop);

        const firstInput = modal.querySelector('.grade-input');
        if (firstInput) firstInput.focus();

        const applyBtn = modal.querySelector('#apply-custom-grades');
        const cancelBtn = modal.querySelector('#cancel-custom-grades');

        applyBtn.addEventListener('click', () => {
          currentCustomGrades = {};
          Object.keys(courses).forEach(code => {
            const input = modal.querySelector(`#${code}-grade`);
            if (input && input.value.trim() !== '') {
              currentCustomGrades[code] = input.value.trim().toUpperCase();
            }
          });

          if (panelVisible) {
            allCourseData.forEach(c => {
              if (currentCustomGrades[c.code]) {
                c.grade = currentCustomGrades[c.code];
              }
            });
            renderSummaryCard();
            if (selectedCourse) renderCourseContent(selectedCourse);
          }

          customGradesActive = Object.keys(currentCustomGrades).length > 0;
          customGradesStatus.className = `status-indicator ${customGradesActive ? 'status-on' : 'status-off'}`;
          customGradesButton.innerHTML = customGradesActive ? 'Reset Grades' : 'Custom Grades';
          if (customGradesActive) customGradesButton.classList.add('active');

          modal.remove();
          backdrop.remove();
        });

        cancelBtn.addEventListener('click', () => {
          modal.remove();
          backdrop.remove();
        });

        backdrop.addEventListener('click', () => {
          modal.remove();
          backdrop.remove();
        });

        document.addEventListener('keydown', function handleKeyDown(e) {
          if (e.key === 'Escape') {
            modal.remove();
            backdrop.remove();
            document.removeEventListener('keydown', handleKeyDown);
          }
        });
      });

      decreaseBtn.disabled = (currentSemester <= 1);
      increaseBtn.disabled = (currentSemester >= 8);

      container.appendChild(semesterContainer);
      container.appendChild(darkModeContainer);
      container.appendChild(transcriptButton);
      container.appendChild(roundingButton);
      container.appendChild(editMarksButton);
      container.appendChild(customGradesButton);

      const portletBody = portlet.querySelector('.m-portlet__body');
      if (portletBody) {
        portlet.insertBefore(container, portletBody);
      }
    };

    createToggleButtons();
  }

})();
