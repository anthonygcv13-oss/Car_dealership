const http = require('http');

const runTest = async () => {
  const url = 'http://localhost:3000/api/auth/login';
  const postData = JSON.stringify({
    email: 'test@example.com',
    password: 'wrongpassword'
  });

  const makeRequest = (i) => {
    return new Promise((resolve) => {
      const req = http.request(
        {
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            console.log(`Request #${i} | Status: ${res.statusCode} | Cabecera limit: ${res.headers['ratelimit-remaining'] || 'N/A'} | Body: ${data}`);
            resolve({ statusCode: res.statusCode });
          });
        }
      );

      req.on('error', (err) => {
        console.error(`Request #${i} failed:`, err.message);
        resolve({ error: err.message });
      });

      req.write(postData);
      req.end();
    });
  };

  console.log('--- Iniciando prueba de Rate Limiting para Login (Límite: 5 peticiones) ---');
  for (let i = 1; i <= 6; i++) {
    await makeRequest(i);
  }
};

runTest();
