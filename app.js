const themeToggler = document.querySelector(".theme-toggler");
const TArray = require('./inject.js'); // Importing the array from inject.js
const subjectsContainer = document.querySelector(".subjects"); // This is the container for subjects
themeToggler.onclick = function () {
    document.body.classList.toggle('dark-theme');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
};

TArray.forEach(item => {
    // Create the subject element
    const subjectElement = document.createElement('div');
    subjectElement.classList.add('eg');

    // Create the content for the subject (course name, grade, etc.)
    subjectElement.innerHTML = `
        <span class="material-icons-sharp">${item.courseName}</span>
        <h3>${item.courseName}</h3>
        <div class="progress">
            <div class="grade"><p>${item.grade}</p></div>
        </div>
        <small class="text-muted">Last 24 Hours</small>
    `;
    
    // Append the subject element to the container
    subjectsContainer.appendChild(subjectElement);
});
