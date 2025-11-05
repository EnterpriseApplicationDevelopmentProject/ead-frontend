# Dynamic Dashboard - Complete Setup Guide

## ✅ What Has Been Done

### Backend (Spring Boot)
1. ✅ Created DTOs for Dashboard, Customer, Appointment, Project
2. ✅ Created DashboardService interface and implementation
3. ✅ Created DashboardController with endpoints for dashboard stats
4. ✅ Created AppointmentController with endpoints for all customer appointments
5. ✅ Created ProjectController with endpoints for all customer projects
6. ✅ All endpoints use existing entities (Customer, Vehicle, Appointment, Project)
7. ✅ No mock data - fetches real data from PostgreSQL database

### Frontend (Next.js/React)
1. ✅ Created `src/services/apiService.ts` with axios HTTP client
2. ✅ Updated all customer pages to use real API instead of mock data:
   - Dashboard page (`/customer/dashboard`)
   - My Appointments page (`/customer/my-appointments`)
   - My Projects page (`/customer/my-projects`)
3. ✅ Added proper error handling and loading states
4. ✅ Implemented delete functionality for appointments and projects
5. ✅ Updated TypeScript types to match backend DTOs
6. ✅ Created `.env.local` for API configuration

## 🎯 Backend API Endpoints

### Dashboard Endpoints
```
GET  /api/dashboard/stats/{customerId}
GET  /api/dashboard/profile/{customerId}
GET  /api/dashboard/appointments/upcoming/{customerId}
GET  /api/dashboard/projects/ongoing/{customerId}
```

### Appointment Endpoints
```
GET    /api/appointments/customer/{customerId}
DELETE /api/appointments/{appointmentId}
```

### Project Endpoints
```
GET    /api/projects/customer/{customerId}
GET    /api/projects/customer/{customerId}/completed
DELETE /api/projects/{projectId}
```

## 🚀 How to Test

### Step 1: Start Backend
```bash
cd D:\EAD-backend\ead-automobile
.\mvnw.cmd spring-boot:run
```

Backend will start on `http://localhost:8080`

### Step 2: Verify Database Has Test Data

Open pgAdmin and connect to `auto-mobile-3` database. Check you have:

**1. Customer Table:**
```sql
SELECT * FROM customers LIMIT 5;
```
Note the customer ID (e.g., 1)

**2. Vehicles:**
```sql
SELECT * FROM vehicles WHERE customer_id = 1;
```

**3. Appointments:**
```sql
SELECT * FROM appointments WHERE customer_id = 1;
```

**4. Projects:**
```sql
SELECT * FROM projects WHERE customer_id = 1;
```

### Step 3: Test Backend with Thunder Client

**Test 1: Dashboard Stats**
```
GET http://localhost:8080/api/dashboard/stats/1

Expected Response:
{
  "totalVehicles": 3,
  "upcomingAppointments": 2,
  "ongoingProjects": 1
}
```

**Test 2: Customer Profile**
```
GET http://localhost:8080/api/dashboard/profile/1

Expected Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "createdAt": "2025-01-15T10:30:00"
}
```

**Test 3: All Appointments**
```
GET http://localhost:8080/api/appointments/customer/1

Expected Response: Array of appointments
```

**Test 4: All Projects**
```
GET http://localhost:8080/api/projects/customer/1

Expected Response: Array of projects
```

### Step 4: Start Frontend
```bash
cd D:\EAD-frontend\ead-frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

### Step 5: Configure Customer ID

Open browser and navigate to `http://localhost:3000`

**Option A: Using Browser Console**
1. Press F12 to open DevTools
2. Go to Console tab
3. Run this command:
```javascript
localStorage.setItem('customerId', '1')
```
4. Refresh the page

**Option B: Later - Use Real Login**
When you implement authentication, the login endpoint should:
```javascript
// After successful login
localStorage.setItem('customerId', responseData.customerId);
localStorage.setItem('authToken', responseData.token);
```

### Step 6: Test Frontend Pages

**1. Dashboard Page**
Navigate to: `http://localhost:3000/customer/dashboard`

Should display:
- ✅ Welcome message with customer name
- ✅ Stats cards with actual counts from database
- ✅ Upcoming appointments cards (up to 4)
- ✅ Ongoing projects cards (up to 4)
- ✅ "No data" message if no records exist

**2. My Appointments Page**
Navigate to: `http://localhost:3000/customer/my-appointments`

Should display:
- ✅ Stats showing upcoming, completed, cancelled counts
- ✅ Tabs to filter appointments (All, Upcoming, Completed, Cancelled)
- ✅ Table with all appointments
- ✅ Delete button (trash icon) for each appointment
- ✅ Book Appointment button

**3. My Projects Page**
Navigate to: `http://localhost:3000/customer/my-projects`

