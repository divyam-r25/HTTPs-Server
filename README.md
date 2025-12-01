# Node.js HTTP Server with Logging

This is a lightweight HTTP server built using only Node.js core modules—**http**, **fs**, and **url**.  
It demonstrates basic routing, handling multiple HTTP methods, parsing JSON payloads, and appending logs for each request.  

---

## Features

- **Custom Routing:** Handles `/`, `/about`, `/Signup`, `/update`, `/modify`, `/delete` with correct HTTP methods.
- **Request Logging:** Every request (method, url, time) is appended to `log.txt`.
- **Body Parsing:** Supports JSON body parsing for POST requests to `/Signup`.
- **Query Parsing:** Reads query params (e.g., `/about?myname=...`).
- **Status Codes:** Sends proper codes for success, method errors, or `404` for unknown routes.
- **Plaintext Responses:** For clarity and learning (switch to JSON easily if needed).
- **No External Packages:** Only Node's built-in modules.

---

## Endpoints

### `/` (Home)
- **GET**
- Returns: `Welcomme to the HomePage`

### `/about`
- **GET**
- Query parameter: `myname` (optional)
- Returns: `Hey, I am <myname>` or `Hey, I am Guest`

### `/Signup`
- **GET**: Returns `This is a signUp Form`
- **POST**: Accepts JSON body. Returns `Success` if valid, else `Request Failed` (400 error).

### `/update`
- **PUT**
- Returns: `Data Updated Successfully`

### `/modify`
- **PATCH**
- Returns: `Data modified successfully`

### `/delete`
- **DELETE**
- Returns: `Data removed Successfully`

### Everything Else
- Returns: `404 Not Found`

---

## Logging

Every request is appended to a file called **log.txt** in this format:
```
Example: 1733040000000: GET /about?myname=Divya New request Recieved
```
---

## Usage

1. **Install Node.js** if not already installed.
2. Save the code as (for example) `server.js`.
3. Open terminal in your project directory.
4. Start your server:
    ```
    node server.js
    ```
5. You should see:
    ```
    Server Started on port 8080
    ```
6. Test endpoints with your browser, curl, or Postman.

### Example Curl Commands

- Home:
    ```
    curl http://localhost:8080/
    ```
- About (with query param):
    ```
    curl "http://localhost:8080/about?myname=Divya"
    ```
- Signup POST:
    ```
    curl -X POST http://localhost:8080/Signup \
      -H "Content-Type: application/json" \
      -d "{\"username\":\"divya\",\"password\":\"12345\"}"
    ```
- Update (PUT):
    ```
    curl -X PUT http://localhost:8080/update
    ```
- Modify (PATCH):
    ```
    curl -X PATCH http://localhost:8080/modify
    ```
- Delete (DELETE):
    ```
    curl -X DELETE http://localhost:8080/delete
    ```

---

## Notes & Customization

- Change/add routes easily within the switch-case block.
- Log file grows over time; delete/reset as needed.
- For a real app, add validation, more meaningful responses, and connect to a database.
- All responses are plaintext; change content type in `sendResponese()` helper for JSON.

---
This is not completd ,I am working on it

