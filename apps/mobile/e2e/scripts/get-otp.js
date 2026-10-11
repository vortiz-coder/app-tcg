// Maestro runScript (runs on the host): polls the local Mailpit API for the OTP sent to EMAIL.
const query = encodeURIComponent('to:"' + EMAIL + '"');
let code = null;
for (let attempt = 0; attempt < 30 && !code; attempt++) {
  const res = http.get('http://localhost:54324/api/v1/search?query=' + query);
  const messages = json(res.body).messages || [];
  if (messages.length) code = (messages[0].Snippet.match(/\b\d{6}\b/) || [])[0];
}
if (!code) throw new Error('No OTP email for ' + EMAIL);
output.otp = code;