Should display:
- ✅ Stats showing ongoing and completed counts
- ✅ Tabs to filter projects (All, Ongoing, Completed)
- ✅ Table with all projects
- ✅ Delete button (trash icon) for each project
- ✅ New Project button

## 🐛 Troubleshooting

### Problem: "Failed to load dashboard data"
**Solutions:**
1. Check backend is running on port 8080
2. Verify `.env.local` exists with correct API URL
3. Check customerId is set in localStorage
4. Look at browser Network tab for error details

### Problem: "Customer ID not found"
**Solution:**
```javascript
// Set customer ID in browser console
localStorage.setItem('customerId', '1')
```

### Problem: No data showing
**Solutions:**
1. Verify customer ID exists in database
2. Check customer has associated vehicles/appointments/projects
3. Check backend console for errors
4. Test API endpoints directly with Thunder Client

### Problem: CORS errors
**Solution:**
Ensure all controllers have:
```java
@CrossOrigin(origins = "*")
```

### Problem: 404 Not Found on API calls
**Solutions:**
1. Verify backend is running
2. Check endpoint URLs in `apiService.ts`
3. Verify controllers are in `controller` package
4. Check Spring Boot startup logs for errors

## 📝 Creating Test Data

If you don't have test data, you can insert some manually:

```sql
-- Insert a test customer (assuming user exists with id=1)
INSERT INTO customers (user_id, phone_number, address, created_at)
VALUES (1, '1234567890', '123 Test St', NOW());

-- Insert a test vehicle
INSERT INTO vehicles (customer_id, model, make, color, license_plate, year, vin)
VALUES (1, 'Camry', 'Toyota', 'Blue', 'ABC-123', 2020, 'VIN123456789');

-- Insert a test appointment
INSERT INTO appointments (customer_id, vehicle_id, appointment_time, status, estimated_duration_minutes, created_at)
VALUES (1, 1, NOW() + INTERVAL '2 days', 'PENDING', 60, NOW());

-- Insert a test project
INSERT INTO projects (customer_id, vehicle_id, service_description, status, estimated_cost, created_at)
VALUES (1, 1, 'Oil change and tire rotation', 'IN_PROGRESS', 150.00, NOW());
```

## 🎓 Understanding the Flow

### Data Flow: Backend to Frontend

1. **User opens dashboard**
   - Frontend calls `customerService.getProfile()`
   - Gets customer ID from localStorage
   - Calls `/api/dashboard/profile/{customerId}`

2. **Load dashboard stats**
   - Frontend calls `dashboardService.getDashboardStats(customerId)`
   - Backend queries database: counts vehicles, appointments, projects
   - Returns stats object

3. **Load appointments**
   - Frontend calls `appointmentService.getUpcomingAppointments(customerId)`
   - Backend filters appointments by status and date
   - Returns sorted list of appointments

4. **Load projects**
   - Frontend calls `projectService.getOngoingProjects(customerId)`
   - Backend filters projects by status
   - Returns sorted list of projects

### Status Mapping

**Appointment Statuses:**
- `PENDING` - Waiting for admin to assign employee
- `CONFIRMED` - Employee assigned, awaiting start
- `IN_PROGRESS` - Work in progress
- `COMPLETED` - Finished
- `CANCELLED` - Cancelled by customer or admin

**Project Statuses:**
- `PENDING` - Submitted, waiting for review
- `UNDER_REVIEW` - Admin reviewing request
- `ASSIGNED` - Assigned to employee
- `IN_PROGRESS` - Work in progress
- `COMPLETED` - Finished
- `CANCELLED` - Cancelled

## 🔒 Authentication Integration (Next Steps)

Currently using localStorage for customerId. To integrate with authentication:

1. **After successful login:**
```typescript
// In your login component
const handleLogin = async (email: string, password: string) => {
  const response = await loginAPI(email, password);
  localStorage.setItem('customerId', response.data.customerId);
  localStorage.setItem('authToken', response.data.token);
  router.push('/customer/dashboard');
};
```

2. **Update apiService.ts** (already done):
The API service automatically includes the auth token from localStorage in all requests.

3. **Add logout:**
```typescript
const handleLogout = () => {
  localStorage.removeItem('customerId');
  localStorage.removeItem('authToken');
  router.push('/auth/login');
};
```

## ✨ Summary

**You no longer need to:**
- ❌ Create mock data
- ❌ Manually set IDs in components
- ❌ Import mockData files

**Everything is now dynamic:**
- ✅ Fetches real data from PostgreSQL via Spring Boot API
- ✅ Updates in real-time when data changes
- ✅ Delete operations refresh the list automatically
- ✅ Proper error handling and loading states
- ✅ Ready for production use (after adding authentication)

**Just remember:**
1. Start backend first
2. Set customerId in localStorage (or implement login)
3. All pages fetch data dynamically from database
