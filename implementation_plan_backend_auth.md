# Backend Authentication & Security Migration Plan

## Objective
Migrate the entire Authentication and Registration flow (Login, Register, Password Recovery) from the frontend (Client-side Supabase) to the internal Node.js Backend. This ensures all security rules (CPF validation, Password strength, Data integrity) are strictly enforced on the server, hidden from client-side manipulation.

## 1. Backend Architecture (Server)

### A. dedicated Auth Controller (`src/controllers/authController.ts`)
We will create a specific controller to handle all auth logic.
- **POST /api/auth/register**:
    - **Validation**:
        - Check if **CPF** is mathematically valid (using strict algorithm).
        - Check if **Password** meets complexity: Min 6 chars, 1 Uppercase, 1 Number, 1 Special Char.
        - Check if User already exists.
    - **Action**:
        - Create user in Supabase Auth using `Service Role` (Admin).
        - Create profile record in `public.profiles` with validated Name, CPF, Phone.
    - **Response**: User object and access token (auto-login).

- **POST /api/auth/login**:
    - Acts as a secure proxy.
    - Receives `email` and `password`.
    - Authenticates using Supabase Client on the server.
    - Returns session data to the frontend.

### B. Validation Middleware (`src/middleware/validators.ts`)
- move `isValidCPF` and `password` regex logic here.
- Create reusable middleware `validateRegistration` to keep the controller clean.

## 2. Frontend Refactoring (Client)

### A. Update `AuthContext.tsx`
- **Deprecate** direct `supabase.auth` calls for sign-in and sign-up.
- **Implement** `login(email, pass)`: Calls `POST /api/auth/login`.
- **Implement** `register(data)`: Calls `POST /api/auth/register`.
- **Session Management**: Continue using Supabase client to *persist* the session, but creation happens via API.

### B. Update `RegisterForm.tsx` (Visual Feedback)
- **Real-time UX**: Keep the immediate visual feedback (e.g., "Passwords do not match").
- **Strict Gating**: The "Continuar" button will ONLY enable if the frontend validation passes.
- **Server Feedback**: Display specific error messages returned by the backend (e.g., "CPF already in use").

## 3. Implementation Steps

1.  **Backend**: Set up `auth` routes and controller in `server/src`.
2.  **Backend**: Implement strict `isValidCPF` and `passwordStrength` checks in the register endpoint.
3.  **Frontend**: Update `AuthContext` to point to these new endpoints.
4.  **Frontend**: Polish `RegisterForm` to handle the new API responses and states.

## Security Benefits
- **No Client Bypass**: A user cannot "skip" validation by manipulating JS code; the API will reject invalid CPFs.
- **Centralized Logic**: Validation rules live in one place (API), easy to update.
- **Data Integrity**: We guarantee that every user in `profiles` has a valid CPF and formatted phone number.
