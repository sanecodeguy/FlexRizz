// api/submit-course.js
const { Octokit } = require('@octokit/rest');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({ auth });

    const { courseCode, courseTitle, gradingType, department, creditHours, hasLab } = req.body;

    const response = await octokit.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title: `New Course Request: ${courseCode} - ${courseTitle}`,
      body: `**Course Details:**
- Code: ${courseCode}
- Title: ${courseTitle}
- Grading Type: ${gradingType}
- Department: ${department}
- Credit Hours: ${creditHours}
- Includes Lab: ${hasLab ? 'Yes' : 'No'}`,
      labels: ['course-request']
    });

    return res.status(200).json({ 
      message: 'Request submitted successfully!',
      issueUrl: response.data.html_url
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to submit request',
      details: error.message 
    });
  }
};
