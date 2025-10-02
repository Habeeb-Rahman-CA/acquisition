# User CRUD Operations - API Examples

This document provides examples of how to use the new User CRUD operations implemented in the application.

## Authentication Required

For `PUT` and `DELETE` operations, you need to be authenticated. First, sign up or sign in to get an authentication cookie:

### Sign Up

```bash
curl -X POST http://localhost:3000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }' \
  -c cookies.txt
```

### Sign In

```bash
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

## User CRUD Operations

### 1. Get All Users

```bash
curl -X GET http://localhost:3000/users
```

**Response:**

```json
{
  "message": "Successfully retrieved users",
  "users": [
    {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 2. Get User by ID

```bash
curl -X GET http://localhost:3000/users/1
```

**Response:**

```json
{
  "message": "Successfully retrieved user",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Cases:**

```bash
# Invalid ID format
curl -X GET http://localhost:3000/users/abc
# Response: 400 Bad Request - "ID must be a positive integer"

# User not found
curl -X GET http://localhost:3000/users/999
# Response: 404 Not Found - "User not found"
```

### 3. Update User (Authentication Required)

#### Update Own Profile

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }'
```

#### Update Password

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "newpassword123"
  }'
```

#### Admin Updates User Role (Admin Only)

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "role": "admin"
  }'
```

**Response:**

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "johnsmith@example.com",
    "name": "John Smith",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Cases:**

```bash
# No authentication
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
# Response: 401 Unauthorized - "Access token required"

# User trying to update another user
curl -X PUT http://localhost:3000/users/2 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Test"}'
# Response: 403 Forbidden - "You can only update your own profile"

# User trying to change role
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"role": "admin"}'
# Response: 403 Forbidden - "Only admins can change user roles"

# Empty update
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{}'
# Response: 400 Bad Request - "At least one field must be provided for update"

# Invalid email format
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"email": "invalid-email"}'
# Response: 400 Bad Request - "Invalid email format"
```

### 4. Delete User (Authentication Required)

#### Delete Own Profile

```bash
curl -X DELETE http://localhost:3000/users/1 \
  -b cookies.txt
```

#### Admin Deletes User

```bash
curl -X DELETE http://localhost:3000/users/2 \
  -b admin_cookies.txt
```

**Response:**

```json
{
  "message": "User deleted successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Cases:**

```bash
# No authentication
curl -X DELETE http://localhost:3000/users/1
# Response: 401 Unauthorized - "Access token required"

# User trying to delete another user
curl -X DELETE http://localhost:3000/users/2 \
  -b cookies.txt
# Response: 403 Forbidden - "You can only delete your own profile"

# Last admin trying to delete themselves
curl -X DELETE http://localhost:3000/users/1 \
  -b admin_cookies.txt
# Response: 409 Conflict - "Cannot delete the last admin account"

# User not found
curl -X DELETE http://localhost:3000/users/999 \
  -b cookies.txt
# Response: 404 Not Found - "User not found"
```

## Business Rules Implemented

### Authorization Rules:

1. **Update User**: Users can only update their own profile, admins can update any user
2. **Role Changes**: Only admins can change user roles
3. **Delete User**: Users can delete their own profile, admins can delete any user
4. **Last Admin Protection**: The last admin in the system cannot be deleted

### Validation Rules:

1. **ID Validation**: Must be a positive integer
2. **Email Validation**: Must be valid email format
3. **Password Validation**: Minimum 6 characters, maximum 128 characters
4. **Name Validation**: Minimum 2 characters, maximum 255 characters
5. **Role Validation**: Must be either "user" or "admin"
6. **Update Requirement**: At least one field must be provided for updates

### Security Features:

1. **JWT Authentication**: Required for update and delete operations
2. **Password Hashing**: Passwords are automatically hashed before storage
3. **Input Sanitization**: All inputs are validated and sanitized
4. **Proper Error Handling**: Consistent error responses with appropriate HTTP status codes
5. **Logging**: All operations are properly logged for audit trails

## Testing the Implementation

To test the complete implementation:

1. **Start the application** (make sure your database is running)
2. **Create a test user** using the sign-up endpoint
3. **Test each CRUD operation** using the examples above
4. **Create an admin user** and test admin-specific operations
5. **Try the error cases** to verify proper validation and authorization

Remember to replace `http://localhost:3000` with your actual application URL and port.
