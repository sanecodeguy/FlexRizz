(function() {

  
   
   
   
    const portlet = document.querySelector('.m-portlet');
    if (!portlet) return;
  


    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container';
    adContainer.style.margin = '20px 0';
    adContainer.style.minHeight = '90px';
    adContainer.style.textAlign = 'center';
  
    // Insert the ad code directly
    adContainer.innerHTML = `
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9316188419448562"
         crossorigin="anonymous"></script>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-format="autorelaxed"
           data-ad-client="ca-pub-9316188419448562"
           data-ad-slot="8967735708"></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    `;
  
    // Insert before portlet body
    const portletBody = portlet.querySelector('.m-portlet__body');
    if (portletBody) {
      portlet.insertBefore(adContainer, portletBody);
    }

    function getExtensionUrl(path) {
      // Try to find the extension's runtime URL
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        return chrome.runtime.getURL(path);
      }
      if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
        return browser.runtime.getURL(path);
      }
      // Fallback - assumes files are served from same origin
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
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
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
  
          // Simplified grading logic for fallback
          if (score < 30) {
              ret[0] = 'F';
              return ret;
          }
          
          const percentage = (score / 100) * 100;
          ret[0] = calculateAbsoluteGrade(percentage);
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
  
    // Main initialization
    loadUtils().then((utils) => {
        // Store utils reference
        window.gradeUtils = utils;
        init();
    }).catch(error => {
        console.error('Utils loading failed completely:', error);
    });
  
  
   async function init() {
      let shouldRoundUp = true;
      let tableVisible = false;
      let stopAutoClick = false;
      
      const semesterCourses = {
        1:{
          "CL1002": { name:"PF Lab", grading: "Absolute", credits: 1 },
          "CS1002": { name:"PF", grading: "Absolute", credits:3 },
          "CL1000": { name:"IICT", grading: "Absolute", credits: 1 },
          "NS1001": { name:"Applied Physics", grading: "Relative", credits: 3 },
          "MT1003": { name:"Calculus", grading: "Relative", credits: 3 },
          "SS1012": { name:"Functional English", grading: "Relative", credits: 2 },
          "SL1012": { name:"Functional English Lab", grading: "Relative", credits: 1 },
          "SL1014": { name:"ICP", grading: "Relative", credits: 2 },
        },
          2: {
              "CL1004": { name:"OOP Lab", grading: "Absolute", credits: 1 },
              "CS1004": { name:"OOP", grading: "Absolute", credits:3 },
              "EE1005": { name:"DLD", grading: "Absolute", credits: 3 },
              "EL1005": { name:"DLD Lab", grading: "Absolute", credits: 1 },
              "MT1008": { name:"Multivariable Calculus", grading: "Relative", credits: 3 },
              "SS2043": { name:"Civics", grading: "Relative", credits: 2 },
              "SS1007": { name:"Islamic Studies", grading: "Relative", credits: 2 },
              "SS1014": { name:"Expo", grading: "Relative", credits: 2 },
              "SL1014": { name:"Expo Lab", grading: "Relative", credits: 1 },
          },
          3: {
              // Add your semester 3 courses here
              "CS2001": { name:"Data Structures", grading: "Absolute", credits: 3 },
              "CL2001": { name:"DS Lab", grading: "Absolute", credits: 1 },
              // ... add other courses
          },4:{},5:{},6:{},7:{},8:{}
          // Add more semesters as needed
      };
      const detectCurrentSemester = () => {
        const semesterDropdown = document.querySelector('select#SemId');
        if (!semesterDropdown) return 2; // Default to semester 2 if dropdown not found
        
        const selectedOption = semesterDropdown.options[semesterDropdown.selectedIndex];
        const semesterText = selectedOption.textContent.trim();
        
        // Map semester text to semester number
        const semesterMap = {
            'Fall 2024': 1,
            'Spring 2025': 2,
            'Fall 2025': 3,
            'Spring 2026': 4,
            // Add more mappings as needed
        };
        
        return semesterMap[semesterText] || 2; // Default to semester 2 if no match
    };
  
    let currentSemester = detectCurrentSemester();
    let courses = semesterCourses[currentSemester] || semesterCourses[2]; // Fallback to semester 2 if no courses defined
      
      function loadHtml2Pdf() {
        return new Promise((resolve, reject) => {
            // Check if html2pdf is already loaded
            if (typeof html2pdf !== "undefined") {
                return resolve(); // already loaded
            }
    
            const script = document.createElement('script');
  script.src = 'https://unpkg.com/html2pdf.js@0.9.2/dist/html2pdf.bundle.min.js'; // Use unpkg CDN
  
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load html2pdf.js"));
    
            document.head.appendChild(script);
        });
    }
    
    
      const createTable = () => {
          const existingTable = portlet.querySelector('#course-data-table');
          if (existingTable) {
              existingTable.remove();
          }
  
          stopAutoClick = false;
  
          const table = document.createElement('table');
          table.id = 'course-data-table';
  
          const headerRow = `
              <thead>
                  <tr>
                      <th data-tooltip="Course Name">Course</th>
                      <th data-tooltip="Absolute or Relative Grading">Type</th>
                      <th data-tooltip="Class Average">Avg</th>
                      <th data-tooltip="Marks Obtained">Obtained</th>
                      <th data-tooltip="Total Marks">Total</th>
                      <th data-tooltip="Final Grade">Grade</th>
                  </tr>
              </thead>
          `;
          table.innerHTML = headerRow;
  
          const tbody = document.createElement('tbody');
          table.appendChild(tbody);
  
          let totalCredits = 0;
          let totalGradePoints = 0;
  
          const addCourseDataToTable = (name, gradingType, finalCalculateAverage, totalObtMarks, totalWeightage, grade, credits) => {
              const gradeClass = window.gradeUtils.getGradeClass(grade);
              const newRow = `
                  <tr>
                      <td>${name}</td>
                      <td>${gradingType}</td>
                      <td>${finalCalculateAverage}</td>
                      <td>${totalObtMarks.toFixed(2)}</td>
                      <td>${totalWeightage.toFixed(2)}</td>
                      <td class="${gradeClass}" style="font-weight: bold;">${grade}</td>
                  </tr>
              `;
              tbody.innerHTML += newRow;
  
              totalCredits += credits;
              totalGradePoints += window.gradeUtils.getGradePoints(grade) * credits;
          };
  
          Object.keys(courses).forEach((code, index) => {
              if (stopAutoClick) return;
  
              const gradingType = courses[code].grading;
              const credits = courses[code].credits;
              const courseLink = document.querySelector(`a.nav-link[href="#${code}"]`);
              if (courseLink) {
                  courseLink.click();
              }
  
              const activeDiv = document.querySelector('.tab-pane.active');
              if (!activeDiv) return;
  
              let totalWeightage = 0;
              let totalObtMarks = 0;
              let totalAverage = 0;
  
              const tables = activeDiv.querySelectorAll('.sum_table');
  
              tables.forEach((table) => {
                  let rowCalculatedAverage = 0;
                  let tableWeightageSum = 0;
  
                  const rows = table.querySelectorAll('.calculationrow');
                  rows.forEach((row) => {
                      const weightRow = row.querySelector('.weightage');
                      const averageRow = row.querySelector('.AverageMarks');
                      const totalMarksRow = row.querySelector('.GrandTotal');
  
                      if (!weightRow || !averageRow || !totalMarksRow ||
                          weightRow.textContent.trim() === "0" || 
                          averageRow.textContent.trim() === "0" || 
                          totalMarksRow.textContent.trim() === "0") {
                          return;
                      }
  
                      tableWeightageSum += parseFloat(weightRow.textContent);
                      rowCalculatedAverage += (parseFloat(averageRow.textContent) / parseFloat(totalMarksRow.textContent)) * parseFloat(weightRow.textContent);
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
  
              const finalCalculateAverage = isNaN(totalAverage) ? "N/A" : totalAverage.toFixed(2);
  
              let grade = "I"; 
              const finalMarks = shouldRoundUp ? Math.ceil(totalObtMarks) : totalObtMarks;
              
              if (gradingType === "Absolute") {
                  const percentage = (finalMarks / totalWeightage) * 100;            
                  grade = window.gradeUtils.calculateAbsoluteGrade(percentage);
              }
              else if (gradingType === "Relative") {
                  const percentage = Math.round((finalMarks / totalWeightage) * 100);
                  const mca = Math.round((totalAverage / totalWeightage) * 100);
                  grade = window.gradeUtils.getGrade(mca, percentage)[0];
              }
  
              addCourseDataToTable(courses[code].name, gradingType, finalCalculateAverage, finalMarks, totalWeightage, grade, credits);  
              if (index === Object.keys(courses).length - 1) {
                  stopAutoClick = true;
              }
          });
  
          const sgpa = (totalGradePoints / totalCredits).toFixed(2);
          const sgpaRow = `
              <tr class="sgpa-row">
                  <td colspan="4" style="text-align: left;">
                      <span class="credit-text">A project by <a href="https://www.rizzons.com" target="_blank" class="credit-link">Rizzons</a> @doubleroote</span>
                  </td>
                  <td style="text-align: right; font-weight: bold;">SGPA</td>
                  <td style="font-weight: bold; font-size: 1.1em;">${sgpa}</td>
              </tr>
          `;
          tbody.innerHTML += sgpaRow;
  
          const portletBody = portlet.querySelector('.m-portlet__body');
          if (portletBody) {
              portlet.insertBefore(table, portletBody);
          }
      };
      const createToggleButtons = () => {
        const existingContainer = portlet.querySelector('.toggle-container');
        if (existingContainer) return;
  
        
        
      const container = document.createElement('div');
      container.className = 'toggle-container';
      
        // Semester Selector
        const semesterContainer = document.createElement('div');
        semesterContainer.className = 'semester-selector';
        Object.assign(semesterContainer.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginRight: 'auto'
        });
    
        const semesterLabel = document.createElement('span');
        Object.assign(semesterLabel.style, {
            color: 'var(--text-primary)',
            fontSize: '0.9rem'
        });
        semesterLabel.textContent = 'Semester:';
    
        const decreaseBtn = document.createElement('button');
        decreaseBtn.innerHTML = '&minus;';
        decreaseBtn.className = 'modern-btn semester-btn';
        Object.assign(decreaseBtn.style, {
            padding: '5px 12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            minWidth: '30px'
        });
    
        const semesterDisplay = document.createElement('span');
        semesterDisplay.className = 'semester-display';
        Object.assign(semesterDisplay.style, {
            minWidth: '30px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'var(--accent-color)'
        });
        semesterDisplay.textContent = currentSemester;
    
        const increaseBtn = document.createElement('button');
        increaseBtn.innerHTML = '+';
        increaseBtn.className = 'modern-btn semester-btn';
        Object.assign(increaseBtn.style, {
            padding: '5px 12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            minWidth: '30px'
        });
    
        semesterContainer.appendChild(semesterLabel);
        semesterContainer.appendChild(decreaseBtn);
        semesterContainer.appendChild(semesterDisplay);
        semesterContainer.appendChild(increaseBtn);
    
        // Transcript Button
        const transcriptButton = document.createElement('button');
        transcriptButton.id = 'show-transcript-button';
        transcriptButton.className = 'modern-btn';
        transcriptButton.innerHTML = `${tableVisible ? 'Hide' : 'Show'} Transcript`;
        
        const transcriptStatus = document.createElement('span');
        transcriptStatus.className = `status-indicator ${tableVisible ? 'status-on' : 'status-off'}`;
        transcriptButton.appendChild(transcriptStatus);
        
        // Rounding Button
        const roundingButton = document.createElement('button');
        roundingButton.id = 'toggle-rounding-button';
        roundingButton.className = 'modern-btn';
        roundingButton.innerHTML = `Rounding: ${shouldRoundUp ? 'ON' : 'OFF'}`;
        
        const roundingStatus = document.createElement('span');
        roundingStatus.className = `status-indicator ${shouldRoundUp ? 'status-on' : 'status-off'}`;
        roundingButton.appendChild(roundingStatus);
        
        // Export Button
        const exportButton = document.createElement('button');
        exportButton.id = 'export-button';
        exportButton.className = 'modern-btn';
        exportButton.innerHTML = 'Export Data';
        
        // Custom Grades Button
        const customGradesButton = document.createElement('button');
        customGradesButton.id = 'custom-grades-button';
        customGradesButton.className = 'modern-btn';
        customGradesButton.innerHTML = 'Custom Grades';
        const customGradesStatus = document.createElement('span');
        customGradesStatus.className = 'status-indicator status-off';
        customGradesButton.appendChild(customGradesStatus);
        
        let customGradesActive = false;
        let currentCustomGrades = {};
        
        // Function to update SGPA
        const updateSGPA = () => {
            const table = portlet.querySelector('#course-data-table');
            if (!table) return;
            
            let totalCredits = 0;
            let totalGradePoints = 0;
            
            const rows = table.querySelectorAll('tbody tr:not(.sgpa-row)');
            rows.forEach(row => {
                const courseNameCell = row.querySelector('td:first-child');
                if (courseNameCell) {
                    const courseName = courseNameCell.textContent;
                    const courseEntry = Object.entries(courses).find(([_, course]) => course.name === courseName);
                    if (courseEntry) {
                        const [code, courseData] = courseEntry;
                        const gradeCell = row.querySelector('td:last-child');
                        if (gradeCell) {
                            const grade = gradeCell.textContent.trim();
                            totalCredits += courseData.credits;
                            totalGradePoints += window.gradeUtils.getGradePoints(grade) * courseData.credits;
                        }
                    }
                }
            });
            
            const sgpa = (totalGradePoints / totalCredits).toFixed(2);
            const sgpaRow = table.querySelector('.sgpa-row td:last-child');
            if (sgpaRow) {
                sgpaRow.textContent = sgpa;
            }
        };
        
        // Function to reset to calculated grades
        const resetToCalculatedGrades = () => {
            customGradesActive = false;
            currentCustomGrades = {};
            customGradesStatus.className = 'status-indicator status-off';
            customGradesButton.innerHTML = 'Custom Grades';
            customGradesButton.classList.remove('active');
            
            if (tableVisible) {
                createTable();
            }
        };
    
        // Semester Update Function
        const updateSemester = (newSemester) => {
            if (semesterCourses[newSemester]) {
                currentSemester = newSemester;
                courses = semesterCourses[currentSemester];
                semesterDisplay.textContent = currentSemester;
                
                // Disable buttons at boundaries
                decreaseBtn.disabled = (currentSemester <= 0);
                increaseBtn.disabled = (currentSemester >= Object.keys(semesterCourses).length);
                
                // Reset custom grades when semester changes
                if (customGradesActive) {
                    resetToCalculatedGrades();
                } else if (tableVisible) {
                    createTable();
                }
            }
        };
    
        // Event Listeners
        decreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSemester(currentSemester - 1);
        });
        
        increaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSemester(currentSemester + 1);
        });
        
        transcriptButton.addEventListener('click', () => {
            const existingTable = portlet.querySelector('#course-data-table');
            if (existingTable) {
                if (existingTable.style.display === 'none') {
                    existingTable.style.display = 'table';
                    transcriptButton.innerHTML = 'Hide Transcript';
                    transcriptStatus.className = 'status-indicator status-on';
                    tableVisible = true;
                } else {
                    existingTable.style.display = 'none';
                    transcriptButton.innerHTML = 'Show Transcript';
                    transcriptStatus.className = 'status-indicator status-off';
                    tableVisible = false;
                }
            } else {
                createTable();
                transcriptButton.innerHTML = 'Hide Transcript';
                transcriptStatus.className = 'status-indicator status-on';
                tableVisible = true;
            }
        });
        
        roundingButton.addEventListener('click', () => {
            shouldRoundUp = !shouldRoundUp;
            roundingButton.innerHTML = `Rounding: ${shouldRoundUp ? 'ON' : 'OFF'}`;
            roundingStatus.className = `status-indicator ${shouldRoundUp ? 'status-on' : 'status-off'}`;
            
            if (tableVisible) {
                createTable();
            }
        });
        
        exportButton.addEventListener('click', async () => {
            try {
                exportButton.disabled = true;
                exportButton.textContent = 'Coming Soon!';
            } finally {
                exportButton.disabled = false;
            }
        });
        
        customGradesButton.addEventListener('click', () => {
            if (customGradesActive) {
                resetToCalculatedGrades();
                return;
            }
    
            // Modal creation code
            const modal = document.createElement('div');
            modal.className = 'custom-grades-modal';
            Object.assign(modal.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--primary-bg)',
                border: '1px solid var(--border-color)',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                zIndex: '1000',
                width: 'min(90vw, 800px)',
                maxHeight: '70vh',
                overflowY: 'auto',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', sans-serif",
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                gap: '15px'
            });
    
            modal.innerHTML = `
                <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h3 style="margin: 0; color: var(--accent-color); font-size: 1.3rem;">
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
                                           background: var(--elevated-black); 
                                           border: 1px solid var(--border-color); 
                                           color: var(--text-primary); 
                                           padding: 8px 12px; 
                                           width: 100%;
                                           text-align: center; 
                                           border-radius: 4px; 
                                           font-family: 'Inter', sans-serif; 
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
                    <button id="cancel-custom-grades" class="modern-btn" style="
                        background: transparent;
                        color: var(--text-secondary);
                        border: 1px solid var(--border-color);
                        padding: 8px 16px;
                    ">
                        Cancel
                    </button>
                    <button id="apply-custom-grades" class="modern-btn" style="
                        background: var(--carbon);
                        color: var(--text-primary);
                        padding: 8px 16px;
                    ">
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
                
                if (tableVisible) {
                    const table = portlet.querySelector('#course-data-table');
                    if (table) {
                        const rows = table.querySelectorAll('tbody tr:not(.sgpa-row)');
                        rows.forEach(row => {
                            const courseNameCell = row.querySelector('td:first-child');
                            if (courseNameCell) {
                                const courseName = courseNameCell.textContent;
                                const courseEntry = Object.entries(courses).find(([_, course]) => course.name === courseName);
                                if (courseEntry) {
                                    const [code] = courseEntry;
                                    if (currentCustomGrades[code]) {
                                        const gradeCell = row.querySelector('td:last-child');
                                        if (gradeCell) {
                                            const gradeClass = window.gradeUtils.getGradeClass(currentCustomGrades[code]);
                                            gradeCell.className = gradeClass;
                                            gradeCell.textContent = currentCustomGrades[code];
                                        }
                                    }
                                }
                            }
                        });
                        
                        updateSGPA();
                    }
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
    
        // Initialize buttons state
        decreaseBtn.disabled = (currentSemester <= 2);
        increaseBtn.disabled = (currentSemester >= Object.keys(semesterCourses).length);
    
        // Add all buttons to container
        container.appendChild(semesterContainer);
        container.appendChild(transcriptButton);
        container.appendChild(roundingButton);
        container.appendChild(exportButton);
        container.appendChild(customGradesButton);
    
        const portletBody = portlet.querySelector('.m-portlet__body');
        if (portletBody) {
            portlet.insertBefore(container, portletBody);
        }
    };

      
      createToggleButtons();
  }
  })();
  
