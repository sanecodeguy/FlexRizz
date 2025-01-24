

let semester = 2; 
let studentsgpa=0.00;
const studentName = sessionStorage.getItem('studentName') || 'Unknown';
const degree = sessionStorage.getItem('degree') || 'Unknown';
const dob = sessionStorage.getItem('dob') || 'Unknown';
const contactNumber = sessionStorage.getItem('contactNumber') || 'Unknown';
const email = sessionStorage.getItem('email') || 'Unknown';
const address = sessionStorage.getItem('address') || 'Unknown';
console.log(studentName, degree, dob, contactNumber, email, address);
const tableDataArray = [];
(function () {
  

    const portlet = document.querySelector('.m-portlet');
  
    
    const style = document.createElement('style');
    style.textContent = `
      .m-portlet__head, 
      .m-portlet__head-tools, 
      .m-portlet--brand, 
      .m-portlet--head-solid-bg, 
      .m-portlet--border-bottom-metal, 
      .m-portlet--head-sm {
        background-color: #1E1E2F !important;
        color: orange !important;
      }
  
      #course-data-table tbody tr:hover {
        background-color: #333;
        cursor: pointer;
      }
  
      #course-data-table th, 
      #course-data-table td {
        color: orange !important;
      }
    `;
    document.head.appendChild(style);
    const createData = () => {
      var x = new Array(100);
  
      for (var i = 0; i < x.length; i++) {
          x[i] = new Array(14);
      }
  
      x[30][0] = "30"
      x[30][1] = "C+"
      x[30][2] = "29"
      for (i = 3; i < 7; i++) {
          x[0][i] = '0'
      }
      x[30][7] = "30"
      x[30][8] = "33"
      x[30][9] = "38"
      x[30][10] = "43"
      x[30][11] = "48"
      x[30][12] = "65"
  
      for (i = 31; i < 50; i++) {
          x[i][0] = String(i)
          x[i][1] = 'C+'
          x[i][2] = "29"
          for (var j = 3; j < 12; j++) {
              if (((i === 31 || i === 32) && (j >= 3 && j <= 6)) ||
                  ((i >= 33 && i <= 37) && (j >= 3 && j <= 5)) ||
                  ((i >= 38 && i <= 42) && (j === 3 | j === 4)) ||
                  ((i >= 43 && i <= 47) && (j === 3))) {
                  x[i][j] = "0"
              }
              else if (((i === 48 || i === 49) && j === 3) ||
                  ((i === 31 || i === 32) && j === 7) ||
                  ((i >= 33 || i >= 37) && j === 6) ||
                  ((i >= 38 || i >= 42) && j === 5) ||
                  ((i >= 43 || i >= 47) && j === 4)) {
                  x[i][j] = "30"
              }
              else {
                  var temp = Number(x[i - 1][j])
                  temp++;
                  x[i][j] = String(temp)
              }
          }
      }
  
      for (i = 31; i < 43; i++) {
          x[i][12] = "65"
          x[i][13] = "70"
      }
  
      for (i = 43; i < 50; i++) {
          temp = Number(x[i - 1][12])
          temp++;
          x[i][12] = String(temp)
  
          temp = Number(x[i - 1][13])
          temp++;
          x[i][13] = String(temp)
      }
  
  
      x[50][0] = "50"
      x[50][1] = "B-"
      x[50][2] = "29"
      x[50][3] = "0"
      x[50][4] = "30"
      x[50][5] = "33"
      x[50][6] = "38"
      x[50][7] = "43"
      x[50][8] = "48"
      x[50][9] = "53"
      x[50][10] = "58"
      x[50][11] = "63"
      x[50][12] = "68"
      x[50][13] = "73"
  
  
      for (i = 51; i <= 64; i++) {
          x[i][0] = String(i)
          x[i][1] = 'B-'
          for (j = 2; j < 14; j++) {
              if (j === 2 && (i >= 51 && i <= 57)) {
                  x[i][j] = "29"
              }
              else if ((i === 51 || i === 52) && (j === 3)) {
                  x[i][j] = "0"
              }
              else if ((i === 51 || i === 52) && (j === 4)) {
                  x[i][j] = "30"
              }
              else if ((i >= 53 && i <= 57) && (j === 3)) {
                  x[i][j] = "30"
              }
              else {
                  temp = Number(x[i - 1][j])
                  temp++;
                  x[i][j] = String(temp)
              }
          }
      }
  
      x[65][0] = "65"
      x[65][1] = "B"
      x[65][2] = "32"
      x[65][3] = "33"
      x[65][4] = "38"
      x[65][5] = "43"
      x[65][6] = "48"
      x[65][7] = "53"
      x[65][8] = "58"
      x[65][9] = "63"
      x[65][10] = "68"
      x[65][11] = "73"
      x[65][12] = "78"
      x[65][13] = "83"
  
      for (i = 66; i <= 91; i++) {
          x[i][0] = String(i)
          x[i][1] = 'B'
          for (j = 2; j < 14; j++) {
              if ((i >= 81) && (j === 2 || j === 3)) {
                  if (j === 2) {
                      x[i][j] = "49"
                  }
                  else {
                      x[i][j] = "50"
                  }
                  continue;
              }
  
              if ((i >= 81) && (j === 11)) {
                  x[i][j] = "0"
                  continue
              }
  
              if ((i >= 86) && (j === 10)) {
                  x[i][j] = "0"
                  continue;
              }
              if ((i >= 77) && (j === 12 || j === 13)) {
                  if (j === 12) {
                      x[i][j] = "90"
                  }
                  else {
                      x[i][j] = "95"
                  }
                  continue;
              }
  
              else {
  
                  temp = Number(x[i - 1][j])
                  temp++;
                  x[i][j] = String(temp)
              }
          }
      }
      return x
  }
  
  const getLetter = (index) => {
      if (index === 2) {
          return 'F'
      }
      if (index === 3) {
          return 'D'
      }
      else if (index === 4) {
          return 'D+'
      }
      else if (index === 5) {
          return 'C-'
      }
      else if (index === 6) {
          return 'C'
      }
      else if (index === 7) {
          return 'C+'
      }
      else if (index === 8) {
          return 'B-'
      }
      else if (index === 9) {
          return 'B'
      }
      else if (index === 10) {
          return 'B+'
      }
      else if (index === 11) {
          return 'A-'
      }
      else if (index === 12) {
          return 'A'
      }
      else {
          return 'A+'
      }
  }
  
  
   const getGrade = (mca, score) => {
    let check = false;
    const s = Number(score);
    const ret = ['?', '?', '?'];
    const x = createData()[mca];
    let j = 0;
  
    if (mca < 30 || mca > 91) {
        return ret; 
    }
    if (s < 30 || s <= x[2]) {
        ret[0] = `F`;
        ret[1] = "-";
        j = 3;
        while (x[j] === "0") {
            j++;
        }
        ret[2] = getLetter(j);
        return ret;
    }
  
    if (Number(x[2]) >= s) {
        ret[1] = `F`;
        ret[0] = "-";
        j = 3;
        while (x[j] === '0') {
            j++;
        }
        ret[2] = getLetter(j);
        check = true;
    } else {
        for (let i = 3; i < 14; i++) {
            if (x[i] === '0') {
                continue;
            }
            if (Number(x[i]) === s) {
                ret[0] = getLetter(i);
                if (i === 3) {
                    ret[1] = `F`;
                } else {
                    j = i - 1;
                    while (x[j] === '0' && j > 2) {
                        j--;
                    }
                    ret[1] = getLetter(j);
                }
                if (i === 13) {
                    ret[2] = "-";
                } else {
                    j = i + 1;
                    while (x[j] === '0') {
                        j++;
                    }
                    ret[2] = getLetter(j);
                }
                check = true;
                break;
            }
            if (Number(x[i]) > s) {
                ret[0] = getLetter(i - 1);
  
                j = i - 2;
                while (x[j] === '0' && j > 2) {
                    j--;
                }
                if (j === 2) {
                    ret[1] = `F`;
                } else {
                    ret[1] = getLetter(j);
                }
  
                ret[2] = getLetter(i);
                check = true;
                break;
            }
        }
    }
    if (check === false) {
        ret[0] = `A+`;
        ret[1] = `A`;
        ret[2] = "-";
    }
    return ret;
  };
// This can be dynamically set to 1 or 2

  const courses = {};
  
  // Semester 1 courses
  if (semester === 1) {
      courses["CL1000"] = { name: "IICT", grading: "Relative", credits: 1 };
      courses["CL1002"] = { name: "PF Lab", grading: "Absolute", credits: 1 };
      courses["CS1002"] = { name: "PF", grading: "Absolute", credits: 3 };
      courses["MT1003"] = { name: "Calculus", grading: "Relative", credits: 3 };
      courses["NS1001"] = { name: "Applied Physics", grading: "Relative", credits: 3 };
      courses["SL1012"] = { name: "FE Lab", grading: "Relative", credits: 1 };
      courses["SS1012"] = { name: "FE", grading: "Relative", credits: 2 };
      courses["SS1013"] = { name: "ICP", grading: "Relative", credits: 2 };
  }
  
  // Semester 2 courses
  else if (semester === 2) {
      courses["CS1004"] = { name: "Object Oriented Programming", grading: "Absolute", credits: 3 };
      courses["CL1004"] = { name: "OOP Lab", grading: "Absolute", credits: 1 };
      courses["EE1005"] = { name: "Digital Logic Design", grading: "Absolute", credits: 3 };
      courses["EL1005"] = { name: "DLD Lab", grading: "Absolute", credits: 1 };
      courses["MT1006"] = { name: "Multivariable Calculus", grading: "Relative", credits: 3 };
      courses["SS1007"] = { name: "Islamic Studies/Ethics", grading: "Relative", credits: 2 };
      courses["SS1014"] = { name: "Expository Writing", grading: "Relative", credits: 2 };
      courses["SL1014"] = { name: "Expository Lab", grading: "Relative", credits: 1 };
      courses["SS3002"] = { name: "Civics and Community Engagement", grading: "Relative", credits: 2 };
  }
  
  // Output the courses object to see what we have
  console.log(courses);
  
    let tableVisible = false;
    let stopAutoClick = false;
  
    
    function calculateAbsoluteGrade(percentage) {
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
    }
  
    
    function getGradePoints(grade) {
      const gradePoints = {
        "A+": 4.0,
        "A": 4.0,
        "A-": 3.67,
        "B+": 3.33,
        "B": 3.0,
        "B-": 2.67,
        "C+": 2.33,
        "C": 2.0,
        "C-": 1.67,
        "D+": 1.33,
        "D": 1.0,
        "F": 0,
      };
      return gradePoints[grade] || 0;
    }
 
    
    const createTable = () => {
      const existingTable = portlet.querySelector('#course-data-table');
      if (existingTable) return;
  
      const table = document.createElement('table');
      table.id = 'course-data-table';
      table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        color: #f8f9fa;
        background-color: #1e1e2f;
      `;
  
      const headerRow = `
        <thead>
          <tr style="background-color: #2c2c3b; text-align: left;">
            <th style="padding: 12px; border: 1px solid #444; font-weight: bold; color: #ff9800;">Course Code</th>
            <th style="padding: 12px; border: 1px solid #444; font-weight: bold; color: #ff9800;">Grading Type</th>
            <th style="padding: 12px; border: 1px solid #444; font-weight: bold; color: #ff9800;">Class Average</th>
            <th style="padding: 12px; border: 1px solid #444; font-weight: bold; color: #ff9800;">Obtained Marks</th>
            <th style="padding: 12px; border: 1px solid #444; font-weight: bold; color: #ff9800;">Total Marks</th>
            <th style="padding: 12px; border: 1px solid #444; font-weight: bold; color: #ff9800;">Grade</th>
          </tr>
        </thead>
      `;
      table.innerHTML = headerRow;
  
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);
  
      let totalCredits = 0;
      let totalGradePoints = 0;
  
      const addCourseDataToTable = (name, gradingType, finalCalculateAverage, totalObtMarks, totalWeightage, grade, credits) => {
        const newRow = `
          <tr style="border: 1px solid #444; text-align: left;">
            <td style="padding: 10px; border: 1px solid #444;">${name}</td>
            <td style="padding: 10px; border: 1px solid #444;">${gradingType}</td>
            <td style="padding: 10px; border: 1px solid #444;">${finalCalculateAverage}</td>
            <td style="padding: 10px; border: 1px solid #444;">${totalObtMarks.toFixed(2)}</td>
            <td style="padding: 10px; border: 1px solid #444;">${totalWeightage.toFixed(2)}</td>
            <td style="padding: 10px; border: 1px solid #444;">${grade}</td>
          </tr>
        `;
        tbody.innerHTML += newRow;
        tableDataArray.push({
          courseName: name,
          gradingType: gradingType,
          average: finalCalculateAverage,
          obtainedMarks: totalObtMarks.toFixed(2),
          totalMarks: totalWeightage.toFixed(2),
          grade: grade,
          credits: credits,
        });
        
        totalCredits += credits;
        totalGradePoints += getGradePoints(grade) * credits;
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
        if (gradingType === "Absolute") {
          const percentage = (totalObtMarks / totalWeightage) * 100;
          grade = calculateAbsoluteGrade(percentage);
        }
        else if (gradingType === "Relative") {
          const percentage = Math.round((totalObtMarks / totalWeightage) * 100);
          const mca=Math.round((totalAverage/totalWeightage)*100);
          grade = getGrade(mca,percentage)[0];
        }
  
        addCourseDataToTable(courses[code].name, gradingType, finalCalculateAverage, totalObtMarks, totalWeightage, grade, credits);
  
        if (index === Object.keys(courses).length - 1) {
          stopAutoClick = true;
        }
      });
  
      
      const sgpa = (totalGradePoints / totalCredits).toFixed(2);
      studentsgpa=sgpa;
      const sgpaRow = `
        <tr style="background-color: #red; font-weight: bold;">
          <td colspan="1" style="padding: 10px; border: 1px solid #444; text-align: right;">A rizzons project www.rizzons.com</td>
          <td colspan="4" style="padding: 10px; border: 1px solid #444; text-align: right;">SGPA</td>
          <td style="padding: 10px; border: 1px solid #444;">${sgpa}</td>
        </tr>
      `;
      tbody.innerHTML += sgpaRow;
  
      const portletBody = portlet.querySelector('.m-portlet__body');
      if (portletBody) {
        portlet.insertBefore(table, portletBody);
      }
      tableDataArray.forEach(item => {
        console.log(`Course Name: ${item.courseName}`);
        console.log(`Grading Type: ${item.gradingType}`);
        console.log(`Average: ${item.average}`);
        console.log(`Obtained Marks: ${item.obtainedMarks}`);
        console.log(`Total Marks: ${item.totalMarks}`);
        console.log(`Grade: ${item.grade}`);
        console.log(`Credits: ${item.credits}`);
        console.log('-------------------');
      });
      
      chrome.runtime.sendMessage('pageChange');
    };
    // createTable();


  
      // Extract information

    const newcontent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Dashboard</title>
        <link rel="shortcut icon" href="./images/logo.png">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
    </head>
    <body class="dark-theme">
        <header>
            <div class="logo" title="National University Of Computing & Emerging Sciences">
                <img src="https://i.ibb.co/tC1mdwj/logo.png" alt="image not available">
            </div>
            <div class="navbar">
                <a href="https://flexstudent.nu.edu.pk/Student/StudentMarks" class="active">
                    <span class="material-icons-sharp"></span>
                    <h3>Back to dull view</h3>
                </a>
            </div>
            <div id="profile-btn">
                <span class="material-icons-sharp">person</span>
            </div>

        </header>
        <div class="container">
            <aside>
            <div class="profile">
                    <div class="top">
                        <div class="profile-photo">
                            <img src="/Login/GetImage" alt="">
                        </div>
                    </div>
                             <div class="info">
                            <p>Hey, <b>${studentName || 'Unknown'}</b> </p>
                        </div>
                    <div class="about">
                        <h5>Degree</h5>
                        <p>${degree || 'Unknown'}</p>
                        <h5>DOB</h5>
                        <p>${dob || 'Unknown'}</p>
                        <h5>Contact</h5>
                        <p>${contactNumber || 'Unknown'}</p>
                        <h5>Email</h5>
                        <p>${email || 'Unknown'}</p>
                        <h5>Address</h5>
                        <p>${address || 'Unknown'}</p>
                    </div>
                </div>
            </aside>
            <main>
                 <h1>SGPA : <span id="studentsgpa"></span></h1>
                <h1>Marks</h1>
                <div class="subjects">
                </div>
            </main>
        <script src="app.js"></script>
    </body>
    </html>`;
const newcss=`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');

:root{
    --color-primary:rgba(27, 192, 214, 0.68);
    --color-danger: #ff7782;
    --color-success: #41f1b6;
    --color-warning: #ffbb55;
    --color-white: #fff;
    --color-info: #986262;
    --color-dark: #363949;
    --color-light: rgba(194, 198, 238, 0.18);
    --color-dark-varient: #677483;
    --color-background: #ffffff55;
    
    --card-border-radius: 2rem;
    --border-radius-1: 0.4rem;
    --border-radius-2: 1.2rem;

    --card-padding: 1.8rem;
    --box-shadow: 0 2rem 3rem var(--color-light)    
}

.dark-theme{
    --color-background: #181a1e;
    --color-white: #202528;
    --color-dark: #edeffd;
    --color-dark-varient: #a3bdcc;
    --color-light: rgba(0,0,0,0.4);
    --box-shadow: 0 2rem 3rem var(--color-light)
}


*{
    margin:0;
    padding: 0;
    text-decoration: none;
    list-style: none;
    box-sizing: border-box;
}

html{
    font-size: 14px;
    scroll-behavior: smooth;
}
body{
    font-family: 'Poppins', sans-serif;
    font-size: .88rem;
    background: var(--color-background);
    user-select: none;
    overflow-x: hidden;
    color: var(--color-dark);
}
*{
    color: var(--color-dark);
}
img{
    display: block;
    width: 100%;
}
h1{
    font-weight: 800;
    font-size: 1.8rem;
}
h2{font-size: 1.4rem;}
h3 {
  font-size: .87rem;
  color: #A1CA05
}

h4{font-size: .8rem;}
h5{font-size: .77rem;}
small{font-size: .75rem;}

.text-muted{color: var(--color-info);}
p{color: var(--color-dark-varient);}
b{color: var(--color-dark);}

.primary{color: var(--color-primary);}
.danger{color: var(--color-danger);}
.success{color: var(--color-success)}
.warning{color: var(--color-warning);}

.container{
    position: relative;
    display: grid;
    width: 140%;
    margin: 0 3rem;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
    padding-top: 4rem;
}
header h3{font-weight: 500;} 
header{
    position: fixed;
    width: 100vw;
    z-index: 1000;
    background-color: var(--color-background);
}
header.active{box-shadow: var(--box-shadow);}
header .logo{
    display: flex;
    gap: .8rem;
    margin-right: auto;
}
header .logo img{
    width: 10em;
    height: 5rem;
}

header,
header .navbar{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 3rem;
    color: var(--color-info);
}
header .navbar a{
    display: flex;
    margin-left: 2rem;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 3.7rem;
    transition: all 300ms ease;
    padding: 0 2rem;
}
header .navbar a:hover {
    padding-top: 1.5rem;
}
header .navbar a.active{
    background: var(--color-light);
    color: var(--color-primary);
}
header .navbar a.active::before{
    content: "";
    background-color: var(--color-primary);
    position: absolute;
    height: 5px;
    width: 100%;
    left: 0;top: 0;
}
header #profile-btn{
    display: none;
    font-size: 2rem;
    margin: .5rem 2rem 0 0;
    cursor: pointer;
}
header .theme-toggler{
    background: var(--color-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.6rem;
    width: 4.2rem;
    cursor: pointer;
    border-radius: var(--border-radius-1);
    margin-right: 2rem;
}
header .theme-toggler span{
    font-size: 1.2rem;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
header .theme-toggler span.active{
    background-color: var(--color-primary);
    color: white;
    border-radius: var(--border-radius-1);
}

/* Profile section  */
aside .profile{
    margin-top: 2rem;
    width: 13rem;
    position: fixed;
}
aside .profile .top{
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid var(--color-light);
    padding-bottom: 1rem;
}
aside .profile .top:hover .profile-photo{
    scale: 1.05;
}
aside .profile .top .profile-photo{
    width: 8rem;
    height: 8rem;
    border-radius: 70%;
    overflow: hidden;
    border: 5px solid var(--color-light);
    transition: all 400ms ease;
}
aside .profile .about p{
    padding-bottom: 1rem;
}
aside .profile .about{
    margin-top: 1rem;
}

/* Home Section  */
main{
    position: relative;
    margin-top: 1.4rem;
}
main .subjects{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.6rem;
}

main .subjects > div{
    background-color: var(--color-white);
    padding: var(--card-padding);
    border-radius: var(--card-border-radius);
    margin-top: 1rem;
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
}
main .subjects > div:hover{
    box-shadow: none;
}
main .subjects > div span{
    background-color: var(--color-primary);
    padding: .5rem;
    border-radius: 50%;
    color: var(--color-white);
    font-size: 1.5rem;
}
main .subjects > div.mth span,main .subjects > div.cg span{background: var(--color-danger);}
main .subjects > div.cs span{background: var(--color-success);}

main .subjects h3{
    margin: 1rem 0 0.6rem;
    font-size: 1rem;
}
main .subjects .progress{
    position: relative;
    width: 89px;
    height: 89px;
    border-radius: 50%;
    margin: auto;
}
main .subjects svg circle{
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 8;
    stroke-linecap: round;
    transform: translate(5px, 5px);
    stroke-dasharray: 110;
    stroke-dashoffset: 92;
}
main .subjects .eg svg circle{
    stroke-dashoffset: 25;
    stroke-dasharray: 210;
}
main .subjects .mth svg circle{
    stroke-dashoffset: 7;
    stroke-dasharray: 210;
}
main .subjects .cs svg circle{
    stroke-dashoffset: 35;
    stroke-dasharray: 210;
}
main .subjects .cg svg circle{
    stroke-dashoffset: 0;
    stroke-dasharray: 210;
}
main .subjects .net svg circle{
    stroke-dashoffset: 5;
    stroke-dasharray: 210;
}
main .subjects .progress .grade{
    position: absolute;
    top: 0;left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
main .subjects small{
    margin-top: 1rem;
    display: block;
}

/* MEDIA QUERIES  */
@media screen and (max-width: 1200px) {
    html{font-size: 12px;}
    .container{
        grid-template-columns: 13rem auto 20rem;
    }
    header{position: fixed;}
    .container{padding-top: 4rem;}
    header .logo h2{display: none;}
    header .navbar h3{display: none;}
    header .navbar a{width: 4.5rem; padding: 0 1rem;}

    main .subjects{
        grid-template-columns: repeat(2, 1fr);
        gap: 1;
    }
    main .timetable{
        width: 150%;
        position: absolute;
        padding: 4rem 0 0 0;
    }
}


@media screen and (max-width: 768px){
    html{font-size: 10px;}
    header{padding: 0 .8rem;}
    .container{width: 100%; grid-template-columns: 1fr;margin: 0;}
    header #profile-btn{display: inline;}
    header .navbar{padding: 0;}
    header .navbar a{margin: 0 .5rem 0 0;}
    header .theme-toggler{margin: 0;}
    aside{
        position: absolute;
        top: 4rem;left: 0;right: 0;
        background-color: var(--color-white);
        padding-left: 2rem;
        transform: translateX(-100%);
        z-index: 10;
        width:18rem;
        height: 100%;
        box-shadow: 1rem 3rem 4rem var(--color-light);
        transition: all 2s ease;
    }
    aside.active{
        transform: translateX(0);
    }
    main{padding: 0 2rem;}
    main .timetable{
        position: relative;
        margin: 3rem 0 0 0;
        width: 100%;
    }
    main .timetable table{
        width: 100%;
        margin: 0;
    }
    .right{
        width: 100%;
        padding: 2rem;
    }
}
    .grade-circle {
  display: inline-block;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  color: var(--color-white);
  text-align: center;
  line-height: 2.4rem;
  font-weight: bold;
  font-size: 1rem;
}

`;
const existingButton = portlet.querySelector('#show-transcript-button');
if (!existingButton) {
  const button = document.createElement('button');
  button.id = 'show-transcript-button';
  button.textContent = 'Toggle FlexRizz';

  // Add CSS for neon effect directly here
  button.style.cssText = `
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 16px;
    color:rgb(19, 2, 48);
    background-color:rgb(37, 177, 202);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    font-weight: bold;
  `;

  // Add animation classes to button
  button.classList.add('neon-button');

  button.addEventListener('click', () => {
    const existingTable = portlet.querySelector('#course-data-table');
    if (existingTable) {
      if (existingTable.style.display === 'none') {
        existingTable.style.display = 'table';
        button.textContent = 'Hide Transcript';
        tableVisible = true;
      } else {
        existingTable.style.display = 'none';
        button.textContent = 'Show Transcript';
        tableVisible = false;
      }
    } else {
      createTable();
      button.textContent = 'Hide Transcript';
      tableVisible = true;
          document.documentElement.innerHTML=newcontent;
          tableDataArray.forEach(item => {
            const subjectDiv = document.createElement("div");
            subjectDiv.classList.add("eg");
          
            // Determine the color of the circle based on the grade
            let gradeColor;
            switch (item.grade) {
              case "A+":
                gradeColor = "#388E3C"; // Dark Green
                break;
              case "A":
                gradeColor = "#4CAF50"; // Green
                break;
              case "A-":
                gradeColor = "#81C784"; // Light Green
                break;
              case "B+":
                gradeColor = "#FFC107"; // Amber/Yellow
                break;
              case "B":
                gradeColor = "#FF9800"; // Orange
                break;
              case "B-":
                gradeColor = "#FF5722"; // Deep Orange
                break;
              case "C+":
                gradeColor = "#FF7043"; // Light Red-Orange
                break;
              case "C":
                gradeColor = "#FF5722"; // Red-Orange
                break;
              case "C-":
                gradeColor = "#D32F2F"; // Dark Red
                break;
              case "D+":
                gradeColor = "#FF3D00"; // Bright Red
                break;
              case "D":
                gradeColor = "#E64A19"; // Dark Red
                break;
              case "F":
                gradeColor = "#9E9E9E"; // Gray
                break;
              default:
                gradeColor = "#9E9E9E"; // Gray for others
                break;
            }
          
            // Construct the inner HTML with all the details for each subject
            subjectDiv.innerHTML = `
              <h3>${item.courseName}</h3>
              
              <div class="subject-details">
                <p><strong>Expected Grade:</strong> 
                  <span class="grade-circle" style="background-color: ${gradeColor};">
                    ${item.grade}
                  </span>
                </p>
                <p><strong>Class Average:</strong> ${item.average}</p>
                <p><strong>Obtained Marks:</strong> ${item.obtainedMarks}</p>
                <p><strong>Total Marks:</strong> ${item.totalMarks}</p>
                <p><strong>Credits:</strong> ${item.credits}</p>
                <p><strong>Grading Type:</strong> ${item.gradingType}</p>
              </div>
              <small class="text-muted">a rizzons project</small>
            `;
          
            // Append the subject div to the subjects container
            document.querySelector(".subjects").appendChild(subjectDiv);
          });
          
          
          // console.log(newcontent);
          const gpaElement = document.querySelector("#studentsgpa");
gpaElement.textContent = studentsgpa;
          const oldStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
oldStyles.forEach(style => style.remove());

// Inject the new CSS into the webpage
const styleTag = document.createElement('style');
styleTag.textContent = newcss;
document.head.appendChild(styleTag); // Add the <style> tag to the <head>
        }
      });
  
      const portletBody = portlet.querySelector('.m-portlet__body');
      if (portletBody) {
        portlet.insertBefore(button, portletBody);
      }
    }
  })();
  const themeToggler = document.querySelector(".theme-toggler");
  // const subjectsContainer = document.querySelector(".subjects"); // This is the container for subjects
  themeToggler.onclick = function () {
      document.body.classList.toggle('dark-theme');
      themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
      themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
  };

  module.exports = tableDataArray;
