# Christmas Donation App - Flow Overview

## High-Level Summary

The Christmas Donation App allows users to select and donate gifts (physical items or cash) to children in need. Users interact with a festive Christmas tree image with clickable gift areas, then navigate through a modal-based flow to select recipients and complete their donation.

---

## User Journey Paths

### Entry Point: Landing Page

**View:** Full-screen Christmas tree image with 3 clickable gift areas (baubles)
- Bauble 1: Bottom center (53.8%, 80.2%)
- Bauble 2: Middle left (36%, 70%)
- Bauble 3: Upper right (80%, 82%)

**Action:** User clicks any bauble → Opens modal popup

---

## Path Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      LANDING PAGE                            │
│                   (Christmas Tree View)                      │
│                                                              │
│    Click any of 3 baubles → Opens Modal                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MODAL: Choose Gift Recipient                    │
│                                                              │
│  Options:                                                    │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │  Any Child   │   OR   │ Specify Child│                  │
│  └──────┬───────┘        └──────┬───────┘                  │
│         │                       │                            │
│         │                       │                            │
└─────────┼───────────────────────┼────────────────────────────┘
          │                       │
          │                       │
    ┌─────▼────┐           ┌──────▼──────┐
    │  PATH A  │           │   PATH B    │
    │  (Random)│           │  (Search)   │
    └─────┬────┘           └──────┬──────┘
          │                       │
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌─────────────────────────┐
│ Loading Spinner  │    │  Search Form            │
│                  │    │  - Gender dropdown      │
│ API Call:        │    │  - Age dropdown (0-16)  │
│ /api/random-child│    │  - Search button        │
└────────┬─────────┘    └─────────┬───────────────┘
         │                        │
         │                        │ Submit Search
         │                        │
         │                        ▼
         │              ┌─────────────────────┐
         │              │  API Call:          │
         │              │  /api/search-child  │
         │              │  ?gender=X&age=Y    │
         │              └─────────┬───────────┘
         │                        │
         └────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            MODAL: Child Details Screen                       │
│                                                              │
│  Display Information:                                        │
│  - Recipient name                                            │
│  - Age                                                       │
│  - Gender                                                    │
│  - Gift ideas                                                │
│                                                              │
│  Options:                                                    │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │ Donate Gift  │   OR   │ Donate Cash  │                  │
│  └──────┬───────┘        └──────┬───────┘                  │
└─────────┼───────────────────────┼────────────────────────────┘
          │                       │
    ┌─────▼────┐           ┌──────▼──────┐
    │  PATH C  │           │   PATH D    │
    │  (Gift)  │           │   (Cash)    │
    └─────┬────┘           └──────┬──────┘
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌─────────────────────────┐
│ Donation Form    │    │  Donation Form          │
│ (Gift)           │    │  (Cash)                 │
│                  │    │                         │
│ - Full Name      │    │  - Full Name            │
│ - Department     │    │  - Department           │
│   (dropdown)     │    │    (dropdown)           │
│                  │    │  - Donation Amount (£)  │
│ - Submit button  │    │  - Submit button        │
│ - Back button    │    │  - Back button          │
└────────┬─────────┘    └─────────┬───────────────┘
         │                        │
         │ Submit                 │ Submit
         │                        │
         ▼                        ▼
┌──────────────────────────────────────────────────┐
│      API Call: /api/update-record                │
│                                                  │
│      PATCH request with:                         │
│      - recordId                                  │
│      - assignee (full name)                      │
│      - department                                │
│      - cash_donation: Y/N                        │
│      - gift_donation: Y/N                        │
│      - donation_amount (if cash)                 │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              MODAL: Thank You Screen                         │
│                                                              │
│  "Thank You!"                                                │
│  "Your [gift/cash] donation [of £X.XX] has been             │
│   registered successfully."                                  │
│                                                              │
│  - Close (X) button                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Path Descriptions

### Path A: Any Child (Random Selection)

1. **Entry:** User clicks "Any Child" button
2. **Loading:** Shows spinner with message "Finding a child for you..."
3. **API Call:** `GET /api/random-child`
   - Backend fetches all children records
   - Returns random child
4. **Response:** Displays child details
5. **Next:** Proceeds to donation type selection

**Code Reference:** `script.js:42-64`

---

### Path B: Specify Child (Search by Criteria)

1. **Entry:** User clicks "Specify Child" button
2. **Form Display:** Shows search form with:
   - Gender dropdown (Male/Female)
   - Age dropdown (0-16 years)
3. **Validation:** Requires both fields to be selected
4. **API Call:** `GET /api/search-child?gender={gender}&age={age}`
   - Backend filters children by criteria
   - Returns random match from filtered results
