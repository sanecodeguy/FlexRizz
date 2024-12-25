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
  
  const courses = {
    "CL1000": { name:"IICT",grading: "Relative", credits: 1 },
    "CL1002": { name:"PF Lab",grading: "Absolute", credits: 1 },
    "CS1002": { name:"PF",grading: "Absolute", credits: 3 },
    "MT1003": { name:"Calculus",grading: "Relative", credits: 3 },
    "NS1001": { name:"Applied Physics",grading: "Relative", credits: 3 },
    "SL1012": { name:"FE Lab",grading: "Relative", credits: 1 },
    "SS1012": { name:"FE ",grading: "Relative", credits: 2 },
    "SS1013": { name:"ICP",grading: "Relative", credits: 2 },
  };

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

    chrome.runtime.sendMessage('pageChange');
  };

  const existingButton = portlet.querySelector('#show-transcript-button');
  if (!existingButton) {
    const button = document.createElement('button');
    button.id = 'show-transcript-button';
    button.textContent = 'Show Transcript';
    button.style.cssText = `
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      font-size: 16px;
      color: #ff9800;
      background-color: #2c2c3b;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    `;
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
      }
    });

    const portletBody = portlet.querySelector('.m-portlet__body');
    if (portletBody) {
      portlet.insertBefore(button, portletBody);
    }
  }
})();
