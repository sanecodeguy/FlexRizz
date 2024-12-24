

(function () {

  
const grades = {
  "CL1000": "A",
  "CL1002": "B",
  "CS1002": "A",
  "MT1003": "C",
  "NS1001": "B+",
  "SL1012": "A-",
  "SS1012": "B",
  "SS1013": "C+",
  "SS1019": "NC" 
};


function updateTranscriptGrades() {
  
  const rows = document.querySelectorAll('table tbody tr');
  rows.forEach(row => {
      const courseCode = row.cells[0].textContent.trim(); 
      
      if (grades[courseCode]) {
          const gradeCell = row.cells[4]; 
          gradeCell.textContent = grades[courseCode]; 
      }
  });
}


window.onload = updateTranscriptGrades;

  
  
  
  const gradingTypes = {
    "CL1000": "Relative",
    "CL1002": "Absolute",
    "CS1002": "Absolute",
    "MT1003": "Relative",
    "SL1012": "Relative",
    "NS1001": "Relative",
    "SS1013": "Relative",
    "SS1012": "Relative",
    "SS1019": "Non-Credit"
  };

  
  function calculateGrade(courseCode, marks) {
    if (gradingTypes[courseCode] === "Absolute") {
      return getGrade(mca,percentage);
    } else {
      return "Relative grade (example: A+)";
    }
  }

  
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
      ret[0] = `F ${score}`;
      ret[1] = "-";
      j = 3;
      while (x[j] === "0") {
          j++;
      }
      ret[2] = getLetter(j) + " " + x[j];
      return ret;
  }

  if (Number(x[2]) >= s) {
      ret[1] = `F ${score}`;
      ret[0] = "-";
      j = 3;
      while (x[j] === '0') {
          j++;
      }
      ret[2] = getLetter(j) + " " + x[j];
      check = true;
  } else {
      for (let i = 3; i < 14; i++) {
          if (x[i] === '0') {
              continue;
          }
          if (Number(x[i]) === s) {
              ret[0] = getLetter(i) + " " + score;
              if (i === 3) {
                  ret[1] = `F ${(Number(x[i]) - 1)}`;
              } else {
                  j = i - 1;
                  while (x[j] === '0' && j > 2) {
                      j--;
                  }
                  ret[1] = getLetter(j) + " " + (Number(x[i]) - 1);
              }
              if (i === 13) {
                  ret[2] = "-";
              } else {
                  j = i + 1;
                  while (x[j] === '0') {
                      j++;
                  }
                  ret[2] = getLetter(j) + " " + x[j];
              }
              check = true;
              break;
          }
          if (Number(x[i]) > s) {
              ret[0] = getLetter(i - 1) + " " + score;

              j = i - 2;
              while (x[j] === '0' && j > 2) {
                  j--;
              }
              if (j === 2) {
                  ret[1] = `F ${x[2]}`;
              } else {
                  ret[1] = getLetter(j) + " " + (Number(x[i - 1]) - 1);
              }

              ret[2] = getLetter(i) + " " + x[i];
              check = true;
              break;
          }
      }
  }
  if (check === false) {
      ret[0] = `A+ ${score}`;
      ret[1] = `A ${x[12]}`;
      ret[2] = "-";
  }
  return ret;
};

  
  const portlet = document.querySelector('.m-portlet');
  if (!portlet) return;

  
  let gradingTypeElement = portlet.querySelector('h5[data-type="grading-type"]');
  let gradeDisplayElement = portlet.querySelector('h5[data-type="expected-grade"]');
  let percentageDisplayElement = portlet.querySelector('h5[data-type="percentage"]');
  let courseDisplayElement = portlet.querySelector('h5[data-type="course-name"]');
  let totalMarksElement = portlet.querySelector('h5[data-type="total"]');
  let obtainedMarksElement = portlet.querySelector('h5[data-type="obtained"]');
  let classAverageElement = portlet.querySelector('h5[data-type="class-average"]');

  if (!gradingTypeElement) {
    gradingTypeElement = document.createElement('h5');
    gradingTypeElement.setAttribute('data-type', 'grading-type');
    gradingTypeElement.style.color = 'white';
    gradingTypeElement.style.marginLeft = '30px';
    portlet.appendChild(gradingTypeElement);
  }

  if (!gradeDisplayElement) {
    gradeDisplayElement = document.createElement('h5');
    gradeDisplayElement.setAttribute('data-type', 'expected-grade');
    gradeDisplayElement.style.color = 'white';
    gradeDisplayElement.style.marginLeft = '30px';
    portlet.appendChild(gradeDisplayElement);
  }

  if (!percentageDisplayElement) {
    percentageDisplayElement = document.createElement('h5');
    percentageDisplayElement.setAttribute('data-type', 'percentage');
    percentageDisplayElement.style.color = 'white';
    percentageDisplayElement.style.marginLeft = '30px';
    portlet.appendChild(percentageDisplayElement);
  }

  if (!courseDisplayElement) {
    courseDisplayElement = document.createElement('h5');
    courseDisplayElement.setAttribute('data-type', 'course-name');
    courseDisplayElement.style.color = 'white';
    courseDisplayElement.style.marginLeft = '30px';
    portlet.appendChild(courseDisplayElement);
  }

  
  if (!totalMarksElement) {
    totalMarksElement = document.createElement('h5');
    totalMarksElement.setAttribute('data-type', 'total');
    totalMarksElement.style.color = 'white';
    totalMarksElement.style.marginLeft = '30px';
    portlet.appendChild(totalMarksElement);
  }

  if (!obtainedMarksElement) {
    obtainedMarksElement = document.createElement('h5');
    obtainedMarksElement.setAttribute('data-type', 'obtained');
    obtainedMarksElement.style.color = 'white';
    obtainedMarksElement.style.marginLeft = '30px';
    portlet.appendChild(obtainedMarksElement);
  }

  if (!classAverageElement) {
    classAverageElement = document.createElement('h5');
    classAverageElement.setAttribute('data-type', 'class-average');
    classAverageElement.style.color = 'white';
    classAverageElement.style.marginLeft = '30px';
    portlet.appendChild(classAverageElement);
  }

  
  const activeCourseElement = document.querySelector('.nav-link.m-tabs__link.active');
  let courseCode = null;

  
  if (activeCourseElement) {
    const href = activeCourseElement.getAttribute('href');
    if (href) {
      courseCode = href.substring(1); 
    }
  }

  
  if (!courseCode) {
    gradingTypeElement.textContent = "Grading Type: Unknown";
    gradeDisplayElement.textContent = "Expected Grade: Not Available";
    percentageDisplayElement.textContent = "Percentage: N/A";
    courseDisplayElement.textContent = "Course: Unknown";
    return;
  }

  
  courseDisplayElement.textContent = `Course: ${courseCode}`;

  
  const gradingType = gradingTypes[courseCode] || "Unknown";
  gradingTypeElement.textContent = `Grading Type: ${gradingType}`;

  
  const activeDiv = document.querySelector('.tab-pane.active');
  let totalWeightage = 0;
  let totalObtMarks = 0;
  let totalAverage = 0;
  const tables = activeDiv ? activeDiv.querySelectorAll('.sum_table') : [];

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const rows = table.querySelectorAll(".calculationrow");
    let rowCalculatedAverage = 0;
    let tableWeightageSum = 0;

    for (let j = 0; j < rows.length; j++) {
      const weightRow = rows[j].querySelectorAll(".weightage");
      const averageRow = rows[j].querySelectorAll(".AverageMarks");
      const totalMarksRow = rows[j].querySelectorAll(".GrandTotal");

      if (weightRow.length == 0 || weightRow[0].textContent == "0 " ||
        averageRow.length == 0 || averageRow[0].textContent == "0 " ||
        totalMarksRow.length == 0 || totalMarksRow[0].textContent == "0 ") {
        continue;
      } else {
        tableWeightageSum += parseFloat(weightRow[0].textContent);
        rowCalculatedAverage += (parseFloat(averageRow[0].textContent) / parseFloat(totalMarksRow[0].textContent)) * parseFloat(weightRow[0].textContent);
      }
    }

    const totalSection = table.querySelectorAll('[class*="totalColumn_"]');
    if (totalSection.length == 1 && tableWeightageSum != 0 && rowCalculatedAverage != 0) {
      const tableColWeigtage = totalSection[0].querySelectorAll(".totalColweightage");
      rowCalculatedAverage = rowCalculatedAverage / tableWeightageSum * parseFloat(tableColWeigtage[0].textContent);
      totalAverage += rowCalculatedAverage;
    }

    if (totalSection.length == 1) {
      const _tableColWeigtage = totalSection[0].querySelectorAll(".totalColweightage");
      const _tableColObtMarks = totalSection[0].querySelectorAll(".totalColObtMarks");
      if (_tableColWeigtage.length == 1 && _tableColObtMarks.length == 1) {
        totalWeightage += parseFloat(_tableColWeigtage[0].textContent);
        totalObtMarks += parseFloat(_tableColObtMarks[0].textContent);
      }
    }
  }

  
  const finalCalculateAverage = isNaN(totalAverage) ? "Cannot Calculate, Missing Data" : totalAverage.toFixed(2);

  
  totalMarksElement.textContent = `Total Marks: ${totalWeightage.toFixed(2)}`;
  obtainedMarksElement.textContent = `Obtained Marks: ${totalObtMarks.toFixed(2)}`;
  classAverageElement.textContent = `Class Average: ${finalCalculateAverage}`;

  
  if (gradingType === "Absolute") {
    if (totalWeightage > 0) {
      const percentage = (totalObtMarks / totalWeightage) * 100;
      const grade = calculateAbsoluteGrade(percentage);
      gradeDisplayElement.textContent = `Expected Grade: ${grade}`;
      percentageDisplayElement.textContent = `Percentage: ${percentage.toFixed(2)}%`;
    } else {
      gradeDisplayElement.textContent = `No Marks Available for Calculation`;
      percentageDisplayElement.textContent = "Percentage: N/A";
    }
  } else if (gradingType === "Relative") {
    const percentage = Math.round((totalObtMarks / totalWeightage) * 100); 
    let mca = Math.round((finalCalculateAverage / totalWeightage) * 100); 
    const relativeGrade =getGrade(mca,percentage); 
    gradeDisplayElement.textContent = `Expected Grade: ${relativeGrade[0]}`;
    percentageDisplayElement.textContent = `Percentage: ${percentage.toFixed(2)}%`;
  } else if (gradingType === "Non-Credit") {
    gradeDisplayElement.textContent = `Non-Credit Course`;
    percentageDisplayElement.textContent = "Percentage: N/A";
  } else {
    gradeDisplayElement.textContent = "Grading Type: Unknown";
    percentageDisplayElement.textContent = "Percentage: N/A";
  }
  
  chrome.runtime.sendMessage('pageChange');
})();
