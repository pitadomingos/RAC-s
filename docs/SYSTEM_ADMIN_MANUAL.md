
# CARS Manager - System Administrator Manual
**Version:** 2.6.0  
**Target Audience:** System Administrators, HSE Managers

---

## 1. System Overview

The **CARS Manager (Critical Activity Requisitions System)** is a web-based Safety Management System designed to ensure workforce compliance in high-risk industrial environments (Mining/Oil & Gas). 

It acts as the central "Gatekeeper" logic for site access. The system links Employee Health (ASO), Training Competency (RACs), and Operational Permissions to determine if an employee is **Compliant (Green)** or **Blocked (Red)**.

### Core Capabilities
*   **Matrix Management:** Define exactly which trainings a specific employee role requires.
*   **Scheduling & Booking:** Manage classroom capacity and assign employees to training sessions.
*   **Grading & Results:** Capture test scores and attendance.
*   **Automated Compliance:** The system automatically calculates access status based on expiry dates.
*   **Digital Passport:** Generates QR-coded ID cards for field verification.
*   **Auto-Booking Engine:** Automatically reserves training slots for employees expiring in < 7 days.
*   **AI Analytics:** Uses Google Gemini AI to generate safety reports and provide advice.

---

## 2. Architecture & Data Logic

### The Compliance Formula
The system determines an employee's status based on strict logic. An employee is **GRANTED** access only if:

1.  **Status is Active:** The employee is not marked inactive in the database.
2.  **ASO is Valid:** Medical certificate expiry date is in the future.
3.  **RAC Requirements Met:** For every RAC marked as `TRUE` in the Database Matrix:
    *   There must be a `PASSED` training record.
    *   The training record's expiry date must be in the future.
4.  **Driver License (RAC 02 Specific):** If the employee requires `RAC 02` (Vehicles), their Driver License must be valid and verified.

### Data Flow
1.  **Database (Input):** You define *Requirements* (Who needs what?).
2.  **Booking (Process):** You schedule training. *Constraint: You cannot book a training if the Database says it isn't required.*
3.  **Trainer Input (Execution):** Trainers mark attendance and scores.
4.  **Results (Output):** Passing creates a historical record with an expiry date (default: 2 years).
5.  **Dashboard (Monitoring):** The system re-calculates compliance in real-time.

---

## 3. Operational Workflows

### A. System Configuration (First Run)
Before onboarding employees, configure the environment in **System Settings**:
1.  **RAC Definitions:** Define the modules (e.g., RAC 01, RAC 02, PTS). *Warning: Deleting a RAC here removes the column from the database.*
2.  **Rooms:** Define physical locations and seating capacity. This sets limits for the Booking engine.
3.  **Trainers:** Register trainers and authorize them for specific modules.

### B. Onboarding Employees (The Database)
Navigate to the **Database** page. This is your Master Record.
*   **Manual Entry:** Click "Import CSV" (use the template).
*   **The Matrix:** 
    *   **Left Side:** Check boxes for RACs (Training Modules).
    *   **Right Side:** Check boxes for Operational Permissions (e.g., LIB-OPS).
    *   **ASO:** Enter the medical expiry date.
*   **QR Codes:** You can mass download QR codes for all employees in the current view here.

### C. Booking Training
Navigate to **Book Training**.
*   **Modes:**
    *   *System Admin:* Can see all sessions and book anyone.
    *   *User (Self-Service):* Can only see sessions for RACs they are required to have.
*   **Validation:** The system prevents overbooking (Capacity limits) and Duplicate bookings (Same RAC type).
*   **Renewals:** Use the "Book Renewals" button on the Dashboard to load a batch of employees expiring in 30 days.

### D. Grading (The Trainer Workflow)
Trainers use the **Trainer Input** page.
*   **Grading Logic:** 
    *   Pass Mark: 70% Theory.
    *   Attendance is mandatory.
    *   **RAC 02:** Requires a specific "DL Verified" checkbox. If the Driver License is invalid, the student fails regardless of score.
*   **Saving:** Clicking "Save" commits the data as a permanent record and updates the employee's expiry date.

