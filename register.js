const https = require('https');

const register = async () => {
  const data = JSON.stringify({
    email: "your_email@college.edu",
    name: "Your Name",
    mobileNo: "9999999999",
    githubUsername: "your_github_username",
    rollNo: "your_roll_number",
    accessCode: "provided_access_code"
  });

  const options = {
    hostname: '20.207.122.201',
    port: 443,
    path: '/evaluation-service/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log('Registration Response:', JSON.parse(responseData));
      // Save clientID and clientSecret
    });
  });

  req.write(data);
  req.end();
};

register();