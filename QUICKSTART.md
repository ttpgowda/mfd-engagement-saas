# Quick Start Guide

## Prerequisites
- Java 21+ installed
- Node.js 18+ installed
- PostgreSQL database running (configured in `backend/src/main/resources/application.yaml`)

## Running the Application

### Option 1: Two Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```
✅ Backend will start on `http://localhost:8080`
✅ API documentation (if Swagger enabled): `http://localhost:8080/swagger-ui.html`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend will start on `http://localhost:3000`

### Option 2: Using PowerShell Background Jobs (Windows)

```powershell
# Start backend in background
cd backend
Start-Job -ScriptBlock { mvn spring-boot:run }

# Start frontend in background
cd ../frontend
Start-Job -ScriptBlock { npm run dev }

# Check job status
Get-Job

# View output
Receive-Job -Id 1  # Backend
Receive-Job -Id 2  # Frontend

# Stop jobs when done
Stop-Job -Id 1,2
Remove-Job -Id 1,2
```

## Accessing the Application

1. Open your browser to `http://localhost:3000`
2. You should see the login page
3. Navigate through:
   - **Dashboard** - KPIs and charts
   - **Calculators** - Cost of Delay & Step-Up SIP
   - **Content Studio** - Fund selection and preview
   - **Fund Explorer** - Data table with funds
   - **Leads** - Lead management

## API Endpoints

### Mutual Funds
- `GET /api/mutual-funds/schemes` - All schemes
- `GET /api/mutual-funds/analytics` - All analytics
- `GET /api/mutual-funds/nav-history/{schemeCode}` - NAV history

### Tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants` - List tenants
- `PUT /api/tenants/{id}` - Update tenant
- `POST /api/onboard-tenant` - Onboard new tenant

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `GET /api/users/me` - Current user

### Leads
- `POST /api/leads` - Create lead
- `GET /api/leads` - List leads (filtered by tenant)

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `application.yaml`
- Check port 8080 is not in use

### Frontend won't start
- Run `npm install` if dependencies are missing
- Check port 3000 is not in use
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### CORS errors
- Backend has CORS enabled for `*` in development
- Check `CorsConfig.java` if you need to modify allowed origins