5. **Response:** Displays child details
6. **Next:** Proceeds to donation type selection

**Code Reference:** `script.js:66-117`

---

### Path C: Gift Donation

1. **Entry:** User clicks "Donate Gift" button from child details
2. **Form Display:** Shows donation form with:
   - Full Name (text input)
   - Department dropdown (Marketing/Sales/Accounts)
3. **Validation:** Requires all fields
4. **API Call:** `PATCH /api/update-record`
   - Updates Airtable record with:
     - `assignee`: donor's name
     - `department`: donor's department
     - `gift_donation`: "Y"
     - `cash_donation`: "N"
5. **Success:** Shows thank you message
6. **Back Option:** Can return to child details

**Code Reference:** `script.js:149-227`

---

### Path D: Cash Donation

1. **Entry:** User clicks "Donate Cash" button from child details
2. **Form Display:** Shows donation form with:
   - Full Name (text input)
   - Department dropdown (Marketing/Sales/Accounts)
   - Donation Amount in £ (number input, step 0.01)
3. **Validation:** Requires all fields including amount
4. **API Call:** `PATCH /api/update-record`
   - Updates Airtable record with:
     - `assignee`: donor's name
     - `department`: donor's department
     - `cash_donation`: "Y"
     - `gift_donation`: "N"
     - `donation_amount`: formatted as "£X.XX"
5. **Success:** Shows thank you message with amount
6. **Back Option:** Can return to child details

**Code Reference:** `script.js:149-227`

---

## Exit Points

At any stage in the modal flow, users can:

1. **Close Modal:** Click the "X" button (top right)
   - Resets modal to initial state
   - Returns to landing page
   - Modal hidden with `display: none`

2. **Back Button:** Available in donation forms
   - Returns to child details screen
   - Re-fetches the same child (via "Any Child" flow)

**Code Reference:** `script.js:36-40` (close), `script.js:188` (back)

---

## API Endpoints Summary

### 1. GET `/api/random-child`
- **Purpose:** Fetch random child from all available
- **Response:** Child record (id, recipient, age, gender, gift_ideas)
- **Server:** `server.js:21-49`

### 2. GET `/api/search-child`
- **Purpose:** Search children by gender and age
- **Query Params:** `gender`, `age`
- **Response:** Random matching child record
- **Server:** `server.js:51-88`

### 3. PATCH `/api/update-record`
- **Purpose:** Update child record with donation details
- **Body:** `recordId`, `fields` (assignee, department, cash_donation, gift_donation, donation_amount)
- **Response:** Success confirmation
- **Server:** `server.js:90-121`

---

## Data Flow

### Child Record Structure
```javascript
{
  id: "rec123...",
  fields: {
    recipient: "Child Name",
    age: "10",
    gender: "male",
    gift_ideas: "Books, toys, games",
    assignee: "Donor Name",        // Added after donation
    department: "Marketing",        // Added after donation
    cash_donation: "Y/N",          // Added after donation
    gift_donation: "Y/N",          // Added after donation
    donation_amount: "£25.00"      // Added if cash donation
  }
}
```

---

## Key User Experience Features

1. **Modal-Based Navigation:** All interactions after landing occur in modal
2. **Progressive Disclosure:** Information revealed step-by-step
3. **Flexible Selection:** Random or criteria-based child selection
4. **Dual Donation Types:** Gift or cash options
5. **Department Tracking:** Links donations to company departments
6. **Reset Capability:** Easy exit and restart at any point
7. **Loading States:** Visual feedback during API calls
8. **Validation:** Prevents incomplete submissions

---

## Technical Notes

- **Frontend:** Single-page vanilla JavaScript app
- **Styling:** TailwindCSS with custom brand colors
- **Backend:** Express.js server
- **Database:** Airtable
- **State Management:** Single global variable `currentRecordId`
- **Event Handling:** Dynamic listener attachment/removal
- **Error Handling:** Try-catch blocks with user-friendly alerts

---

## Navigation State Transitions

```
State 1: Landing (Tree View)
    ↓ (click bauble)
State 2: Selection Mode (Any/Specify)
    ↓ (click Any)
State 3a: Loading
    ↓ (API response)
State 4: Child Details
    ↓ (click Donate Gift/Cash)
State 5: Donation Form
    ↓ (submit)
State 6: Thank You
    ↓ (close)
State 1: Landing (reset)

OR

State 2: Selection Mode
    ↓ (click Specify)
State 3b: Search Form
    ↓ (submit search)
State 4: Child Details
    (continues as above)
```

---

## Document Version
- **Created:** Based on old-app codebase analysis
- **Last Updated:** 2025-11-03
- **Files Analyzed:**
  - `index.html`
  - `script.js`
  - `server.js`
