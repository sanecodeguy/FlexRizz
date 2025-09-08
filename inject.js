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
            if (!semesterDropdown) return 1;
            
            const selectedOption = semesterDropdown.options[semesterDropdown.selectedIndex];
            const semesterText = selectedOption.textContent.trim();
            
            const semesterMap = {
                'Fall 2024': 1,
                'Spring 2025': 2,
                'Fall 2025': 3,
                'Spring 2026': 4,
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
            table.style.cssText = `
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                background: var(--card-bg);
                font-size: var(--font-size-sm);
                border-radius: var(--border-radius);
                overflow: hidden;
                margin-top: var(--space-md);
                box-shadow: var(--shadow-sm);
            `;

            const headerRow = `
                <thead>
                    <tr>
                        <th style="padding: var(--space-md) var(--space-lg); background: var(--primary-bg); color: var(--text-secondary); font-weight: var(--font-weight-semibold); text-align: left; border-bottom: 2px solid var(--border-color); position: relative;">Course</th>
                        <th style="padding: var(--space-md) var(--space-lg); background: var(--primary-bg); color: var(--text-secondary); font-weight: var(--font-weight-semibold); text-align: left; border-bottom: 2px solid var(--border-color); position: relative;">Type</th>
                        <th style="padding: var(--space-md) var(--space-lg); background: var(--primary-bg); color: var(--text-secondary); font-weight: var(--font-weight-semibold); text-align: left; border-bottom: 2px solid var(--border-color); position: relative;">Avg</th>
                        <th style="padding: var(--space-md) var(--space-lg); background: var(--primary-bg); color: var(--text-secondary); font-weight: var(--font-weight-semibold); text-align: left; border-bottom: 2px solid var(--border-color); position: relative;">Obtained</th>
                        <th style="padding: var(--space-md) var(--space-lg); background: var(--primary-bg); color: var(--text-secondary); font-weight: var(--font-weight-semibold); text-align: left; border-bottom: 2px solid var(--border-color); position: relative;">Total</th>
                        <th style="padding: var(--space-md) var(--space-lg); background: var(--primary-bg); color: var(--text-secondary); font-weight: var(--font-weight-semibold); text-align: left; border-bottom: 2px solid var(--border-color); position: relative;">Grade</th>
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
                    <tr style="transition: var(--transition-fast);">
                        <td style="padding: var(--space-md) var(--space-lg); position: relative;">${name}</td>
                        <td style="padding: var(--space-md) var(--space-lg); position: relative;">${gradingType}</td>
                        <td style="padding: var(--space-md) var(--space-lg); position: relative;">${finalCalculateAverage}</td>
                        <td style="padding: var(--space-md) var(--space-lg); position: relative;">${totalObtMarks.toFixed(2)}</td>
                        <td style="padding: var(--space-md) var(--space-lg); position: relative;">${totalWeightage.toFixed(2)}</td>
                        <td class="${gradeClass}" style="padding: var(--space-md) var(--space-lg); position: relative; font-weight: bold;">${grade}</td>
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
                <tr class="sgpa-row" style="background: rgba(52, 152, 219, 0.08) !important; font-weight: 600 !important;">
                    <td colspan="4" style="text-align: left; padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                    <span class="credit-text">A project by @doubleroote 
                    <svg viewBox="0 0 24 24" aria-label="Verified account" style="color: var(--primary-color); width: 0.9em; height: 0.9em; margin-left: 2px; vertical-align: middle; fill: currentColor;">
                        <g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s-2.52 1.26-3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path></g>
                    </svg>
                    </span>
                    </td>
                    <td style="text-align: right; font-weight: bold; padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">SGPA</td>
                    <td style="font-weight: bold; font-size: 1.1em; padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">${sgpa}</td>
                </tr>
            `;
            tbody.innerHTML += sgpaRow;

            const portletBody = portlet.querySelector('.m-portlet__body');
            if (portletBody) {
                portlet.insertBefore(table, portletBody);
            }
        };

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
            container.style.cssText = `
                display: flex;
                gap: var(--space-md);
                padding: var(--space-lg) var(--space-xl);
                background: var(--card-bg);
                border-bottom: 1px solid var(--border-light);
                flex-wrap: wrap;
                align-items: center;
            `;
            
            // Semester Selector
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

            // Dark Mode Toggle (iOS style)
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
            
            // Add event listener for dark mode toggle
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

            const statsButton = document.createElement('button');
            statsButton.id = 'show-stats-button';
            statsButton.className = 'modern-btn';
            statsButton.innerHTML = 'Show Stats';
            const statsStatus = document.createElement('span');
            statsStatus.className = 'status-indicator status-off';
            statsButton.appendChild(statsStatus);

            container.appendChild(statsButton);
            
            statsButton.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.className = 'stats-modal';
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
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-family)',
                    borderRadius: 'var(--border-radius)'
                });

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
                title.style.color = 'var(--primary-color)';

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

                const content = document.createElement('div');
                content.style.display = 'grid';
                content.style.gap = '20px';

                const courseStats = [];
                
                Object.keys(courses).forEach((code) => {
                    const gradingType = courses[code].grading;
                    const credits = courses[code].credits;
                    const courseLink = document.querySelector(`a.nav-link[href="#${code}"]`);
                    if (!courseLink) return;

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

                    if (wasVisible) {
                        const transcriptButton = portlet.querySelector('#show-transcript-button');
                        if (transcriptButton) transcriptButton.click();
                    }
                });

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
                    tab.style.background = index === 0 ? 'var(--primary-color)' : 'transparent';
                    tab.style.color = index === 0 ? 'var(--text-light)' : 'var(--text-secondary)';
                    tab.style.borderRadius = 'var(--border-radius-sm)';
                    tab.style.cursor = 'pointer';
                    tab.style.whiteSpace = 'nowrap';
                    tab.style.transition = 'all 0.2s';

                    tab.addEventListener('click', () => {
                        // Update all tabs
                        tabsContainer.querySelectorAll('button').forEach((t, i) => {
                            t.style.background = i === index ? 'var(--primary-color)' : 'transparent';
                            t.style.color = i === index ? 'var(--text-light)' : 'var(--text-secondary)';
                        });

                        updateStatsContent(course);
                    });

                    tabsContainer.appendChild(tab);
                });

                const updateStatsContent = (course) => {
                    statsContent.innerHTML = '';

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

                    const overallSection = document.createElement('div');
                    overallSection.style.marginBottom = '20px';
                    overallSection.style.padding = '15px';
                    overallSection.style.background = 'var(--primary-light)';
                    overallSection.style.borderRadius = 'var(--border-radius)';

                    const overallTitle = document.createElement('h5');
                    overallTitle.style.margin = '0 0 10px 0';
                    overallTitle.textContent = 'Overall Performance';
                    overallSection.appendChild(overallTitle);

                    const overallGrid = document.createElement('div');
                    overallGrid.style.display = 'grid';
                    overallGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
                    overallGrid.style.gap = '15px';

                    overallGrid.innerHTML = `
                        <div style="padding: 10px; border-radius: var(--border-radius-sm); background: var(--card-bg);">
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Your Score</div>
                            <div style="font-size: 1.3rem; font-weight: bold;">${course.yourScore.toFixed(2)} / ${course.totalMarks.toFixed(2)}</div>
                        </div>
                        <div style="padding: 10px; border-radius: var(--border-radius-sm); background: var(--card-bg);">
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Your Percentage</div>
                            <div style="font-size: 1.3rem; font-weight: bold;">${course.yourPercentage.toFixed(2)}%</div>
                        </div>
                        <div style="padding: 10px; border-radius: var(--border-radius-sm); background: var(--card-bg);">
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Class Average</div>
                            <div style="font-size: 1.3rem; font-weight: bold;">${course.classAverage.toFixed(2)} / ${course.totalMarks.toFixed(2)}</div>
                        </div>
                        <div style="padding: 10px; border-radius: var(--border-radius-sm); background: var(--card-bg);">
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Class Avg %</div>
                            <div style="font-size: 1.3rem; font-weight: bold;">${course.classAveragePercentage.toFixed(2)}%</div>
                        </div>
                    `;

                    overallSection.appendChild(overallGrid);
                    statsContent.appendChild(overallSection);

                    // Grade explanation
                    const explanationSection = document.createElement('div');
                    explanationSection.style.marginTop = '20px';
                    explanationSection.style.padding = '15px';
                    explanationSection.style.background = 'var(--primary-light)';
                    explanationSection.style.borderRadius = 'var(--border-radius)';
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