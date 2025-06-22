
(function() {

    window.FlexRizz = window.FlexRizz || {};
    function displayActiveUsers() {
        const portletBody = document.querySelector('.portlet-body');
        if (!portletBody) return;

        const activeUsersCount = window.FlexRizz.utils.getActiveUsers();
        
        const activeUsersRow = document.createElement('div');
        activeUsersRow.className = 'active-users-row';
        activeUsersRow.innerHTML = `
            <div style="padding: 10px; background-color: #f8f9fa; border-bottom: 1px solid #ddd;">
                <strong>Active Users:</strong> ${activeUsersCount} users currently using FlexRizz extension
            </div>
        `;
        
        portletBody.parentNode.insertBefore(activeUsersRow, portletBody);
    }

    window.FlexRizz.init = function() {
        // Track the current user's activity
        window.FlexRizz.utils.trackUserActivity();
        
        // Display active users
        displayActiveUsers();
        
    };
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
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Rajdhani:wght@400;500;600;700&display=swap';
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
        const assessmentNameMapping = {
            'Assignment': 'Assignment',
            'Quiz': 'Quiz',
            'Sessional-I': 'Sessional I',
            'Sessional-II': 'Sessional II',
            'Lab Work': 'Lab Work',
            'Project': 'Project',
        };
        function getAssessmentName(row) {
            // Try to find the button first
            const button = row.querySelector('button.btn.btn-link[data-target]');
            if (button) {
                const dataTarget = button.getAttribute('data-target');
                // Extract the last part after the last hyphen
                const assessmentType = dataTarget.split('-').pop();
                console.log(assessmentNameMapping[assessmentType]);
                return assessmentNameMapping[assessmentType] || assessmentType;
            }
            
            // Fallback to existing method
            console
            return row.querySelector('.assessmentName')?.textContent.trim() || 'Assessment';
        }
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
function showToast(message, isSuccess = true) 
{
    const toast = document.createElement('div');
    toast.className = `toast-notification ${isSuccess ? 'toast-success' : 'toast-error'}`;
    
    // Position at bottom-left for better UX (avoids navbar conflicts)
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
        pointerEvents: 'none'
    });
    
    // Add icon
    const icon = document.createElement('span');
    icon.innerHTML = isSuccess ? '✓' : '✗';
    icon.style.fontWeight = 'bold';
    icon.style.fontSize = '1.2em';
    toast.appendChild(icon);
    
    // Add message
    const messageEl = document.createElement('span');
    messageEl.textContent = message;
    toast.appendChild(messageEl);
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
        toast.style.pointerEvents = 'auto';
    }, 10);
    
    // Auto-dismiss after delay
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

