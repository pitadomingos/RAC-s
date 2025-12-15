
# SYSTEM ADMINISTRATOR GUIDE (MANUAL)
**System:** CARS Manager v2.5
**Access Level:** System Administrator / HSE Manager

---

## 1. System Logic Overview

The **CARS Manager** is not just a database; it is a Logic Engine. Understanding how it calculates "Compliance" is critical.

### 🚦 The Traffic Light Logic
The system grants a **GREEN (Granted)** status only if all three conditions are met:

```text
[ 👤 User Active? ] 
             +
      [ 🏥 ASO Valid? ]  (Medical Expiry > Today)
             +
      [ 🎓 RACs Valid? ] (All Required Modules = Passed)
             =
      ✅ ACCESS GRANTED
```

**⚠️ Important:** If *any* required RAC is missing or expired, the entire status turns **RED (Blocked)**.

---

## 2. Dashboard Navigation

### 📊 Operational Dashboard
*   **KPI Cards:** Shows real-time counts for Certifications, Pending, and Expiring.
*   **Renewal Widget:** A yellow alert box appears if users are expiring in < 30 days. Click "Book Renewals" to auto-load them into the booking wizard.
*   **Auto-Booking Approval:** An orange table appears if the system auto-booked employees (expiry < 7 days). You must click Approve or Reject.

### 🌍 Enterprise Dashboard
*   **Global Health Score:** An aggregate % of compliance across all sites.
*   **Risk Heatmap:** Identifies which Departments or Contractors have the lowest compliance.
*   **AI Analysis:** Click "Generate Strategic Report" to have Gemini AI write a text summary of the risks.

---

## 3. Core Workflows

### Workflow A: Onboarding & Matrix Setup (Database Page)
1.  **Go to Database.**
2.  **Import:** Click "Import Wizard" to upload a CSV from HR. The system maps columns automatically.
3.  **The Matrix (Crucial):**
    *   On the right side of the table, you will see columns for RAC01, RAC02, PTS, etc.
    *   **Toggle Buttons:** Click a button to turn it **Green (Required)** or **Grey (Not Required)**.
    *   *Note: If you mark a RAC as required, the employee becomes "Blocked" until they pass that specific training.*

### Workflow B: Scheduling & Booking
1.  **Go to Schedule** to create slots (Date, Time, Capacity, Room).
2.  **Go to Book Training.**
3.  **Selection:** Choose a Session.
4.  **Input:** Add employees.
5.  **Smart Capacity Check:**
    *   If you try to book 15 people into a room with 10 seats...
    *   The system puts 10 in the session.
    *   The system automatically finds the next future session for the remaining 5.
    *   If no future session exists, they go to the **Waitlist**.

### Workflow C: Grading (Trainer Input)
1.  **Go to Trainer Input.**
2.  Select the Session.
3.  **Mark Attendance:** Check the box.
4.  **Enter Scores:**
    *   Theory < 70% = Fail.
    *   **RAC 02 Special Rule:** You must check "DL Verified". If the driver's license is invalid, the student fails immediately, regardless of score.
5.  **Save:** Click Save. This triggers the **Automatic Print Dialog** for the physical register.

### Workflow D: Issuing Cards
1.  **Go to Request Cards.**
2.  **Filter:** Select compliant employees.
3.  **Batch:** The system allows batches of 8 cards.
4.  **Print:** Generates a PDF with crop marks for the ID card printer.
5.  **Back of Card:** Can be printed from the Database page (QR Code).

---

## 4. Advanced Configurations

### ⚙️ Site Governance
**Use Case:** You want everyone at "Moatize Mine" to have RAC 01, but "Maputo HQ" does not need it.
1.  **Go to Site Governance.**
2.  Select the site.
3.  Toggle RAC 01.
4.  Click **"Push Policy"**.
**Result:** Every employee linked to Moatize instantly gets RAC 01 marked as "Required" in their matrix.

### 🍷 Alcohol Control (IoT)
1.  **Go to Alcohol Control.**
2.  **Live Stream:** Shows real-time tests from MQTT breathalyzers.
3.  **Alerts:** A positive test triggers a red modal popup and logs a "Violation".
4.  **Protocol:** Positive test = Immediate Gate Lock + Supervisor Email.

---

## 5. Troubleshooting Guide

| Issue | Visual | Solution |
| :--- | :---: | :--- |
| **Access Denied but Trained** | ❌ | Check ASO Date in Database. Even with training, an expired medical blocks access. |
| **Cannot Book Employee** | 🔒 | Check if the RAC is marked Required in Database. The system prevents booking unnecessary training. |
| **RAC 02 Failed Automatically** | 🚗 | The employee's Driver License date in the database is expired. Update DL first. |
| **QR Code "Not Found"** | 📱 | Ensure the Record ID in the URL matches exactly (Case Sensitive). e.g., VUL-101 vs vul-101. |
| **System Sluggish** | 🐌 | Check System Logs. If "Syncing" is active, wait for the middleware job to finish. |

---

## 6. System Architecture (Visual Reference)

```text
[ USER INTERFACE ]
      |
      v
[ PERMISSION GATE ] <--- Checks User Role (System Admin vs User)
      |
      v
[ LOGIC ENGINE ]
   |-- Check Capacity
   |-- Check Pre-requisites (Matrix Lock)
   |-- Check DL Validity (For RAC 02)
      |
      v
[ DATABASE STATE ] <--- Updates Booking / Employee Record
      |
      v
[ AUTOMATION ]
   |--> 📧 Email/SMS Trigger
   |--> 🖨️ Auto-Print Register
   |--> 🤖 AI Analysis Update
```
