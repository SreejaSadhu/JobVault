# JobVault Authentication System Guide

## Overview
JobVault uses a **dual authentication system** with two separate database collections and three user roles.

## Database Collections

### 1. Admin Collection (`Admin` model)
- **Purpose**: Stores dedicated admin accounts registered via Admin Registration
- **Fields**: name, email, password, isAdmin (always true), adminCode
- **Login Endpoint**: `/admin/login`
- **Registration**: Requires secret admin code "ADMIN_SECRET"
- **Access Level**: Full admin privileges

### 2. User Collection (`User` model)
- **Purpose**: Stores all student accounts and users with assigned roles
- **Fields**: name, email, password, role (student/viewer/admin), academic details, etc.
- **Login Endpoint**: `/auth/login`
- **Registration**: Open student registration
- **Access Levels**: 
  - `student` - Regular student access
  - `viewer` - Read-only admin dashboard access
  - `admin` - Full admin privileges (assigned by admin)

## User Roles Explained

### Student Role
- **Default role** for all registered users
- Access to student portal features
- Can view companies, apply for jobs, share interview experiences
- Login via: **Student Login** page

### Viewer Role
- **Assigned by admins** to specific users in User collection
- Read-only access to admin dashboards and reports
- Can view analytics but cannot modify data
- Login via: **Admin Login** page

### Admin Role
- **Two types of admin accounts**:
  1. **Dedicated Admins** (Admin collection) - Registered via Admin Registration
  2. **Promoted Users** (User collection with role='admin') - Assigned by existing admins
- Full CRUD access to all features
- Login via: **Admin Login** page

## Login Flow

### Student Login (`/student-login`)
1. Authenticates against **User collection** only
2. Checks user role after successful authentication
3. **If role is 'student'**: Redirects to `/home`
4. **If role is 'admin' or 'viewer'**: Shows error, redirects to Admin Login

### Admin Login (`/admin-login`)
1. **First attempt**: Tries **Admin collection** (`/admin/login`)
   - If successful → Redirects to `/admindashboard`
2. **Fallback**: If not found in Admin collection, tries **User collection** (`/auth/login`)
   - If role is 'admin' → Redirects to `/admindashboard`
   - If role is 'viewer' → Redirects to `/viewerdashboard`
   - If role is 'student' → Shows "Access denied" error

## Registration Flow

### Student Registration (`/register`)
- Creates account in **User collection**
- Default role: `student`
- No admin code required
- Redirects to Student Login after registration

### Admin Registration (`/admin/register`)
- Creates account in **Admin collection**
- Requires secret admin code: `ADMIN_SECRET`
- isAdmin flag set to true
- Redirects to Admin Login after registration

## Role Assignment

### How to Create a Viewer
1. User registers as student via Student Registration
2. Admin logs in and goes to User Role Management
3. Admin assigns "viewer" role to the user
4. User can now login via Admin Login page

### How to Create an Admin (User Collection)
1. User registers as student via Student Registration
2. Admin logs in and goes to User Role Management
3. Admin assigns "admin" role to the user
4. User can now login via Admin Login page with full admin access

## Important Notes

### localStorage Keys
- `userRole`: Stores current user's role ('student', 'viewer', or 'admin')
- Used by App.js to determine which navbar to display

### Cookie-based Authentication
- JWT tokens stored in HTTP-only cookies
- Token expires in 1 hour
- Secure flag enabled for HTTPS
- SameSite: 'none' for cross-origin requests

### Navigation Guards
- Routes check authentication via `/auth/verify` or `/admin/verify`
- Navbar changes based on userRole in localStorage
- Protected routes redirect to login if not authenticated

## Common Issues & Solutions

### Issue: Admin login redirects to student dashboard
**Cause**: localStorage has 'student' role set
**Solution**: Clear localStorage and login again via Admin Login page

### Issue: Viewer can't access admin pages
**Cause**: Role not properly set in User collection
**Solution**: Admin must assign viewer role via User Role Management

### Issue: Admin registration doesn't work
**Cause**: Incorrect admin code
**Solution**: Use exact code "ADMIN_SECRET" (case-sensitive)

### Issue: Student trying to access admin features
**Cause**: Using wrong login page
**Solution**: Students must use Student Login, admins/viewers use Admin Login

## API Endpoints Summary

### Admin Routes (`/admin/*`)
- `POST /admin/register` - Register new admin
- `POST /admin/login` - Admin login (Admin collection)
- `GET /admin/verify` - Verify admin token
- `POST /admin/assignViewerRole` - Assign viewer role to user
- `POST /admin/removeViewerRole` - Remove viewer role from user
- `GET /admin/getUsersWithRoles` - Get all users with roles

### User Routes (`/auth/*`)
- `POST /auth/register` - Register new student
- `POST /auth/login` - User login (User collection)
- `GET /auth/verify` - Verify user token
- `GET /auth/verifyViewer` - Verify viewer access
- `GET /auth/currentUser` - Get current user details

## Security Considerations

1. **Admin Code**: Change "ADMIN_SECRET" to a secure value in production
2. **JWT Secret**: Set strong KEY in environment variables
3. **Password Hashing**: Uses bcrypt with salt rounds of 10
4. **HTTPS**: Always use HTTPS in production for secure cookies
5. **Token Expiry**: Tokens expire after 1 hour for security

## Development vs Production

### Development
- Cookies work on localhost
- CORS allows localhost origins
- Detailed console logging enabled

### Production
- Secure cookies required (HTTPS)
- CORS restricted to specific domains
- Environment variables for sensitive data
- Admin code should be changed from default
