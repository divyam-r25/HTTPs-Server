# HTTP Server

Built a basic HTTP/1.1 server using Node.js `net` module (raw TCP sockets) without `http.createServer()` or any HTTP parsing libraries.

## How It Works

1. **TCP Server**: `net.createServer()` listens on port 8080 for raw socket connections
2. **Manual HTTP Parsing**:
   - Receive raw data chunks → convert to string
   - Split on `\r\n\r\n` to separate headers from body
   - First line → `METHOD PATH HTTP/1.1` (detects GET/POST etc.)
   - Loop through header lines → split on `: ` to build headers object
3. **Routing**: Match `method + path` against the routes object
4. **Manual Response**: Build HTTP response string → `HTTP/1.1 200 OK\r\nHeaders\r\n\r\nBody`
5. **Logging**: All requests logged to `log.txt` with timestamps

## Routes

- `GET /` → Returns `"Welcome to Homepage!"`
- `GET /about` → Returns `"Hey, I am [myname]"` (using query parameter)
- `GET /Signup` → Returns an HTML sign-up form
- `POST /Signup` → Parses form data and returns `"Sign up successful!"`
- `PUT /update` → Returns `"Data Updated Successfully"`
- `PATCH /modify` → Returns `"Data Modified Successfully"`
- `DELETE /delete` → Returns `"Data Deleted Successfully"`

## Key Files

- `log.txt` — automatically stores all incoming request logs with timestamp
- No external dependencies or `node_modules` committed/used

## Error Handling

- Returns `400 Bad Request` for parsing errors
- Returns `404 Not Found` for unknown routes
- Handles socket errors gracefully
- Supports graceful shutdown on Ctrl+C (SIGINT)

## Installation & Usage

1. Make sure you have Node.js installed
2. Run the server:

```bash
node server.js
```

The server will start on `http://localhost:8080`

## Testing

### Using curl

```bash
# Test GET /
curl http://localhost:8080/

# Test GET /about with query param
curl "http://localhost:8080/about?myname=John"

# Test GET /Signup (HTML form)
curl http://localhost:8080/Signup

# Test POST /Signup
curl -X POST -d "username=test&email=test@test.com" http://localhost:8080/Signup

# Test PUT /update
curl -X PUT http://localhost:8080/update

# Test PATCH /modify
curl -X PATCH http://localhost:8080/modify

# Test DELETE /delete
curl -X DELETE http://localhost:8080/delete

# Test 404 Not Found
curl http://localhost:8080/unknown
```

### Using Browser

Open your browser and navigate to:
- `http://localhost:8080/` — Homepage
- `http://localhost:8080/about?myname=YourName` — About page
- `http://localhost:8080/Signup` — Sign up form

## How to Understand the Code

The server works in 3 main functions:

1. **parseHttpRequest()** - Takes raw HTTP text and extracts method, path, headers, and body
2. **sendResponse()** - Builds an HTTP response string with status, headers, and body
3. **socket.on('data')** - Receives incoming requests, parses them, routes them, and sends responses

The `routes` object maps `method + path` combinations to handler functions that generate responses.


