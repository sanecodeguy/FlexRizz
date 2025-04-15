(function() {
    const portlet = document.querySelector('.m-portlet');
    if (!portlet) return;

    if (document.querySelector('#injected-support-image')) return;

    // Create image wrapper
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('extension-content');
    imageContainer.style.margin = '0px 0';
    imageContainer.style.textAlign = 'center';
    imageContainer.style.background = '#121719';
    imageContainer.style.padding = '0px';
    imageContainer.style.borderRadius = '0px';

    const supportImg = document.createElement('img');
    supportImg.src = 'https://github.com/user-attachments/assets/54474935-a79b-4b68-9889-26cb0f9b58e3';
    supportImg.alt = 'Support us';
    supportImg.style.maxHeight = '80px';
    supportImg.style.width = 'auto';
    supportImg.style.background = 'transparent';
    supportImg.id = 'injected-support-image';

    imageContainer.appendChild(supportImg);
    portlet.prepend(imageContainer);
// Add the "Show Stats" button to the page
const statsButton = document.createElement('button');
statsButton.textContent = 'Show Stats';
statsButton.id = 'show-stats-btn';
document.body.appendChild(statsButton);

// Event listener to show modal
statsButton.addEventListener('click', () => {
  generateStatsModal(userCourses);
});

// Function to generate modal HTML
function generateStatsModal(courses) {
  // Remove existing modal if present
  const existing = document.getElementById('stats-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'stats-modal';
  modal.className = 'stats-modal';

  const content = document.createElement('div');
  content.className = 'stats-modal-content';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-modal';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => modal.remove();

  const title = document.createElement('h2');
  title.textContent = 'Your Course Statistics';

  content.appendChild(closeBtn);
  content.appendChild(title);

  courses.forEach(course => {
    const {
      code,
      name,
      grade,
      credit,
      stats = {} // Optional: mean, median, max, min, stdev
    } = course;

    const courseBox = document.createElement('div');
    courseBox.className = 'course-stat';

    courseBox.innerHTML = `
      <h3>${code} - ${name}</h3>
      <p><strong>Your Grade:</strong> <span class="grade-badge ${gradeColorClass(grade)}">${grade}</span></p>
      <p><strong>Credit:</strong> ${credit}</p>
      <p><strong>Class Avg:</strong> ${stats.average || 'N/A'}</p>
      <p><strong>Highest:</strong> ${stats.max || 'N/A'} | <strong>Lowest:</strong> ${stats.min || 'N/A'}</p>
      <p><strong>Std Dev:</strong> ${stats.stdev || 'N/A'}</p>
    `;

    content.appendChild(courseBox);
  });

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Color badge class for grades
function gradeColorClass(grade) {
  if (!grade) return 'grade-unknown';
  if (grade === 'A+' || grade === 'A') return 'grade-high';
  if (grade === 'B+' || grade === 'B') return 'grade-mid';
  return 'grade-low';
}

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

    // Main initialization
    loadUtils().then((utils) => {
        window.gradeUtils = utils;
        init();
    }).catch(error => {
        console.error('Utils loading failed completely:', error);
    });

    function init() {
        let shouldRoundUp = true;
        let tableVisible = false;
        let stopAutoClick = false;
        
        // Complete database of all courses
        const allCourses = {
            "CL1002": { name: "PF Lab", grading: "Absolute", credits: 1, semester: 1 },
            "CS1002": { name: "PF", grading: "Absolute", credits: 3, semester: 1 },
            "CL1000": { name: "IICT", grading: "Absolute", credits: 1, semester: 1 },
            "NS1001": { name: "Applied Physics", grading: "Relative", credits: 3, semester: 1 },
            "MT1003": { name: "Calculus", grading: "Relative", credits: 3, semester: 1 },
            "SS1012": { name: "Functional English", grading: "Relative", credits: 2, semester: 1 },
            "SL1012": { name: "Functional English Lab", grading: "Relative", credits: 1, semester: 1 },
            "SL1014": { name: "ICP", grading: "Relative", credits: 2, semester: 1 },

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
            "CL2001": { name: "DS Lab", grading: "Absolute", credits: 1, semester: 3 },
        };

        // Function to detect registered courses from the marks tab
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

        // Detect current semester from dropdown
        const detectCurrentSemester = () => {
            const semesterDropdown = document.querySelector('select#SemId');
            if (!semesterDropdown) return 1; // Default to semester 1 if dropdown not found
            
            const selectedOption = semesterDropdown.options[semesterDropdown.selectedIndex];
            const semesterText = selectedOption.textContent.trim();
            
            const semesterMap = {
                'Fall 2024': 1,
                'Spring 2025': 2,
                'Fall 2025': 3,
                'Spring 2026': 4,
                // Add more mappings as needed
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
                    <span class="credit-text">A project by <a href="https://www.rizzons.com" target="_blank" class="credit-link">Rizzons</a> @doubleroote 
                    <svg viewBox="0 0 24 24" aria-label="Verified account" style="color: #1DA1F2; width: 0.9em; height: 0.9em; margin-left: 2px; vertical-align: middle; fill: currentColor;">
                        <g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path></g>
                    </svg>
                    </span>
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
            semesterLabel.textContent = 'Semester (revoked) :';

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

            // Event Listeners
            decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // No longer changing semesters since we're using detected courses
                // Just update the display
                currentSemester = Math.max(1, currentSemester - 1);
                semesterDisplay.textContent = currentSemester;
                decreaseBtn.disabled = (currentSemester <= 1);
                increaseBtn.disabled = false;
            });
            
            increaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // No longer changing semesters since we're using detected courses
                // Just update the display
                currentSemester = currentSemester + 1;
                semesterDisplay.textContent = currentSemester;
                increaseBtn.disabled = (currentSemester >= 8); // Assuming max semester is 8
                decreaseBtn.disabled = false;
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
                    await loadHtml2Pdf();
                    exportButton.disabled = true;
                    exportButton.textContent = 'Exporting...';
                    
                    const element = portlet.querySelector('#course-data-table');
                    if (element) {
                        const opt = {
                            margin: 10,
                            filename: `grades_semester_${currentSemester}.pdf`,
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };
                        
                        await html2pdf().from(element).set(opt).save();
                    }
                } catch (error) {
                    console.error('Export failed:', error);
                } finally {
                    exportButton.disabled = false;
                    exportButton.textContent = 'Export Data';
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
            decreaseBtn.disabled = (currentSemester <= 1);
            increaseBtn.disabled = (currentSemester >= 8); // Assuming max semester is 8

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