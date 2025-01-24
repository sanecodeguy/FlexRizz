// inject.js
let studentName = "";
let degree = "";
let dob = "";
let contactNumber = "";
let email = "";
let address = "";

if (window.location.href === "https://flexstudent.nu.edu.pk/") {
  function getFieldValue(label) {
    const allParagraphs = document.querySelectorAll(".m-portlet__body p");
    for (const paragraph of allParagraphs) {
      if (paragraph.textContent.includes(label)) {
        const spans = paragraph.querySelectorAll("span");
        return spans[spans.length - 1]?.textContent.trim(); // Get the last span
      }
    }
    return null;
  }

  // Extracting information
  studentName = getFieldValue("Name:");
  degree = getFieldValue("Degree:");
  dob = getFieldValue("DOB:");
  contactNumber = getFieldValue("Mobile No:");
  email = getFieldValue("Email:");
  address = getFieldValue("Address:");

  // Log for debugging
//   console.log({ studentName, degree, dob, contactNumber, email, address });
}


sessionStorage.setItem('studentName', studentName);
sessionStorage.setItem('degree', degree);
sessionStorage.setItem('dob', dob);
sessionStorage.setItem('contactNumber', contactNumber);
sessionStorage.setItem('email', email);
sessionStorage.setItem('address', address);
