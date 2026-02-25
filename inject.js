(function() {
    window.FlexRizz = window.FlexRizz || {};

    window.FlexRizz.init = function() {};
    
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
    imageContainer.style.background = "var(--surface-1)";
    imageContainer.style.padding = "0px";
    imageContainer.style.border = "1px solid var(--border)";
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
        // Per-course weightage overrides persisted in localStorage
        const WEIGHT_OVERRIDES_KEY = 'flexrizz_weight_overrides_v1';
        let weightOverrides = {};
        try {
            const raw = localStorage.getItem(WEIGHT_OVERRIDES_KEY);
            weightOverrides = raw ? JSON.parse(raw) : {};
        } catch (e) {
            weightOverrides = {};
        }
        const saveWeightOverrides = () => {
            try { localStorage.setItem(WEIGHT_OVERRIDES_KEY, JSON.stringify(weightOverrides)); } catch (_) {}
        };
        
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
            "DS2001": { name: "Introduction to Data Science", grading: "Absolute", credits: 3, semester: 3},
            "DL2001": { name: "Introduction to Data Science Lab", grading: "Absolute", credits: 1, semester: 3},
            "MT2005": { name: "Probability and Statistics", grading: "Relative", credits: 3, semester: 4},
            "SS2044": { name: "International Relations", grading: "Relative", credits: 2, semester: 3},
            "AI2002": { name: "AI", grading: "Absolute", credits: 3, semester: 4},
            "AL2002": { name: "AI Lab", grading: "Absolute", credits: 1, semester: 4},
            "CL2005": { name: "DB Lab", grading: "Absolute", credits: 1, semester: 4},
            "CL2006": { name: "OS Lab", grading: "Absolute", credits: 1, semester: 4},
            "CS2005": { name: "DB", grading: "Absolute", credits: 3, semester: 4},
            "CS2006": { name: "OS", grading: "Absolute", credits: 3, semester: 4},
            "CS3004": { name: "SDA", grading: "Absolute", credits: 3, semester: 4},
            "SS1015": { name: "Pakistan Studies", grading: "Absolute", credits: 3, semester: 4},
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

            const headerRow = `
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Type</th>
                        <th>Avg</th>
                        <th>Obtained</th>
                        <th>Total</th>
                        <th>Grade</th>
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
                        <td><span style="display:inline-block;padding:2px 8px;border-radius:var(--radius-pill);font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;background:${gradingType === 'Absolute' ? 'rgba(96,165,250,0.12)' : 'rgba(251,191,36,0.12)'};color:${gradingType === 'Absolute' ? 'var(--grade-B)' : 'var(--grade-C)'}">${gradingType}</span></td>
                        <td style="color:var(--text-2);">${finalCalculateAverage}</td>
                        <td style="font-weight:600;">${totalObtMarks.toFixed(2)}</td>
                        <td style="color:var(--text-2);">${totalWeightage.toFixed(2)}</td>
                        <td class="${gradeClass}" style="font-weight:700;font-size:0.9375rem;">${grade}</td>
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

                // Helper: compute totals using overrides if present for this course
                const computeWithOverridesIfAny = () => {
                    const ovr = weightOverrides[code];
                    if (!ovr) return false;

                    // Collect all assessment rows in active course pane
                    const rows = activeDiv.querySelectorAll('.sum_table .calculationrow');
                    if (!rows || rows.length === 0) return false;

                    // Count occurrences for distributions
                    let quizCount = 0, assignCount = 0;
                    const distRows = [];
                    rows.forEach(row => {
                        const weightRow = row.querySelector('.weightage');
                        const averageRow = row.querySelector('.AverageMarks');
                        const totalMarksRow = row.querySelector('.GrandTotal');
                        if (!averageRow || !totalMarksRow) return;
                        const total = parseFloat(totalMarksRow.textContent) || 0;
                        if (total === 0) return;
                        const name = getAssessmentName(row);
                        if (name.toLowerCase().includes('quiz')) quizCount++;
                        if (name.toLowerCase().includes('assignment')) assignCount++;
                        distRows.push({ row, name });
                    });

                    // Assigned weights per type
                    const sess1 = ovr.sessionalI || 0;
                    const sess2 = ovr.sessionalII || 0;
                    const finalW = ovr.finalTotal || 0;
                    const projW = ovr.project || 0;
                    const labW = ovr.labWork || 0;
                    const quizTotal = ovr.quizzesTotal || 0;
                    const assignTotal = ovr.assignmentsTotal || 0;

                    let localTotalWeightage = 0;
                    let localTotalObt = 0;
                    let localTotalAvg = 0;

                    const quizPer = quizCount > 0 ? quizTotal / quizCount : 0;
                    const assignPer = assignCount > 0 ? assignTotal / assignCount : 0;

                    distRows.forEach(({ row, name }) => {
                        const averageRow = row.querySelector('.AverageMarks');
                        const totalMarksRow = row.querySelector('.GrandTotal');
                        const obtMarksRow = row.querySelector('.ObtMarks');
                        const total = parseFloat(totalMarksRow.textContent) || 0;
                        const avg = parseFloat(averageRow.textContent) || 0;
                        const obt = parseFloat(obtMarksRow.textContent) || 0;

                        let assigned = 0;
                        const low = name.toLowerCase();
                        if (low.includes('sessional') && low.includes('i') && !low.includes('ii')) {
                            assigned = sess1;
                        } else if (low.includes('sessional') && low.includes('ii')) {
                            assigned = sess2;
                        } else if (low.includes('quiz')) {
                            assigned = quizPer;
                        } else if (low.includes('assignment')) {
                            assigned = assignPer;
                        } else if (low.includes('project')) {
                            assigned = projW;
                        } else if (low.includes('lab')) {
                            assigned = labW;
                        } else if (low.includes('final')) {
                            assigned = finalW;
                        }

                        if (assigned > 0) {
                            localTotalWeightage += assigned;
                            localTotalObt += (obt / total) * assigned;
                            localTotalAvg += (avg / total) * assigned;
                        }
                    });

                    if (localTotalWeightage > 0) {
                        totalWeightage = localTotalWeightage;
                        totalObtMarks = localTotalObt;
                        totalAverage = localTotalAvg;
                        return true;
                    }
                    return false;
                };

                const tables = activeDiv.querySelectorAll('.sum_table');
                // If overrides exist and can compute, use them and skip portal totals
                let usedOverrides = computeWithOverridesIfAny();
                if (!usedOverrides) {
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
                }

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
                    <td colspan="4" style="text-align:left;">
                    <span style="color:var(--text-2);font-size:0.8125rem;">A project by @doubleroote 
                    <svg viewBox="0 0 24 24" aria-label="Verified account" style="color:var(--accent);width:0.9em;height:0.9em;margin-left:2px;vertical-align:middle;fill:currentColor;">
                        <g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s-2.52 1.26-3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path></g>
                    </svg>
                    </span>
                    </td>
                    <td style="text-align:right;font-weight:700;color:var(--accent);">SGPA</td>
                    <td style="font-weight:700;font-size:1.15em;color:var(--accent);">${sgpa}</td>
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
                padding: '12px 20px',
                borderRadius: 'var(--radius)',
                color: '#fff',
                boxShadow: 'var(--shadow-lg)',
                zIndex: '10000',
                opacity: '0',
                transform: 'translateY(8px)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'none',
                fontSize: '0.875rem',
                fontFamily: 'var(--font)',
                background: isSuccess ? 'var(--success)' : 'var(--danger)',
                backdropFilter: 'blur(12px)'
            });
            
            const icon = document.createElement('span');
            icon.textContent = isSuccess ? '\u2713' : '\u2717';
            icon.style.fontWeight = 'bold';
            toast.appendChild(icon);
            
            const messageEl = document.createElement('span');
            messageEl.textContent = message;
            toast.appendChild(messageEl);
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 10);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(8px)';
                setTimeout(() => toast.remove(), 350);
            }, 3500);
        }

        const updateWeightageButtonStatus = () => {
            const activeCode = getActiveCourseCode();
            if (activeCode && weightOverrides[activeCode]) {
                fixWeightBtn.innerHTML = 'Fix Weightage <span class="status-indicator status-on"></span>';
                fixWeightBtn.classList.add('active');
            } else {
                fixWeightBtn.innerHTML = 'Fix Weightage <span class="status-indicator status-off"></span>';
                fixWeightBtn.classList.remove('active');
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

            const semesterLabel = document.createElement('span');
            semesterLabel.style.cssText = 'color:var(--text-2);font-size:0.8125rem;font-weight:500;';
            semesterLabel.textContent = 'Semester';

            const decreaseBtn = document.createElement('button');
            decreaseBtn.innerHTML = '&minus;';
            decreaseBtn.className = 'semester-btn';

            const semesterDisplay = document.createElement('span');
            semesterDisplay.className = 'semester-display';
            semesterDisplay.style.cssText = 'min-width:24px;text-align:center;font-weight:700;color:var(--accent);font-size:0.9375rem;';
            semesterDisplay.textContent = currentSemester;

            const increaseBtn = document.createElement('button');
            increaseBtn.innerHTML = '+';
            increaseBtn.className = 'semester-btn';

            // Dark Mode Toggle (iOS style)
            const darkModeContainer = document.createElement('div');
            darkModeContainer.className = 'dark-mode-toggle-container';
            
            const darkModeLabel = document.createElement('span');
            darkModeLabel.className = 'dark-mode-toggle-label';
            darkModeLabel.textContent = 'Dark';
            
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

            // Update weightage status on course tab click
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link') && e.target.getAttribute('href')?.startsWith('#')) {
                    setTimeout(updateWeightageButtonStatus, 100);
                }
            });

            setTimeout(updateWeightageButtonStatus, 1000);

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
                    backgroundColor: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: '1000',
                    width: 'min(90vw, 800px)',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    color: 'var(--text-1)',
                    fontFamily: 'var(--font)',
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                    gap: '16px',
                    borderRadius: 'var(--radius)'
                });

                modal.innerHTML = `
                    <div style="border-bottom:1px solid var(--border);padding-bottom:12px;">
                        <h3 style="margin:0;color:var(--accent);font-size:1.15rem;font-weight:700;">
                            Custom Grades
                        </h3>
                        <p style="margin:6px 0 0;color:var(--text-3);font-size:0.8125rem;">
                            Enter custom grades for each course
                        </p>
                    </div>
                    
                    <div class="grade-inputs-container" style="overflow-y:auto;padding-right:5px;">
                        <div class="grade-inputs-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;">
                            ${Object.entries(courses).map(([code, course]) => `
                                <div style="display:flex;align-items:center;gap:10px;">
                                    <label style="color:var(--text-2);font-size:0.8125rem;min-width:110px;font-weight:500;">
                                        ${course.name} (${code}):
                                    </label>
                                    <input type="text" class="grade-input" id="${code}-grade" 
                                           placeholder="${currentCustomGrades[code] || 'Auto'}"
                                           value="${currentCustomGrades[code] || ''}"
                                           style="background:var(--surface-2);border:1px solid var(--border);color:var(--text-1);padding:8px 12px;width:100%;text-align:center;border-radius:var(--radius-sm);font-family:var(--font);font-weight:600;font-size:0.875rem;">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:12px;border-top:1px solid var(--border);">
                        <button id="cancel-custom-grades" class="modern-btn secondary">Cancel</button>
                        <button id="apply-custom-grades" class="modern-btn" style="background:var(--accent);color:var(--text-inv);border-color:var(--accent);">Apply</button>
                    </div>
                `;

                document.body.appendChild(modal);

                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                Object.assign(backdrop.style, {
                    position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
                    background: 'rgba(0, 0, 0, 0.6)', zIndex: '999', backdropFilter: 'blur(4px)'
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
                
                cancelBtn.addEventListener('click', () => { modal.remove(); backdrop.remove(); });
                backdrop.addEventListener('click', () => { modal.remove(); backdrop.remove(); });
                document.addEventListener('keydown', function handleKeyDown(e) {
                    if (e.key === 'Escape') {
                        modal.remove(); backdrop.remove();
                        document.removeEventListener('keydown', handleKeyDown);
                    }
                });
            });

            decreaseBtn.disabled = (currentSemester <= 1);
            increaseBtn.disabled = (currentSemester >= 8); 

            // Download PDF Button
            const downloadPdfButton = document.createElement('button');
            downloadPdfButton.id = 'download-pdf-button';
            downloadPdfButton.className = 'modern-btn';
            downloadPdfButton.innerHTML = 'Download PDF';
            const pdfIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            pdfIcon.setAttribute('width', '14');
            pdfIcon.setAttribute('height', '14');
            pdfIcon.setAttribute('viewBox', '0 0 24 24');
            pdfIcon.setAttribute('fill', 'none');
            pdfIcon.setAttribute('stroke', 'currentColor');
            pdfIcon.setAttribute('stroke-width', '2');
            pdfIcon.setAttribute('stroke-linecap', 'round');
            pdfIcon.setAttribute('stroke-linejoin', 'round');
            pdfIcon.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
            downloadPdfButton.prepend(pdfIcon);

            downloadPdfButton.addEventListener('click', async () => {
                const table = portlet.querySelector('#course-data-table');
                if (!table) {
                    showToast('Show the transcript first, then download.', false);
                    return;
                }

                downloadPdfButton.disabled = true;
                downloadPdfButton.innerHTML = 'Generating...';

                try {
                    await loadHtml2Pdf();

                    // Build a clean printable element
                    const printEl = document.createElement('div');
                    printEl.style.cssText = 'padding:32px;font-family:Inter,Helvetica,Arial,sans-serif;color:#111;background:#fff;';

                    // Header
                    const header = document.createElement('div');
                    header.style.cssText = 'margin-bottom:20px;border-bottom:2px solid #7c5cfc;padding-bottom:12px;';
                    header.innerHTML = `
                        <h2 style="margin:0;font-size:1.4rem;color:#7c5cfc;">FlexRizz Transcript</h2>
                        <p style="margin:4px 0 0;font-size:0.8rem;color:#666;">Semester ${currentSemester} &middot; Generated ${new Date().toLocaleDateString()}</p>
                    `;
                    printEl.appendChild(header);

                    // Clone the table for PDF
                    const clonedTable = table.cloneNode(true);
                    clonedTable.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.8rem;';

                    // Style thead
                    clonedTable.querySelectorAll('thead th').forEach(th => {
                        th.style.cssText = 'padding:10px 12px;background:#f4f4f5;color:#555;font-weight:600;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;text-align:left;border-bottom:2px solid #e2e5ea;';
                    });

                    // Style tbody cells
                    clonedTable.querySelectorAll('tbody td').forEach(td => {
                        td.style.cssText = 'padding:10px 12px;border-bottom:1px solid #eee;color:#222;';
                    });

                    // Style SGPA row
                    const sgpaRowEl = clonedTable.querySelector('.sgpa-row');
                    if (sgpaRowEl) {
                        sgpaRowEl.querySelectorAll('td').forEach(td => {
                            td.style.cssText = 'padding:10px 12px;border-top:2px solid #7c5cfc;font-weight:700;color:#7c5cfc;background:rgba(124,92,252,0.06);';
                        });
                    }

                    // Color grade cells for PDF
                    const gradeColors = { 'A': '#059669', 'B': '#2563eb', 'C': '#d97706', 'D': '#ea580c', 'F': '#dc2626' };
                    clonedTable.querySelectorAll('tbody tr:not(.sgpa-row) td:last-child').forEach(td => {
                        const g = td.textContent.trim().charAt(0);
                        td.style.color = gradeColors[g] || '#222';
                        td.style.fontWeight = '700';
                    });

                    // Remove edit inputs if any
                    clonedTable.querySelectorAll('input').forEach(input => {
                        const val = input.value;
                        const parent = input.parentElement;
                        if (parent) {
                            parent.textContent = val;
                        }
                    });

                    printEl.appendChild(clonedTable);

                    const opt = {
                        margin: [0.4, 0.5, 0.4, 0.5],
                        filename: `FlexRizz_Transcript_Sem${currentSemester}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                    };

                    await html2pdf().set(opt).from(printEl).save();
                    showToast('PDF downloaded successfully!');
                } catch (err) {
                    console.error('PDF generation failed:', err);
                    showToast('PDF generation failed. Try again.', false);
                } finally {
                    downloadPdfButton.disabled = false;
                    downloadPdfButton.innerHTML = 'Download PDF';
                    downloadPdfButton.prepend(pdfIcon);
                }
            });

            container.appendChild(semesterContainer);
            container.appendChild(darkModeContainer);
            container.appendChild(transcriptButton);
            container.appendChild(roundingButton);
            container.appendChild(editMarksButton);
            container.appendChild(customGradesButton);

            // Fix Weightage (manual) button
            const fixWeightBtn = document.createElement('button');
            fixWeightBtn.id = 'fix-weightage-button';
            fixWeightBtn.className = 'modern-btn';
            fixWeightBtn.textContent = 'Fix Weightage';
            container.appendChild(fixWeightBtn);

            // Auto-fix Weightage button
            const autoFixBtn = document.createElement('button');
            autoFixBtn.id = 'auto-fix-weightage-button';
            autoFixBtn.className = 'modern-btn';
            autoFixBtn.textContent = 'Auto Fix';
            container.appendChild(autoFixBtn);

            // PDF Download
            container.appendChild(downloadPdfButton);

            const portletBody = portlet.querySelector('.m-portlet__body');
            if (portletBody) {
                portlet.insertBefore(container, portletBody);
            }

            const getActiveCourseCode = () => {
                const activePane = document.querySelector('.tab-pane.active');
                return activePane ? activePane.id : null;
            };

            const openManualWeightsModal = (code) => {
                if (!code) { 
                    showToast('Please open a course tab first', false); 
                    return; 
                }
                
                const existing = weightOverrides[code] || {};
                const courseName = courses[code]?.name || code;

                const modal = document.createElement('div');
                modal.className = 'request-course-modal';
                Object.assign(modal.style, {
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--surface-1)', border: '1px solid var(--border)', padding: '24px',
                    boxShadow: 'var(--shadow-lg)', zIndex: '1000', width: 'min(90vw, 480px)', 
                    borderRadius: 'var(--radius)', maxHeight: '80vh', overflowY: 'auto'
                });
                
                modal.innerHTML = `
                    <h3 style="margin:0 0 8px 0;color:var(--accent);font-size:1.1rem;font-weight:700;">Fix Weightage - ${courseName}</h3>
                    <p style="margin:0 0 16px 0;color:var(--text-3);font-size:0.8125rem;">
                        Set custom weightages for ${code}. Total should be 100%.
                    </p>
                    
                    <div class="form-group">
                        <label for="w_sess1">Sessional I</label>
                        <input id="w_sess1" type="number" min="0" max="100" value="${existing.sessionalI ?? 15}" step="1">
                    </div>
                    <div class="form-group">
                        <label for="w_sess2">Sessional II</label>
                        <input id="w_sess2" type="number" min="0" max="100" value="${existing.sessionalII ?? 15}" step="1">
                    </div>
                    <div class="form-group">
                        <label for="w_assign_total">Assignments (total)</label>
                        <input id="w_assign_total" type="number" min="0" max="100" value="${existing.assignmentsTotal ?? 10}" step="1">
                    </div>
                    <div class="form-group">
                        <label for="w_quiz_total">Quizzes (total)</label>
                        <input id="w_quiz_total" type="number" min="0" max="100" value="${existing.quizzesTotal ?? 10}" step="1">
                    </div>
                    <div class="form-group">
                        <label for="w_project">Project</label>
                        <input id="w_project" type="number" min="0" max="100" value="${existing.project ?? 10}" step="1">
                    </div>
                    <div class="form-group">
                        <label for="w_lab">Lab Work</label>
                        <input id="w_lab" type="number" min="0" max="100" value="${existing.labWork ?? 10}" step="1">
                    </div>
                    <div class="form-group">
                        <label for="w_final">Final Exam</label>
                        <input id="w_final" type="number" min="0" max="100" value="${existing.finalTotal ?? 40}" step="1">
                    </div>
                    
                    <div class="weightage-summary">
                        <div>Current Total: <span class="weightage-total" id="weight-total">0</span>/100</div>
                        <div class="weightage-warning" id="weight-warning" style="display:none;">
                            Total should be 100% for accurate calculations
                        </div>
                    </div>
                    
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">
                        <button id="w_cancel" class="modern-btn secondary">Cancel</button>
                        <button id="w_reset" class="modern-btn danger">Reset</button>
                        <button id="w_save" class="modern-btn success">Save</button>
                    </div>
                `;

                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                Object.assign(backdrop.style, { 
                    position:'fixed', inset:'0', background:'rgba(0,0,0,0.6)', 
                    zIndex:'999', backdropFilter: 'blur(4px)' 
                });
                
                document.body.appendChild(backdrop);
                document.body.appendChild(modal);

                const updateTotal = () => {
                    const getValue = (id) => parseFloat(modal.querySelector(id).value) || 0;
                    const total = getValue('#w_sess1') + getValue('#w_sess2') + 
                                 getValue('#w_assign_total') + getValue('#w_quiz_total') + 
                                 getValue('#w_project') + getValue('#w_lab') + getValue('#w_final');
                    
                    const totalEl = modal.querySelector('#weight-total');
                    const warningEl = modal.querySelector('#weight-warning');
                    
                    totalEl.textContent = total;
                    totalEl.style.color = total === 100 ? 'var(--success)' : 'var(--danger)';
                    warningEl.style.display = total !== 100 ? 'block' : 'none';
                };

                modal.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', updateTotal);
                    input.addEventListener('change', updateTotal);
                });

                updateTotal();

                const close = () => { 
                    modal.remove(); 
                    backdrop.remove(); 
                };

                modal.querySelector('#w_cancel').onclick = close;
                backdrop.onclick = close;

                modal.querySelector('#w_reset').onclick = () => {
                    delete weightOverrides[code];
                    saveWeightOverrides();
                    close();
                    if (tableVisible) createTable();
                    showToast('Weightage overrides reset to default');
                };

                modal.querySelector('#w_save').onclick = () => {
                    const getValue = (id) => parseFloat(modal.querySelector(id).value) || 0;
                    
                    weightOverrides[code] = {
                        sessionalI: getValue('#w_sess1'),
                        sessionalII: getValue('#w_sess2'),
                        assignmentsTotal: getValue('#w_assign_total'),
                        quizzesTotal: getValue('#w_quiz_total'),
                        project: getValue('#w_project'),
                        labWork: getValue('#w_lab'),
                        finalTotal: getValue('#w_final'),
                    };
                    
                    saveWeightOverrides();
                    close();
                    if (tableVisible) createTable();
                    showToast('Custom weightages saved successfully');
                };

                const handleKeyDown = (e) => {
                    if (e.key === 'Escape') close();
                };
                document.addEventListener('keydown', handleKeyDown);
                modal._keyHandler = handleKeyDown;
            };

            const runAutoFixForCourse = (code) => {
                const activePane = document.getElementById(code);
                if (!activePane) { 
                    showToast('Please open a course tab first', false); 
                    return; 
                }

                const rows = activePane.querySelectorAll('.sum_table .calculationrow');
                let quizCount = 0, assignCount = 0, hasSess1 = false, hasSess2 = false, 
                    hasProject = false, hasLab = false, hasFinal = false;

                rows.forEach(row => {
                    const totalMarksRow = row.querySelector('.GrandTotal');
                    if (!totalMarksRow) return;
                    
                    const total = parseFloat(totalMarksRow.textContent) || 0;
                    if (total === 0) return;
                    
                    const name = getAssessmentName(row).toLowerCase();
                    
                    if (name.includes('quiz')) quizCount++;
                    if (name.includes('assignment')) assignCount++;
                    if (name.includes('sessional') && name.includes('i') && !name.includes('ii')) hasSess1 = true;
                    if (name.includes('sessional') && name.includes('ii')) hasSess2 = true;
                    if (name.includes('project')) hasProject = true;
                    if (name.includes('lab work') || name.includes('labwork')) hasLab = true;
                    if (name.includes('final')) hasFinal = true;
                });

                const sess1 = hasSess1 ? 15 : 0;
                const sess2 = hasSess2 ? 15 : 0;
                const assignTotal = assignCount > 0 ? 10 : 0;
                const projW = hasProject ? 10 : 0;
                const labW = hasLab ? 10 : 0;

                const baseTotal = sess1 + sess2 + assignTotal + projW + labW;
                const remaining = 100 - baseTotal;

                let quizTotal, finalW;

                if (quizCount > 0 && hasFinal) {
                    quizTotal = Math.min(15, Math.max(10, Math.floor(remaining * 0.25)));
                    finalW = remaining - quizTotal;
                } else if (quizCount > 0) {
                    quizTotal = remaining;
                    finalW = 0;
                } else if (hasFinal) {
                    quizTotal = 0;
                    finalW = remaining;
                } else {
                    quizTotal = 0;
                    finalW = 0;
                }

                weightOverrides[code] = {
                    sessionalI: sess1,
                    sessionalII: sess2,
                    assignmentsTotal: assignTotal,
                    quizzesTotal: quizTotal,
                    project: projW,
                    labWork: labW,
                    finalTotal: finalW,
                };

                saveWeightOverrides();
                
                if (tableVisible) createTable();
                
                showToast(`Auto weightage applied: ${quizCount} quizzes, ${assignCount} assignments detected`);
            };

            fixWeightBtn.addEventListener('click', () => openManualWeightsModal(getActiveCourseCode()));
            autoFixBtn.addEventListener('click', () => {
                const code = getActiveCourseCode();
                if (!code) { showToast('Open a course tab first', false); return; }
                runAutoFixForCourse(code);
            });
        };
        
        createToggleButtons();
    }

})();
