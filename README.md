## Admin Server Documentation

### Overview

The Admin Server provides endpoints for managing trash reports and user authentication. All paths in this route require an authorization header with an account level of 100.

### Instalization

- Ensure you has installed sure-backend-api (sure client api)
- Setting .env like your sure client api

### HOW TO BE ADMIN SURE

Please register account first with register api at sure-backend-api and then change level field in your account to 100 with MySQL Query.
OR Use Demo Account: 
- username: Admin1
- password: admin

### Endpoints

#### 1. GET /trash

- **Description**: Retrieves a list of trash reports.
- **Authorization Level**: 100

#### 2. GET /trash/{id}

- **Description**: Retrieves detailed information about a specific trash report.
- **Authorization Level**: 100

#### 3. GET /proof

- **Description**: Retrieves a list of trash proof reports.
- **Authorization Level**: 100

#### 4. GET /proof/{id}

- **Description**: Retrieves detailed information about a specific trash proof report.
- **Authorization Level**: 100

#### 5. PUT /verify-trash/{id}

- **Description**: Verifies a trash report.
- **Authorization Level**: 100

#### 6. PUT /remove-trash/{id}

- **Description**: Removes a trash report.
- **Authorization Level**: 100

#### 7. PUT /unremove-trash/{id}

- **Description**: Restores a previously removed trash report.
- **Authorization Level**: 100

#### 8. PUT /verify-proof/{id}

- **Description**: Verifies a trash proof report.
- **Authorization Level**: 100

#### 9. POST /login

- **Description**: Logs in a admin.

  - **Payload**:
    - username (String, required): Username of the user.
    - password (String, required): Password of the user.

### Example Request

```http
POST /login
Host: sureadminapi.riandev.xyz
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

### Example Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "full_name": "admin_name"
}
```

### Authorization Header

All endpoints except for `/login` require an authorization header with an account level of 100.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Notes

- Replace `{id}` in the paths with the actual ID of the trash or proof report.
- Ensure the authorization header is included in each request to authorized endpoints.
- For successful data manipulation, use the correct method and payload as described in each endpoint's documentation.
