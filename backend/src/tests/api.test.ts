process.env.NODE_ENV = 'test';
import http from 'http';
import app from '../server';

const PORT = 5001; // Use test port
let server: http.Server;
const BASE_URL = `http://localhost:${PORT}/api`;

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponseResult {
  status: number;
  ok: boolean;
  data: any;
}

async function request(path: string, options: RequestOptions = {}): Promise<ApiResponseResult> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions: any = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  const data: any = await res.json().catch(() => null);

  return {
    status: res.status,
    ok: res.ok,
    data,
  };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`, detail ? detail : '');
    throw new Error(`Test failed: ${testName}`);
  }
}

async function runTests() {
  console.log('\n==================================================');
  console.log('🧪 Starting GlobeTrotter Backend API Test Suite');
  console.log('==================================================\n');

  // Start test server on port 5001
  server = app.listen(PORT);

  try {
    // 1. Health Check
    console.log('\n--- 1. Health Check & Database Connectivity ---');
    const health = await request('/health');
    assert(health.status === 200, 'GET /api/health returns 200 OK');
    assert(health.data.success === true, 'Health check indicates success: true');
    assert(health.data.database === 'connected', 'Database reports "connected"');

    // 2. Authentication: Registration
    console.log('\n--- 2. Authentication APIs ---');
    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Jane Traveler',
        email: testEmail,
        password: 'Password@123',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
    });

    assert(regRes.status === 201, 'POST /api/auth/register returns 201 Created');
    assert(!!regRes.data.data.token, 'Registration returns JWT token');
    assert(regRes.data.data.user.email === testEmail, 'User email matches');
    assert(!regRes.data.data.user.passwordHash, 'Password hash is NOT exposed');

    const authToken = regRes.data.data.token;
    const authHeaders = { Authorization: `Bearer ${authToken}` };

    // Duplicate Registration Conflict
    const dupReg = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate User',
        email: testEmail,
        password: 'Password@123',
      },
    });
    assert(dupReg.status === 409, 'Duplicate email registration returns 409 Conflict');

    // Login
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'Password@123',
      },
    });
    assert(loginRes.status === 200, 'POST /api/auth/login returns 200 OK');
    assert(!!loginRes.data.data.token, 'Login returns JWT token');

    // Invalid Login
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'WrongPassword!',
      },
    });
    assert(badLogin.status === 401, 'Invalid password returns 401 Unauthorized');

    // GET /api/auth/me
    const authMe = await request('/auth/me', { headers: authHeaders });
    assert(authMe.status === 200, 'GET /api/auth/me returns 200 OK');
    assert(authMe.data.data.email === testEmail, 'GET /api/auth/me returns current user profile');

    // 3. User Management APIs
    console.log('\n--- 3. User Management APIs ---');
    const userMe = await request('/users/me', { headers: authHeaders });
    assert(userMe.status === 200, 'GET /api/users/me returns 200 OK');

    const updateMe = await request('/users/me', {
      method: 'PUT',
      headers: authHeaders,
      body: {
        name: 'Jane Traveler Updated',
      },
    });
    assert(updateMe.status === 200, 'PUT /api/users/me returns 200 OK');
    assert(updateMe.data.data.name === 'Jane Traveler Updated', 'Name updated successfully');

    // 4. Cities and Activities APIs
    console.log('\n--- 4. City & Activity APIs (PostgreSQL Querying) ---');
    const citiesRes = await request('/cities');
    assert(citiesRes.status === 200, 'GET /api/cities returns 200 OK');
    assert(Array.isArray(citiesRes.data.data) && citiesRes.data.data.length >= 16, 'Seeded cities retrieved from database');

    const searchCity = await request('/cities?search=Jaipur');
    assert(searchCity.status === 200, 'GET /api/cities?search=Jaipur returns 200 OK');
    assert(searchCity.data.data.length > 0 && searchCity.data.data[0].name === 'Jaipur', 'City search matches "Jaipur"');

    const jaipurId = searchCity.data.data[0].id;
    const singleCity = await request(`/cities/${jaipurId}`);
    assert(singleCity.status === 200, 'GET /api/cities/:id returns 200 OK');
    assert(singleCity.data.data.activities.length > 0, 'City includes activities list');

    // Activities search
    const actsRes = await request(`/activities?cityId=${jaipurId}`);
    assert(actsRes.status === 200, 'GET /api/activities?cityId=... returns 200 OK');
    assert(actsRes.data.data.length > 0, 'Activities filtered by cityId');
    const firstActId = actsRes.data.data[0].id;

    const singleAct = await request(`/activities/${firstActId}`);
    assert(singleAct.status === 200, 'GET /api/activities/:id returns 200 OK');

    // 5. Trip Management APIs
    console.log('\n--- 5. Trip Management APIs ---');
    const createTripRes = await request('/trips', {
      method: 'POST',
      headers: authHeaders,
      body: {
        title: 'Rajasthan Royal Heritage Vacation',
        description: 'Exploring Jaipur, Udaipur, and royal palaces.',
        startDate: '2026-11-01',
        endDate: '2026-11-10',
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        budgetLimit: 50000,
      },
    });

    assert(createTripRes.status === 201, 'POST /api/trips returns 201 Created');
    const tripId = createTripRes.data.data.id;
    assert(!!tripId, 'Trip ID generated');

    const userTrips = await request('/trips', { headers: authHeaders });
    assert(userTrips.status === 200, 'GET /api/trips returns 200 OK');
    assert(userTrips.data.data.length >= 1, 'User trips array returned with summary metrics');

    const tripDetails = await request(`/trips/${tripId}`, { headers: authHeaders });
    assert(tripDetails.status === 200, 'GET /api/trips/:id returns 200 OK');
    assert(tripDetails.data.data.title === 'Rajasthan Royal Heritage Vacation', 'Trip title matches');

    // 6. Itinerary Stops & Trip Activities
    console.log('\n--- 6. Itinerary Stops & Activities ---');
    const addStopRes = await request(`/trips/${tripId}/stops`, {
      method: 'POST',
      headers: authHeaders,
      body: {
        cityId: jaipurId,
        arrivalDate: '2026-11-01',
        departureDate: '2026-11-04',
        order: 1,
      },
    });
    assert(addStopRes.status === 201, 'POST /api/trips/:id/stops returns 201 Created');
    const stopId = addStopRes.data.data.id;

    // Add activity to stop
    const addTripActRes = await request(`/trips/${tripId}/activities`, {
      method: 'POST',
      headers: authHeaders,
      body: {
        tripStopId: stopId,
        activityId: firstActId,
        date: '2026-11-02',
        startTime: '10:00 AM',
        cost: 550,
      },
    });
    assert(addTripActRes.status === 201, 'POST /api/trips/:id/activities returns 201 Created');
    const tripActId = addTripActRes.data.data.id;

    // Update Stop
    const updateStopRes = await request(`/trips/${tripId}/stops/${stopId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: {
        departureDate: '2026-11-05',
      },
    });
    assert(updateStopRes.status === 200, 'PUT /api/trips/:id/stops/:stopId returns 200 OK');

    // 7. Expenses & Budget Calculation
    console.log('\n--- 7. Expenses & Budget Calculation ---');
    const addExp1 = await request(`/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: authHeaders,
      body: {
        category: 'accommodation',
        description: 'Heritage Haveli 3 nights',
        amount: 12000,
        date: '2026-11-01',
      },
    });
    assert(addExp1.status === 201, 'POST /api/trips/:id/expenses (accommodation) returns 201 Created');
    const exp1Id = addExp1.data.data.id;

    const addExp2 = await request(`/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: authHeaders,
      body: {
        category: 'food',
        description: 'Chokhi Dhani Rajasthani Dinner',
        amount: 2500,
        date: '2026-11-02',
      },
    });
    assert(addExp2.status === 201, 'POST /api/trips/:id/expenses (food) returns 201 Created');

    // Get expenses list
    const expList = await request(`/trips/${tripId}/expenses`, { headers: authHeaders });
    assert(expList.status === 200, 'GET /api/trips/:id/expenses returns 200 OK');
    assert(expList.data.data.length === 2, 'Two expenses logged');

    // Update expense
    const updateExp = await request(`/trips/${tripId}/expenses/${exp1Id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: {
        amount: 13500,
      },
    });
    assert(updateExp.status === 200, 'PUT /api/trips/:id/expenses/:expenseId returns 200 OK');

    // Get Budget Breakdown
    const budgetRes = await request(`/trips/${tripId}/budget`, { headers: authHeaders });
    assert(budgetRes.status === 200, 'GET /api/trips/:id/budget returns 200 OK');
    const budgetData = budgetRes.data.data;
    assert(budgetData.total === 16000, `Total budget calculation is accurate (expected 16000, got ${budgetData.total})`);
    assert(budgetData.categories.accommodation === 13500, 'Accommodation category sum matches');
    assert(budgetData.categories.food === 2500, 'Food category sum matches');
    assert(budgetData.remaining === 34000, 'Remaining budget calculated from budgetLimit');
    assert(budgetData.isOverBudget === false, 'isOverBudget is false');

    // 8. Public Sharing APIs
    console.log('\n--- 8. Public Itinerary Sharing ---');
    const shareRes = await request(`/trips/${tripId}/share`, {
      method: 'POST',
      headers: authHeaders,
    });
    assert(shareRes.status === 200, 'POST /api/trips/:id/share returns 200 OK');
    const shareId = shareRes.data.data.shareId;
    assert(!!shareId, 'Unique share ID generated');

    // Access public endpoint WITHOUT ANY AUTH TOKEN
    const publicTrip = await request(`/share/${shareId}`);
    assert(publicTrip.status === 200, 'GET /api/share/:shareId (UNAUTHENTICATED) returns 200 OK');
    assert(publicTrip.data.data.title === 'Rajasthan Royal Heritage Vacation', 'Public itinerary title matches');
    assert(publicTrip.data.data.stops.length > 0, 'Public itinerary includes stops');
    assert(publicTrip.data.data.user.name === 'Jane Traveler Updated', 'Creator public name included');
    assert(publicTrip.data.data.user.email === undefined, 'Creator private email is NOT exposed');
    assert(publicTrip.data.data.expenses === undefined, 'Private expenses are NOT exposed in public share');

    // 9. Unauthorized Access Security Checks
    console.log('\n--- 9. Security & Unauthorized Access Checks ---');
    const unauthTrips = await request('/trips');
    assert(unauthTrips.status === 401, 'Accessing /api/trips without token returns 401 Unauthorized');

    const fakeTokenHeaders = { Authorization: 'Bearer invalid.token.value' };
    const fakeAuthTrips = await request('/trips', { headers: fakeTokenHeaders });
    assert(fakeAuthTrips.status === 401, 'Accessing /api/trips with invalid token returns 401 Unauthorized');

    // 10. Deletions & Cascade Cleanup
    console.log('\n--- 10. Deletion and Cleanup Operations ---');
    const delAct = await request(`/trips/${tripId}/activities/${tripActId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(delAct.status === 200, 'DELETE /api/trips/:id/activities/:activityId returns 200 OK');

    const delStop = await request(`/trips/${tripId}/stops/${stopId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(delStop.status === 200, 'DELETE /api/trips/:id/stops/:stopId returns 200 OK');

    const delExp = await request(`/trips/${tripId}/expenses/${exp1Id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(delExp.status === 200, 'DELETE /api/trips/:id/expenses/:expenseId returns 200 OK');

    const delTrip = await request(`/trips/${tripId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(delTrip.status === 200, 'DELETE /api/trips/:id returns 200 OK');

    console.log('\n==================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} API TESTS PASSED SUCCESSFULLY!`);
    console.log('==================================================\n');
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal Test Error:', err);
  if (server) server.close();
  process.exit(1);
});
