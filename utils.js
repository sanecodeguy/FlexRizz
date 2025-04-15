(function() {
    
function getLetter(index) {
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
}
window.gradeUtils = {
    getLetter: getLetter,
    createData: createData,
    getGrade: getGrade,
    calculateAbsoluteGrade: calculateAbsoluteGrade,
    getGradePoints: getGradePoints,
    getGradeClass: getGradeClass
};
function createData() {
    const x = Array.from({ length: 100 }, () => Array(14).fill(null));

    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x[i].length; j++) {
            x[i][j] = "0";
        }
    }

    x[30][0] = "30";
    x[30][1] = "C+";
    x[30][2] = "29";
    for (let i = 3; i < 7; i++) {
        x[0][i] = '0';
    }
    x[30][7] = "30";
    x[30][8] = "33";
    x[30][9] = "38";
    x[30][10] = "43";
    x[30][11] = "48";
    x[30][12] = "65";

    for (let i = 31; i < 50; i++) {
        x[i][0] = String(i);
        x[i][1] = 'C+';
        x[i][2] = "29";
        for (let j = 3; j < 12; j++) {
            if (((i === 31 || i === 32) && (j >= 3 && j <= 6)) ||
                ((i >= 33 && i <= 37) && (j >= 3 && j <= 5)) ||
                ((i >= 38 && i <= 42) && (j === 3 || j === 4)) ||
                ((i >= 43 && i <= 47) && (j === 3))) {
                x[i][j] = "0";
            }
            else if (((i === 48 || i === 49) && j === 3) ||
                ((i === 31 || i === 32) && j === 7) ||
                ((i >= 33 && i <= 37) && j === 6) ||
                ((i >= 38 && i <= 42) && j === 5) ||
                ((i >= 43 && i <= 47) && j === 4)) {
                x[i][j] = "30";
            }
            else {
                let temp = Number(x[i - 1][j]);
                temp++;
                x[i][j] = String(temp);
            }
        }
    }

    for (let i = 31; i < 43; i++) {
        x[i][12] = "65";
        x[i][13] = "70";
    }

    for (let i = 43; i < 50; i++) {
        let temp = Number(x[i - 1][12]);
        temp++;
        x[i][12] = String(temp);

        temp = Number(x[i - 1][13]);
        temp++;
        x[i][13] = String(temp);
    }

    x[50][0] = "50";
    x[50][1] = "B-";
    x[50][2] = "29";
    x[50][3] = "0";
    x[50][4] = "30";
    x[50][5] = "33";
    x[50][6] = "38";
    x[50][7] = "43";
    x[50][8] = "48";
    x[50][9] = "53";
    x[50][10] = "58";
    x[50][11] = "63";
    x[50][12] = "68";
    x[50][13] = "73";

    for (let i = 51; i <= 64; i++) {
        x[i][0] = String(i);
        x[i][1] = 'B-';
        for (let j = 2; j < 14; j++) {
            if (j === 2 && (i >= 51 && i <= 57)) {
                x[i][j] = "29";
            }
            else if ((i === 51 || i === 52) && (j === 3)) {
                x[i][j] = "0";
            }
            else if ((i === 51 || i === 52) && (j === 4)) {
                x[i][j] = "30";
            }
            else if ((i >= 53 && i <= 57) && (j === 3)) {
                x[i][j] = "30";
            }
            else {
                let temp = Number(x[i - 1][j]);
                temp++;
                x[i][j] = String(temp);
            }
        }
    }

    x[65][0] = "65";
    x[65][1] = "B";
    x[65][2] = "32";
    x[65][3] = "33";
    x[65][4] = "38";
    x[65][5] = "43";
    x[65][6] = "48";
    x[65][7] = "53";
    x[65][8] = "58";
    x[65][9] = "63";
    x[65][10] = "68";
    x[65][11] = "73";
    x[65][12] = "78";
    x[65][13] = "83";

    for (let i = 66; i <= 91; i++) {
        x[i][0] = String(i);
        x[i][1] = 'B';
        for (let j = 2; j < 14; j++) {
            if ((i >= 81) && (j === 2 || j === 3)) {
                if (j === 2) {
                    x[i][j] = "49";
                } else {
                    x[i][j] = "50";
                }
                continue;
            }

            if ((i >= 81) && (j === 11)) {
                x[i][j] = "0";
                continue;
            }

            if ((i >= 86) && (j === 10)) {
                x[i][j] = "0";
                continue;
            }
            if ((i >= 77) && (j === 12 || j === 13)) {
                if (j === 12) {
                    x[i][j] = "90";
                } else {
                    x[i][j] = "95";
                }
                continue;
            }
            else {
                let temp = Number(x[i - 1][j]);
                temp++;
                x[i][j] = String(temp);
            }
        }
    }
    return x;
}

function getGrade(mca, score) {
    const ret = ['?', '?', '?'];

    if (isNaN(mca) || isNaN(score)) return ret;

    mca = Math.round(mca);
    score = Math.round(score);

    if (mca < 30 || mca > 91) {
        return ret;
    }

    const x = createData()[mca];
    if (!x) return ret;

    if (score < 30 || score <= Number(x[2])) {
        ret[0] = 'F';
        ret[1] = '-';
        let j = 3;
        while (j < 14 && x[j] === "0") {
            j++;
        }
        ret[2] = j < 14 ? getLetter(j) : '-';
        return ret;
    }

    if (score >= Number(x[13] || x[13] === "0")) {
        ret[0] = 'A+';
        ret[1] = 'A';
        ret[2] = '-';
        return ret;
    }

    for (let i = 3; i < 14; i++) {
        if (x[i] === '0') continue;

        const threshold = Number(x[i]);

        if (score === threshold) {
            ret[0] = getLetter(i);

            let prev = i - 1;
            while (prev > 2 && x[prev] === '0') prev--;
            ret[1] = prev > 2 ? getLetter(prev) : 'F';

            let next = i + 1;
            while (next < 14 && x[next] === '0') next++;
            ret[2] = next < 14 ? getLetter(next) : '-';

            return ret;
        }

        if (score < threshold) {
            ret[0] = getLetter(i - 1);

            let prev = i - 2;
            while (prev > 2 && x[prev] === '0') prev--;
            ret[1] = prev > 2 ? getLetter(prev) : 'F';

            ret[2] = getLetter(i);
            return ret;
        }
    }
    return ret;
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


function getGradeClass(grade) {
    return `grade-${grade.replace('+', 'plus').replace('-', 'minus')}`;
}
if (!window.gradeUtils) {
    window.gradeUtils = {};
}
// Verify all functions are properly exposed
if (typeof window.gradeUtils.getGrade !== 'function') {
    console.error('Failed to properly expose getGrade function');
}

})();
