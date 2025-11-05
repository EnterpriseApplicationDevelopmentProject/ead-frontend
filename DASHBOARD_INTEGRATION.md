# Customer Dashboard - Backend Integration

## Overview
The customer dashboard has been updated to fetch data dynamically from the backend API instead of using mock data.

## Backend Changes

### 1. DTOs Created
- **DashboardStatsDTO**: Contains totalVehicles, upcomingAppointments, ongoingProjects
- **CustomerDTO**: Customer profile information with id, name, email, phoneNumber, address
- **AppointmentDTO**: Complete appointment details including vehicle and employee info
- **ProjectDTO**: Complete project details including service description and cost

### 2. Service Layer
- **DashboardService Interface**: Defines methods for dashboard data retrieval
- **DashboardServiceImpl**: Implementation that:
  - Fetches customer data with relationships
  - Counts vehicles by customer
  - Filters upcoming appointments (PENDING, CONFIRMED, IN_PROGRESS)
  - Filters ongoing projects (IN_PROGRESS, ASSIGNED, UNDER_REVIEW)
  - Converts entities to DTOs with proper formatting

### 3. REST API Endpoints
Created **DashboardController** with the following endpoints:

```
GET /api/dashboard/stats/{customerId}
- Returns: DashboardStatsDTO with counts

GET /api/dashboard/profile/{customerId}
- Returns: CustomerDTO with profile info

GET /api/dashboard/appointments/upcoming/{customerId}
- Returns: List<AppointmentDTO> of upcoming appointments

GET /api/dashboard/projects/ongoing/{customerId}
- Returns: List<ProjectDTO> of ongoing projects
```

## Frontend Changes

### 1. API Service Layer
Created `src/services/apiService.ts` with:
- Axios client configuration with base URL
- Request interceptor for authentication tokens
- Dashboard, Customer, Appointment, and Project services
- Proper TypeScript types

### 2. Environment Configuration
Created `.env.local` with:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Updated Types
Updated TypeScript interfaces to match backend DTOs:
- Customer id changed from string to number
- Added optional fields for backend compatibility
- Added appointmentTime, createdAt fields
- Added employeeName, serviceDescription fields

### 4. Dashboard Page Updates
- Import changed from mockApiService to real apiService
- Added error handling with user feedback
- Updated date/time formatting for backend datetime format
- Support for both appointmentTime and date/time fields
- Support for both employeeName and assignedEmployee fields

## Testing Instructions

### 1. Start Backend
```bash
cd D:\EAD-backend\ead-automobile
.\mvnw.cmd spring-boot:run
```

Backend should start on `http://localhost:8080`

### 2. Verify Database
Ensure PostgreSQL is running with database `auto-mobile-3`
Check that you have test data:
- At least one customer with id (e.g., 1)
- Some vehicles associated with that customer
- Some appointments (PENDING, CONFIRMED, or IN_PROGRESS status)
- Some projects (IN_PROGRESS, ASSIGNED, or UNDER_REVIEW status)

### 3. Test API Endpoints with Thunder Client

**Test Dashboard Stats:**
```
GET http://localhost:8080/api/dashboard/stats/1
```

**Test Customer Profile:**
```
GET http://localhost:8080/api/dashboard/profile/1
```

**Test Upcoming Appointments:**
```
GET http://localhost:8080/api/dashboard/appointments/upcoming/1
```

**Test Ongoing Projects:**
```
GET http://localhost:8080/api/dashboard/projects/ongoing/1
```

### 4. Start Frontend
```bash
cd D:\EAD-frontend\ead-frontend
npm run dev
```

Frontend should start on `http://localhost:3000`

### 5. Set Customer ID
For testing, you need to set the customerId in localStorage:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `localStorage.setItem('customerId', '1')`
4. Refresh the page

### 6. Navigate to Dashboard
Go to: `http://localhost:3000/customer/dashboard`

You should see:
- Welcome message with customer name
- Stats cards showing actual counts from database
- Upcoming appointments (if any exist)
- Ongoing projects (if any exist)

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure the backend controller has:
```java
@CrossOrigin(origins = "*")
```

### Authentication Errors
The API service includes auth token handling. If you get 401/403 errors:
1. Check if authentication is required
2. Add valid JWT token to localStorage: `localStorage.setItem('authToken', 'your-jwt-token')`
3. Or disable authentication for dashboard endpoints temporarily

### Connection Refused
- Verify backend is running on port 8080
- Check `.env.local` has correct API URL
- Ensure no firewall blocking localhost connections

### No Data Showing
- Verify customer ID exists in database
- Check that customer has associated vehicles/appointments/projects
- Look at browser DevTools Network tab for API responses
- Check backend console for any errors

## Integration with Existing Work
This implementation:
- ✅ Uses existing Vehicle entity and repository (already implemented by team)
- ✅ Uses existing Customer entity and repository (already implemented)
- ✅ Uses existing Appointment entity and repository (already implemented)
- ✅ Uses existing Project entity and repository (already implemented)
- ✅ Does NOT modify other team members' work
- ✅ Only creates new dashboard-specific service and controller
- ✅ Reuses existing DTOs and adds new ones for dashboard needs

## Next Steps
1. Implement authentication/login to get real customer ID
2. Add authentication context provider in frontend
3. Protect dashboard routes
4. Add loading skeletons instead of spinner
5. Add better error handling with toast notifications
6. Add refresh functionality
7. Implement real-time updates with WebSocket
