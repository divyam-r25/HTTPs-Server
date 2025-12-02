const net = require('net');
const fs = require('fs');
const url = require('url');

const PORT = 8080;


function parseHttpRequest(rawData) {

  const [headerSection, ...bodyParts] = rawData.split('\r\n\r\n');
  const headerLines = headerSection.split('\r\n');

  const requestLine = headerLines[0];
  const [method, pathname, httpVersion] = requestLine.split(' ');
 
  const headers = {};
  for (let i = 1; i < headerLines.length; i++) {
    const [key, value] = headerLines[i].split(': ');
    if (key) {
      headers[key.toLowerCase()] = value;
    }
  }
  
  const parsedUrl = url.parse(pathname, true);
  
  return {
    method,
    path: parsedUrl.pathname,
    query: parsedUrl.query,
    httpVersion,
    headers,
    body: bodyParts.join('\r\n\r\n'),
    fullPath: pathname
  };
}

function sendResponse(socket, statusCode, statusMessage, body, contentType = 'text/plain') {
  const headers = {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    'Connection': 'close'
  };
  
  let response = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;
  

  for (const [key, value] of Object.entries(headers)) {
    response += `${key}: ${value}\r\n`;
  }
  
  response += '\r\n';
  
 
  socket.write(response + body);
}


function logRequest(method, path, callback) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${method} ${path}\n`;
  
  fs.appendFile('log.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
    if (callback) callback();
  });
}

const routes = {
  'GET': {
    '/': (socket, req) => {
      sendResponse(socket, 200, 'OK', 'Welcome to Homepage!');
    },
    
    '/about': (socket, req) => {
      const name = req.query.myname || 'Guest';
      sendResponse(socket, 200, 'OK', `Hey, I am ${name}`);
    },
    
    '/Signup': (socket, req) => {
      const html = `
        <html>
          <body>
            <h1>Sign Up Form</h1>
            <form method="POST" action="/signup">
              <input type="text" name="username" placeholder="Username" required>
              <input type="email" name="email" placeholder="Email" required>
              <input type="password" name="password" placeholder="Password" required>
              <button type="submit">Sign Up</button>
            </form>
          </body>
        </html>
      `;
      sendResponse(socket, 200, 'OK', html, 'text/html');
    }
  },
  
  'POST': {
    '/Signup': (socket, req) => {
  
      const formData = req.body
        .split('&')
        .reduce((acc, pair) => {
          const [key, value] = pair.split('=');
          acc[decodeURIComponent(key)] = decodeURIComponent(value);
          return acc;
        }, {});
      
      console.log('Form Data Received:', formData);
      sendResponse(socket, 200, 'OK', 'Sign up successful!');
    }
  },
  
  'PUT': {
    '/update': (socket, req) => {
      sendResponse(socket, 200, 'OK', 'Data Updated Successfully');
    }
  },
  
  'PATCH': {
    '/modify': (socket, req) => {
      sendResponse(socket, 200, 'OK', 'Data Modified Successfully');
    }
  },
  
  'DELETE': {
    '/delete': (socket, req) => {
      sendResponse(socket, 200, 'OK', 'Data Deleted Successfully');
    }
  }
};

const server = net.createServer((socket) => {
  let rawRequest = '';
  const contentLengthHeader = socket.headers ? socket.headers['content-length'] : 0;
  

  socket.on('data', (chunk) => {
    rawRequest += chunk.toString('utf8');
    
    
    const headerEndIndex = rawRequest.indexOf('\r\n\r\n');
    
    if (headerEndIndex !== -1) {
  
      let parsedRequest;
      try {
        parsedRequest = parseHttpRequest(rawRequest);
      } catch (error) {
        console.error('Parse error:', error);
        sendResponse(socket, 400, 'Bad Request', 'Invalid HTTP Request');
        socket.end();
        return;
      }
      
      logRequest(parsedRequest.method, parsedRequest.path, () => {
        console.log(`${parsedRequest.method} ${parsedRequest.path}`);
      });
      
  
      const routeHandler = routes[parsedRequest.method] && 
                          routes[parsedRequest.method][parsedRequest.path];
      
      if (routeHandler) {
        
        routeHandler(socket, parsedRequest);
      } else {
      
        sendResponse(socket, 404, 'Not Found', '404 - Page Not Found');
      }
      
     
      socket.end();
    }
  });
  
  socket.on('error', (err) => {
    console.error('Socket error:', err);
    socket.end();
  });
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});



server.listen(PORT, () => {
  console.log(`\n HTTP Server running at http://localhost:${PORT}`);
  console.log('Available Routes:');
  console.log('  GET  /');
  console.log('  GET  /about?name=YourName');
  console.log('  GET  /signup');
  console.log('  POST /signup');
  console.log('  PUT  /update');
  console.log('  PATCH /modify');
  console.log('  DELETE /delete\n');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
