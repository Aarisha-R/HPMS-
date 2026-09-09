# Hospital Patient Management System (HPMS)

Full-stack implementation built from the SRS and Database Design documents,
using **Java 17 + Spring Boot** (backend) and **React + Vite** (frontend), exactly
per the stack constraint: *Java, React, Spring Boot only*.

## What's implemented

**Backend (Spring Boot)** — all 13 entities from the DB design, with matching
enums, relationships, and foreign keys:
Users, Departments, Patients, Appointments, MedicalRecords, Prescriptions,
Wards, Beds, LabOrders, LabResults, Bills, Notifications, AuditLogs.

- **JWT authentication** with role-specific token expirations (4h patient / 8h
  staff / 12h admin), login via username, email, *or* staff ID (SRS FR2).
- **Role-based access control** via `@PreAuthorize`, matching Appendix A's
  permission matrix (7 roles: Admin, Doctor, Nurse, Pharmacist, Receptionist,
  Lab Technician, Patient).
- **AES-256 field encryption** for PHI (`name`, `date_of_birth`,
  `phone_number`, `address`, `insurance_id` on `Patients`), matching the DB
  design's "AES-256 Encrypted Attribute" markings.
- **BCrypt password hashing**, progressive account lockout after 5 failed
  attempts (SRS FR2/Appendix D).
- **Validation** matching Appendix C (name format, 10-digit phone, DOB
  bounds, password complexity) with custom exceptions from Appendix D
  (`InvalidPatientNameException`, `DuplicatePatientException`, etc.) and a
  global exception handler that returns clean, non-leaking error responses.
- **REST API surface** matching Appendix H: patient CRUD + search,
  appointments + available slots, medical records, prescriptions +
  dispensing, ward/bed assignment, lab orders/results + critical values,
  billing + payments, notifications, admin analytics + audit logs.
- **Audit logging** service (`AuditService`) ready to wire into any mutation
  for HIPAA-style traceability.
- H2 in-memory DB by default so it runs instantly; MySQL connector included
  and pre-configured (commented) for production.
- Seeds a default `admin` / `Admin@12345` account on first boot.

**Frontend (React)** — matches Appendix I's component structure:
`App.jsx` router, `NavBar`, `Footer`, `Home`, `Login`, `Register`,
`Dashboard` (role-specific views for Admin/Doctor/Patient/other staff),
`PatientRegistration`, `PatientList` (search + pagination), `PatientDetail`
(tabbed: overview/records/prescriptions/appointments), `Appointments`
(booking + cancellation), `MedicalRecords`, `Billing` (generate + pay),
`Pharmacy` (dispensing queue), `Laboratory` (order + result entry).
Axios client with JWT auto-attach and 401 auto-redirect. Tailwind styling.

## What's intentionally scoped out

This is a strong working foundation, not the full enterprise system the SRS
describes end to end. Not implemented (flagged as Phase 2/3 in the SRS
itself, or clearly out of scope for a single build): HL7 FHIR integration,
biometric/barcode/pager hardware interfaces, SMS/email delivery, drug
inventory & interaction checking, insurance claim submission workflows,
two-factor auth, PACS/imaging links, and analytics/reporting beyond the
basic admin dashboard. The service layer is structured so each of these can
be added without restructuring what's here.

## Running it

### Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`. H2 console at `/h2-console` (JDBC URL
`jdbc:h2:mem:hpms`, user `sa`, no password).

**Before any real deployment:** change `hpms.jwt.secret` and
`hpms.security.aes-key` in `application.properties` — the checked-in values
are placeholders only.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:8081` (per SRS 2.4) and proxies `/api` calls to
the backend on port 8080.

### Login
- Default admin: `admin` / `Admin@12345`
- Register other roles (Doctor, Nurse, Receptionist, Pharmacist, Lab
  Technician, Patient) via the Register page — non-patient roles require a
  Staff ID.

## Project structure
```
backend/
  src/main/java/com/hospital/hpms/
    entity/          13 JPA entities + enums/
    repository/       Spring Data JPA repositories
    security/         JWT util, filter, UserDetails
    service/           business logic per module
    controller/         REST endpoints (Appendix H)
    dto/                request/response payloads
    exception/          custom exceptions + global handler
    util/               AES-256 PHI encryption
    config/             security config, seeding, encryptor wiring
frontend/
  src/
    pages/            one file per screen (Appendix I)
    components/        NavBar, Footer, PrivateRoute
    context/            AuthContext (JWT session)
    api/                axios client
```