### E. Issuing Cards
Navigate to **Request Cards**.
*   **Eligibility Engine:** This page *only* shows employees who are 100% compliant. If an employee is missing, check their ASO or Training dates.
*   **Batch Printing:** Select up to 8 employees to generate a printable A4 PDF with crop marks.

---

## 4. Advanced Features

### Auto-Booking Engine
*   **Trigger:** Runs on the Dashboard load.
*   **Logic:** Scans for employees where `Training Expiry < 7 Days`.
*   **Action:** Automatically creates a `PENDING` booking for the next available session of that RAC type.
*   **Approval:** Administrators must approve these auto-bookings in the orange widget on the Dashboard.

### AI Reporting
*   Located in **Reports**.
*   Click "Generate AI Analysis".
*   The system sends anonymized statistical data (Pass rates, attendance, failing modules) to Google Gemini.
*   **Output:** An executive summary identifying high-risk departments and training gaps.

### Alcohol Control (IoT)
*   Located in **Alcohol Control**.
*   Currently a roadmap/simulation module.
*   **Protocol:** Designed to link with turnstiles. If a breathalyzer detects alcohol, the system sets `Access Status = Blocked` until 02:00 AM the next day.

### Audit Logs
*   Located in **System Logs**.
*   Tracks critical actions: User creation, deletion, manual grade changes, and configuration updates.

---

## 5. Enterprise Management (Multi-Tenancy)

The system now supports Multi-Tenancy, allowing a single deployment to manage multiple client companies (Tenants) and their hierarchy.

### The Platform Dashboard
When logged in as **System Admin**, the "Corporate Dashboard" transforms into a **Platform Command Center**.

*   **Tenant Selector:** A filter bar allowing you to toggle between "All Tenants" or a specific Enterprise (e.g., "Vulcan").
*   **Cascading Filters:**
    *   Selecting a Tenant dynamically updates the "Contractor" dropdown to show only sub-contractors belonging to that enterprise.
    *   The "Department" and "Site" filters also respect the selected Tenant context.
*   **Tenant Matrix:** A dedicated view comparing the compliance health of different Enterprises side-by-side. This allows you to spot which client requires intervention.
*   **Employee Aggregation:** The system calculates KPIs (Compliance %, Total Workforce) by mapping individual employees to their parent Tenant via the `Company` field.

### Creating a New Enterprise
1.  Go to **System Settings** > **Companies** (Only available to `System Admin`).
2.  Fill in the "New Enterprise Provisioning" form:
    *   **Company Name:** e.g., "Acme Corp".
    *   **Admin Name:** e.g., "John Smith".
    *   **Admin Email:** e.g., "admin@acme.com".
3.  Click **Provision Enterprise**.
4.  **Result:** The system automatically creates:
    *   The Company entity.
    *   A default "Headquarters" Site.
    *   A new User with role `Enterprise Admin` linked to this company.

### Site Governance
Enterprise Admins can manage mandatory requirements per site.
1.  Go to **Site Governance**.
2.  Select a Site from the sidebar.
3.  Toggle the RACs that are mandatory for *all* employees at that site.
4.  Click **Save & Push Policy**.
5.  **Result:** The system updates the requirements matrix for every employee assigned to that site, ensuring they are flagged for the required training.

---

## 6. Troubleshooting

**Q: Why can't I find an employee in the Booking Form?**
A: Ensure the employee exists in the **Database** first. The Booking form searches the Master Database.

**Q: Why is an employee "Blocked" even though they passed training?**
A: Check their **ASO (Medical)** date in the Database. If the medical is expired, site access is blocked regardless of training status. Also, check if they are marked "Inactive".

**Q: The QR Code shows "Record Not Found".**
A: The QR code links to the employee's `Record ID`. Ensure the ID in the URL matches exactly what is in the database (case-sensitive).

**Q: How do I delete a wrong training record?**
A: Go to **Results Page**. Admins can view history. Currently, strict deletion is restricted to maintain audit trails, but you can overwrite status by re-grading in Trainer Input if the session is still pending.

**Q: How do I backup data?**
A: Go to **Database** and click "Export DB". This downloads a CSV of the entire matrix. Go to **Results** and click "Export Records" for training history.