const requestCourseButton = document.createElement('button');
    requestCourseButton.id = 'request-course-button';
    requestCourseButton.className = 'modern-btn';
    requestCourseButton.innerHTML = 'Request Course Addition';
    const requestStatus = document.createElement('span');
    requestStatus.className = 'status-indicator status-off';
    requestCourseButton.appendChild(requestStatus);

    // Event handler for the button
    requestCourseButton.addEventListener('click', () => {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'request-course-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'var(--primary-bg)',
            border: '1px solid var(--border-color)',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: '1000',
            width: 'min(90vw, 500px)',
            color: 'var(--text-primary)',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '8px'
        });

        modal.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: var(--accent-color);">Request Course Addition</h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                    Please provide course details below. All fields are required.
                </p>
            </div>
            
            <form id="course-request-form">
                <div class="form-group">
                    <label for="course-code">Course Code</label>
                    <input type="text" id="course-code" required>
                </div>
                
                <div class="form-group">
                    <label for="course-title">Course Title</label>
                    <input type="text" id="course-title" required>
                </div>
                
                <div class="form-group">
                    <label for="grading-type">Grading Type</label>
                    <select id="grading-type" required>
                        <option value="">Select grading type</option>
                        <option value="Absolute">Absolute</option>
                        <option value="Relative">Relative</option>

                    </select>
                </div>
                
                <div class="form-group">
                    <label for="department">Department/Degree</label>
                    <select id="department" required>
                        <option value="">Select department</option>
                        <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="AI">AI</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="credit-hours">Credit Hours</label>
                    <input type="number" id="credit-hours" min="2" max="3" step="1" required>
                </div>
                
                <div class="form-group" style="display: flex; align-items: center;">
                    <label style="margin-right: 15px;">Includes Lab?</label>
                    <div class="toggle-switch">
                        <input type="checkbox" id="lab-included" hidden>
                        <label for="lab-included" class="toggle-label"></label>
                    </div>
                </div>
                
                <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
                    <button type="button" id="cancel-request" class="modern-btn" style="background: transparent; color: var(--text-primary); border: 1px solid var(--border-color);">
                        rehn do
                    </button>
                    <button type="submit" class="modern-btn" style="background: var(--carbon); color: var(--text-primary);border: 1px solid var(--border-color);">
                        Request Rizz
                    </button>
                </div>
            </form>
        `;

        document.body.appendChild(modal);

        // Create backdrop
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

        // Form submission handler
        const form = modal.querySelector('#course-request-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const requestData = {
                courseCode: document.getElementById('course-code').value.trim(),
                courseTitle: document.getElementById('course-title').value.trim(),
                gradingType: document.getElementById('grading-type').value,
                department: document.getElementById('department').value,
                creditHours: parseFloat(document.getElementById('credit-hours').value),
                hasLab: document.getElementById('lab-included').checked
            };
            
            // Validate all fields
            if (!requestData.courseCode || 
                !requestData.courseTitle || 
                !requestData.gradingType || 
                !requestData.department || 
                isNaN(requestData.creditHours)) {
                showToast('Please fill all required fields', false);
                return;
            }
            
            // Log the request to console
            console.log('Course Addition Request:', requestData);
            
            // Show success notification
            showToast('Request sent successfully');
            
            // Close modal
            modal.remove();
            backdrop.remove();
        });

        // Cancel button handler
        modal.querySelector('#cancel-request').addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });

        // Close when clicking backdrop
        backdrop.addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });
    });

    // Add the new button to the container
    container.appendChild(requestCourseButton);
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
           
             // In the createToggleButtons function, replace the export button with:
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
    const table = portlet.querySelector('#course-data-table');
    
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr:not(.sgpa-row)');
    rows.forEach(row => {
        const obtainedCell = row.querySelector('td:nth-child(4)');
        const gradeCell = row.querySelector('td:nth-child(6)');
        const totalMarks = parseFloat(row.querySelector('td:nth-child(5)').textContent);
        
        if (editModeActive) {
            // Enter edit mode
            const originalValue = obtainedCell.textContent;
            obtainedCell.classList.add('editable-cell');
            
            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.01';
            input.min = 0;
            input.max = totalMarks;
            input.value = originalValue;
            
            obtainedCell.textContent = '';
            obtainedCell.appendChild(input);

            // Update grade when input changes
            input.addEventListener('input', () => {
                const newValue = parseFloat(input.value) || 0;
                const courseName = row.querySelector('td:first-child').textContent;
                const courseEntry = Object.entries(courses).find(([_, course]) => course.name === courseName);
                
                if (courseEntry) {
                    const [code, courseData] = courseEntry;
                    let grade = "I";
                    
                    if (courseData.grading === "Absolute") {
                        const percentage = (newValue / totalMarks) * 100;
                        grade = window.gradeUtils.calculateAbsoluteGrade(percentage);
                    } else if (courseData.grading === "Relative") {
                        const classAverage = parseFloat(row.querySelector('td:nth-child(3)').textContent);
                        const percentage = (newValue / totalMarks) * 100;
                        const mca = (classAverage / totalMarks) * 100;
                        grade = window.gradeUtils.getGrade(mca, percentage)[0];
                    }
                    
                    const gradeClass = window.gradeUtils.getGradeClass(grade);
                    gradeCell.className = gradeClass;
                    gradeCell.textContent = grade;
                    
                    // Update SGPA
                    updateSGPA();
                }
            });
        } else {
            // Exit edit mode
            const input = obtainedCell.querySelector('input');
            if (input) {
                obtainedCell.textContent = parseFloat(input.value).toFixed(2);
                obtainedCell.classList.remove('editable-cell');
            }
        }
    });

    // Update button state
    editMarksButton.innerHTML = editModeActive ? 'Exit Edit' : 'Edit Marks';
    editMarksStatus.className = `status-indicator ${editModeActive ? 'status-on' : 'status-off'}`;
    
    // If exiting edit mode, recreate table to ensure consistency
    if (!editModeActive) {
        createTable();
    }
});


            
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
            increaseBtn.disabled = (currentSemester >= 8); 

            // Add all buttons to container
            container.appendChild(semesterContainer);
            container.appendChild(transcriptButton);
            container.appendChild(roundingButton);
            container.appendChild(editMarksButton);
            container.appendChild(customGradesButton);

            const portletBody = portlet.querySelector('.m-portlet__body');
            if (portletBody) {
                portlet.insertBefore(container, portletBody);
            }

const statsButton = document.createElement('button');
statsButton.id = 'show-stats-button';
statsButton.className = 'modern-btn';
statsButton.innerHTML = 'Show Stats';
const statsStatus = document.createElement('span');
statsStatus.className = 'status-indicator status-off';
statsButton.appendChild(statsStatus);

// Add the button to the container
container.appendChild(statsButton);
statsButton.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'stats-modal';
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
        maxHeight: '80vh',
        overflowY: 'auto',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', sans-serif",
        borderRadius: '8px'
    });

    // Modal header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '15px';
    header.style.paddingBottom = '10px';
    header.style.borderBottom = '1px solid var(--border-color)';

    const title = document.createElement('h3');
    title.textContent = 'Course Statistics';
    title.style.margin = '0';
    title.style.color = 'var(--accent-color)';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'var(--text-secondary)';

    header.appendChild(title);
    header.appendChild(closeButton);
    modal.appendChild(header);

    // Stats content
    const content = document.createElement('div');
    content.style.display = 'grid';
    content.style.gap = '20px';

    // Collect all course data first
    const courseStats = [];
    
    Object.keys(courses).forEach((code) => {
        const gradingType = courses[code].grading;
        const credits = courses[code].credits;
        const courseLink = document.querySelector(`a.nav-link[href="#${code}"]`);
        if (!courseLink) return;

        // Temporarily click to get the data
        const wasVisible = tableVisible;
        if (wasVisible) {
            const transcriptButton = portlet.querySelector('#show-transcript-button');
            if (transcriptButton) transcriptButton.click();
        }
        
        courseLink.click();

        const activeDiv = document.querySelector('.tab-pane.active');
        if (!activeDiv) return;

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
                   const assessmentName=getAssessmentName(row);
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
            const percentage = (finalMarks / totalWeightage) * 100;            
            grade = window.gradeUtils.calculateAbsoluteGrade(percentage);
        }
        else if (gradingType === "Relative") {
            const percentage = Math.round((finalMarks / totalWeightage) * 100);
            const mca = Math.round((totalAverage / totalWeightage) * 100);
            grade = window.gradeUtils.getGrade(mca, percentage)[0];
        }

        courseStats.push({
            code: code,
            name: courses[code].name,
            gradingType: gradingType,
            classAverage: finalCalculateAverage,
            yourScore: finalMarks,
            totalMarks: totalWeightage,
            grade: grade,
            credits: credits,
            assessments: assessmentDetails,
            yourPercentage: (finalMarks / totalWeightage) * 100,
            classAveragePercentage: (finalCalculateAverage / totalWeightage) * 100
        });

        // Restore previous state
        if (wasVisible) {
            const transcriptButton = portlet.querySelector('#show-transcript-button');
            if (transcriptButton) transcriptButton.click();
        }
    });

    // Create tabs for each course
    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.gap = '5px';
    tabsContainer.style.marginBottom = '15px';
    tabsContainer.style.overflowX = 'auto';
    tabsContainer.style.paddingBottom = '5px';

    const statsContent = document.createElement('div');
    statsContent.style.minHeight = '400px';

    courseStats.forEach((course, index) => {
        const tab = document.createElement('button');
        tab.textContent = course.code;
        tab.style.padding = '8px 12px';
        tab.style.border = '1px solid var(--border-color)';
        tab.style.background = index === 0 ? 'var(--carbon)' : 'transparent';
        tab.style.color = index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)';
        tab.style.borderRadius = '4px';
        tab.style.cursor = 'pointer';
        tab.style.whiteSpace = 'nowrap';
        tab.style.transition = 'all 0.2s';

        tab.addEventListener('click', () => {
            // Update all tabs
            tabsContainer.querySelectorAll('button').forEach((t, i) => {
                t.style.background = i === index ? 'var(--carbon)' : 'transparent';
                t.style.color = i === index ? 'var(--text-primary)' : 'var(--text-secondary)';
            });

            // Update content
            updateStatsContent(course);
        });

        tabsContainer.appendChild(tab);
    });

    // Function to update stats content
    const updateStatsContent = (course) => {
        statsContent.innerHTML = '';

        // Course header
        const courseHeader = document.createElement('div');
        courseHeader.style.marginBottom = '20px';
        courseHeader.style.paddingBottom = '10px';
        courseHeader.style.borderBottom = '1px solid var(--border-color)';

        const courseTitle = document.createElement('h4');
        courseTitle.style.margin = '0 0 5px 0';
        courseTitle.textContent = `${course.name} (${course.code})`;
        
        const courseSubtitle = document.createElement('div');
        courseSubtitle.style.display = 'flex';
        courseSubtitle.style.gap = '15px';
        courseSubtitle.style.fontSize = '0.9rem';
        courseSubtitle.style.color = 'var(--text-secondary)';

        courseSubtitle.innerHTML = `
            <span>Credits: ${course.credits}</span>
            <span>Grading: ${course.gradingType}</span>
            <span>Grade: <span class="${window.gradeUtils.getGradeClass(course.grade)}" style="font-weight: bold;">${course.grade}</span></span>
        `;

        courseHeader.appendChild(courseTitle);
        courseHeader.appendChild(courseSubtitle);
        statsContent.appendChild(courseHeader);

        // Overall performance
        const overallSection = document.createElement('div');
        overallSection.style.marginBottom = '20px';
        overallSection.style.padding = '15px';
        overallSection.style.background = 'var(--elevated-black)';
        overallSection.style.borderRadius = '6px';

        const overallTitle = document.createElement('h5');
        overallTitle.style.margin = '0 0 10px 0';
        overallTitle.textContent = 'Overall Performance';
        overallSection.appendChild(overallTitle);

        const overallGrid = document.createElement('div');
        overallGrid.style.display = 'grid';
        overallGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        overallGrid.style.gap = '15px';

        overallGrid.innerHTML = `
            <div style="padding: 10px; border-radius: 4px; background: var(--primary-bg);">
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Your Score</div>
                <div style="font-size: 1.3rem; font-weight: bold;">${course.yourScore.toFixed(2)} / ${course.totalMarks.toFixed(2)}</div>
            </div>
            <div style="padding: 10px; border-radius: 4px; background: var(--primary-bg);">
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Your Percentage</div>
                <div style="font-size: 1.3rem; font-weight: bold;">${course.yourPercentage.toFixed(2)}%</div>
            </div>
            <div style="padding: 10px; border-radius: 4px; background: var(--primary-bg);">
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Class Average</div>
                <div style="font-size: 1.3rem; font-weight: bold;">${course.classAverage.toFixed(2)} / ${course.totalMarks.toFixed(2)}</div>
            </div>
            <div style="padding: 10px; border-radius: 4px; background: var(--primary-bg);">
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Class Avg %</div>
                <div style="font-size: 1.3rem; font-weight: bold;">${course.classAveragePercentage.toFixed(2)}%</div>
            </div>
        `;

        overallSection.appendChild(overallGrid);
        statsContent.appendChild(overallSection);

        // Chart section
        const chartSection = document.createElement('div');
        chartSection.style.marginBottom = '20px';
        chartSection.style.padding = '15px';
        chartSection.style.background = 'var(--elevated-black)';
        chartSection.style.borderRadius = '6px';

        const chartTitle = document.createElement('h5');
        chartTitle.style.margin = '0 0 10px 0';
        chartTitle.textContent = 'Performance Visualization';
        chartSection.appendChild(chartTitle);

        // Create container for charts
        const chartsContainer = document.createElement('div');
        chartsContainer.style.display = 'grid';
        chartsContainer.style.gridTemplateColumns = '1fr 1fr';
        chartsContainer.style.gap = '20px';
        chartsContainer.style.marginBottom = '20px';

        // 1. Donut Chart
        const donutContainer = document.createElement('div');
        donutContainer.style.position = 'relative';
        donutContainer.style.height = '200px';

        const colorPalette = [
            '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', 
            '#FFC107', '#FF9800', '#FF5722', '#F44336',
            '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
            '#2196F3', '#03A9F4', '#00BCD4', '#009688'
        ];

        const donutChart = document.createElement('div');
        donutChart.style.width = '180px';
        donutChart.style.height = '180px';
        donutChart.style.borderRadius = '50%';
        donutChart.style.position = 'relative';
        donutChart.style.margin = '0 auto';
        donutChart.style.overflow = 'hidden';
        donutChart.style.background = 'conic-gradient(' +
            `${colorPalette[0]} 0% ${course.yourPercentage}%, ` +
            `${colorPalette[12]} ${course.yourPercentage}% 100%)`;
        donutChart.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';

        // Center text
        const donutCenter = document.createElement('div');
        donutCenter.style.position = 'absolute';
        donutCenter.style.top = '50%';
        donutCenter.style.left = '50%';
        donutCenter.style.transform = 'translate(-50%, -50%)';
        donutCenter.style.width = '100px';
        donutCenter.style.height = '100px';
        donutCenter.style.borderRadius = '50%';
        donutCenter.style.background = 'var(--elevated-black)';
        donutCenter.style.display = 'flex';
        donutCenter.style.flexDirection = 'column';
        donutCenter.style.alignItems = 'center';
        donutCenter.style.justifyContent = 'center';
        donutCenter.style.fontWeight = 'bold';

        donutCenter.innerHTML = `
            <div style="font-size: 1.5rem; color: ${colorPalette[0]}">${course.yourPercentage.toFixed(1)}%</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary)">Your Score</div>
        `;

        donutChart.appendChild(donutCenter);
        donutContainer.appendChild(donutChart);

        // Donut chart legend
        const donutLegend = document.createElement('div');
        donutLegend.style.display = 'flex';
        donutLegend.style.justifyContent = 'center';
        donutLegend.style.gap = '15px';
        donutLegend.style.marginTop = '10px';

        donutLegend.innerHTML = `
            <div style="display: flex; align-items: center; font-size: 0.8rem;">
                <div style="width: 12px; height: 12px; background: ${colorPalette[0]}; border-radius: 2px; margin-right: 5px;"></div>
                You (${course.yourPercentage.toFixed(1)}%)
            </div>
            <div style="display: flex; align-items: center; font-size: 0.8rem;">
                <div style="width: 12px; height: 12px; background: ${colorPalette[12]}; border-radius: 2px; margin-right: 5px;"></div>
                Remaining
            </div>
        `;

        donutContainer.appendChild(donutLegend);
        chartsContainer.appendChild(donutContainer);

        // 2. Heatmap
        const heatmapContainer = document.createElement('div');
        heatmapContainer.style.height = '200px';

        if (course.assessments.length > 0) {
            const heatmap = document.createElement('div');
            heatmap.style.display = 'grid';
            heatmap.style.gridTemplateColumns = `repeat(${Math.min(course.assessments.length, 8)}, 1fr)`;
            heatmap.style.gap = '5px';
            heatmap.style.height = '100%';
            heatmap.style.minHeight = '150px'; // Ensure minimum height
            
            // Calculate max and min for color scaling with fallbacks
            const percentages = course.assessments.map(a => a.percentage).filter(p => !isNaN(p));
            const maxPct = percentages.length > 0 ? Math.max(...percentages, 1) : 100;
            const minPct = percentages.length > 0 ? Math.min(...percentages, 0) : 0;
            
            
            course.assessments.forEach((assessment, i) => {
                const cell = document.createElement('div');
                cell.style.position = 'relative';
                cell.style.borderRadius = '4px';
                cell.style.display = 'flex';
                cell.style.flexDirection = 'column';
                cell.style.justifyContent = 'flex-end';
                cell.style.alignItems = 'center';
                cell.style.padding = '5px';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'all 0.2s';
                
                const percentage = isNaN(assessment.percentage) ? 0 : assessment.percentage;
                const normalized = maxPct !== minPct ? (percentage - minPct) / (maxPct - minPct) : 0.5;
                const hue = Math.max(0, Math.min(120, normalized * 120)); // Reverse the hue calculation
                const color = `hsl(${hue}, 70%, 50%)`;
                
                cell.style.background = color;
                cell.style.opacity = 0.8;
                cell.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                
                cell.innerHTML = `
                    <div style="font-size: 0.7rem; font-weight: bold; color: white; text-align: center; margin-bottom: 5px;">
                        ${assessment.percentage.toFixed(0)}%
                    </div>
                    <div style="font-size: 0.6rem; color: rgba(255,255,255,0.9); text-align: center; word-break: break-word;">
                        ${assessment.name.split(' ')[0]}
                    </div>
                `;
                
                // Tooltip on hover
                cell.addEventListener('mouseenter', () => {
                    cell.style.transform = 'scale(1.05)';
                    cell.style.opacity = '1';
                    cell.style.zIndex = '1';
                    
                    const tooltip = document.createElement('div');
                    tooltip.style.position = 'absolute';
                    tooltip.style.bottom = '100%';
                    tooltip.style.left = '50%';
                    tooltip.style.transform = 'translateX(-50%)';
                    tooltip.style.background = 'var(--carbon)';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px 10px';
                    tooltip.style.borderRadius = '4px';
                    tooltip.style.fontSize = '0.8rem';
                    tooltip.style.whiteSpace = 'nowrap';
                    tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    tooltip.style.marginBottom = '5px';
                    tooltip.textContent = `${assessment.name}: ${assessment.percentage.toFixed(1)}% (Class: ${assessment.classAveragePercentage.toFixed(1)}%)`;
                    
                    cell.appendChild(tooltip);
                });
                
                cell.addEventListener('mouseleave', () => {
                    cell.style.transform = '';
                    cell.style.opacity = '0.8';
                    const tooltip = cell.querySelector('div:last-child');
                    if (tooltip) tooltip.remove();
                });
                
                heatmap.appendChild(cell);
            });
            if (course.assessments.length === 0) {
                heatmapContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary)">No assessment data available</p>';
            }
            
            heatmapContainer.appendChild(heatmap);
            
            // Heatmap legend
            const heatmapLegend = document.createElement('div');
            heatmapLegend.style.display = 'flex';
            heatmapLegend.style.justifyContent = 'center';
            heatmapLegend.style.marginTop = '10px';
            heatmapLegend.style.fontSize = '0.8rem';
            
            heatmapLegend.innerHTML = `
                <div style="display: flex; align-items: center; margin-right: 15px;">
                    <span style="margin-right: 5px;">Low</span>
                    <div style="width: 60px; height: 10px; background: linear-gradient(to right, #FF5722, #4CAF50); border-radius: 5px;"></div>
                    <span style="margin-left: 5px;">High</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background: #607D8B; border-radius: 2px; margin-right: 5px;"></div>
                    Hover for details
                </div>
            `;
            
            heatmapContainer.appendChild(heatmapLegend);
        } else {
            heatmapContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary)">No assessment data available</p>';
        }

        chartsContainer.appendChild(heatmapContainer);
        chartSection.appendChild(chartsContainer);

        // 3. Bar Chart
        const barChartContainer = document.createElement('div');
        barChartContainer.style.height = '200px';
        barChartContainer.style.position = 'relative';
        barChartContainer.style.marginTop = '20px';

        const maxPercentage = Math.max(100, course.yourPercentage, course.classAveragePercentage);
        const yourBarHeight = Math.max(5, (course.yourPercentage / maxPercentage) * 100);
        const avgBarHeight = Math.max(5, (course.classAveragePercentage / maxPercentage) * 100);

        barChartContainer.innerHTML = `
            <div style="display: flex; height: 100%; align-items: flex-end; gap: 40px; justify-content: center; padding: 0 20px;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; flex: 1; max-width: 100px;">
                    <div style="width: 100%; background: linear-gradient(to bottom, ${colorPalette[0]}, ${colorPalette[1]}); 
                        border-radius: 6px 6px 0 0; height: ${yourBarHeight}%; position: relative; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="position: absolute; top: -25px; left: 0; right: 0; text-align: center; 
                            font-size: 0.9rem; font-weight: bold; color: ${colorPalette[0]};">${course.yourPercentage.toFixed(1)}%</div>
                    </div>
                    <div style="font-size: 0.9rem; font-weight: 500;">You</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; flex: 1; max-width: 100px;">
                    <div style="width: 100%; background: linear-gradient(to bottom, ${colorPalette[12]}, ${colorPalette[13]}); 
                        border-radius: 6px 6px 0 0; height: ${avgBarHeight}%; position: relative; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="position: absolute; top: -25px; left: 0; right: 0; text-align: center; 
                            font-size: 0.9rem; font-weight: bold; color: ${colorPalette[12]};">${course.classAveragePercentage.toFixed(1)}%</div>
                    </div>
                    <div style="font-size: 0.9rem; font-weight: 500;">Class Avg</div>
                </div>
            </div>
            <div style="position: absolute; bottom: 30px; left: 0; right: 0; height: 2px; 
                background: var(--border-color); z-index: -1;"></div>
        `;

        chartSection.appendChild(barChartContainer);
        statsContent.appendChild(chartSection);

        // Assessment breakdown
        if (course.assessments.length > 0) {
            const breakdownSection = document.createElement('div');
            breakdownSection.style.marginBottom = '10px';

            const breakdownTitle = document.createElement('h5');
            breakdownTitle.style.margin = '0 0 10px 0';
            breakdownTitle.textContent = 'Assessment Breakdown';
            breakdownSection.appendChild(breakdownTitle);

            const breakdownTable = document.createElement('table');
            breakdownTable.style.width = '100%';
            breakdownTable.style.borderCollapse = 'collapse';
            breakdownTable.innerHTML = `
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="text-align: left; padding: 8px 10px;">Assessment</th>
                        <th style="text-align: right; padding: 8px 10px;">Weight</th>
                        <th style="text-align: right; padding: 8px 10px;">Your Score</th>
                        <th style="text-align: right; padding: 8px 10px;">Class Avg</th>
                        <th style="text-align: right; padding: 8px 10px;">% Diff</th>
                    </tr>
                </thead>
                <tbody>
                    ${course.assessments.map(assessment => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px 10px;">${assessment.name}</td>
                            <td style="text-align: right; padding: 8px 10px;">${assessment.weight}%</td>
                            <td style="text-align: right; padding: 8px 10px;">${assessment.yourScore}/${assessment.totalMarks}</td>
                            <td style="text-align: right; padding: 8px 10px;">${assessment.classAverage.toFixed(1)}/${assessment.totalMarks}</td>
                            <td style="text-align: right; padding: 8px 10px; color: ${assessment.percentage > assessment.classAveragePercentage ? '#4CAF50' : '#F44336'}">
                                ${(assessment.percentage - assessment.classAveragePercentage).toFixed(1)}%
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            breakdownSection.appendChild(breakdownTable);
            statsContent.appendChild(breakdownSection);
        }

        // Grade explanation
        const explanationSection = document.createElement('div');
        explanationSection.style.marginTop = '20px';
        explanationSection.style.padding = '15px';
        explanationSection.style.background = 'var(--elevated-black)';
        explanationSection.style.borderRadius = '6px';
        explanationSection.style.fontSize = '0.9rem';

        explanationSection.innerHTML = `
            <h5 style="margin: 0 0 10px 0;">Grade Explanation</h5>
            <p style="margin: 0;">
                This course uses <strong>${course.gradingType} grading</strong>. 
                ${course.gradingType === 'Absolute' ? 
                    'Your grade is determined by fixed percentage thresholds regardless of class performance.' : 
                    'Your grade is determined relative to the class average performance.'}
            </p>
        `;

        statsContent.appendChild(explanationSection);
    };

    // Initialize with first course
    if (courseStats.length > 0) {
        updateStatsContent(courseStats[0]);
    } else {
        statsContent.innerHTML = '<p>No course data available</p>';
    }

    modal.appendChild(tabsContainer);
    modal.appendChild(statsContent);

    // Backdrop
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
    document.body.appendChild(modal);

    // Close handlers
    closeButton.addEventListener('click', () => {
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
        };
        
        createToggleButtons();
    }

})();
