<div align="center">

<img src="https://equisaas-bd.com/logo.svg" alt="EquiSaaS BD - The Sweat Equity Protocol" width="180"/>

# EquiSaaS BD: The Sweat Equity Protocol

**We are not building another corporation. We are hard-forking the tech industry.**  
*Bangladesh's First Open-Source Tech Cooperative & Decentralized B2B SaaS Ecosystem.*

[![Live Site](https://img.shields.io/badge/🌐_Production-equisaas--bd.com-0ea5e9?style=for-the-badge)](https://equisaas-bd.com)
[![LMS Portal](https://img.shields.io/badge/🎓_Academy-lms.equisaas--bd.com-10b981?style=for-the-badge)](https://equisaas-bd.com/lms/login)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Cloudflare](https://img.shields.io/badge/Edge-Cloudflare-F38020?style=for-the-badge&logo=cloudflare)](https://cloudflare.com/)

</div>

---

## ⚡ The Manifesto

The status quo of the technology sector is fundamentally extractive. Junior developers and designers in developing markets are trapped in unpaid internship loops, producing massive commercial value in exchange for empty certificates. Opportunities and capital remain highly centralized, leaving talent in regional districts locked out of wealth creation.

**EquiSaaS BD is a sovereign, cooperative-governed alternative.**

We run an open-source cooperative platform. Through our **Sweat Equity Protocol**, every hour of audited contribution is converted into permanent, legally binding corporate equity shares. Our builders do not trade hours for zero gain; they own the products they build.

---

## 🧠 System Architecture

Our global infrastructure uses a highly decoupled, multi-cloud topology designed for zero-latency, high availability, and secure edge execution.

```mermaid
graph TD
    subgraph Client ["🌍 Client Access Layer"]
        Browser["PWA / Modern Browser"]
    end

    subgraph Edge ["⚡ Cloudflare Edge Network (Routing & Compute)"]
        DNS["Cloudflare DNS"]
        WAF["Managed WAF & DDoS Shield"]
        Cache["Smart CDN Cache"]
        WorkerOG["eqbd-certificate-og Worker<br>(resvg-wasm / Satori VDOM)"]
        WorkerFeed["eqbd-updates-feed Worker<br>(Dynamic Aggregator)"]
    end

    subgraph CDN ["🔥 Firebase CDN / Static Hosting"]
        StaticLanding["Landing (Vite + React 18)"]
        StaticLMS["LMS App (Next.js 15 SSR/Static)"]
    end

    subgraph Backend ["🔥 Backend (Firebase Serverless Grid)"]
        FirebaseAuth["Firebase Auth (RBAC JWT Token)"]
        Firestore[("Firestore NoSQL DB")]
        Storage["Firebase Cloud Storage"]
    end

    Browser --> DNS
    DNS --> WAF
    WAF --> Cache
    Cache --> WorkerOG
    Cache --> WorkerFeed
    Cache --> StaticLanding
    Cache --> StaticLMS
    
    WorkerOG --> Firestore
    StaticLanding --> FirebaseAuth
    StaticLMS --> FirebaseAuth
    StaticLMS --> Firestore
    StaticLMS --> Storage
```

---

## 💾 Entity-Relationship Model (ERD)

The database schema maps users, lessons, courses, tasks, and the final sweat equity minting events using strict relational integrity constraints inside Firestore.

```mermaid
erDiagram
    USERS {
        string uid PK
        string email
        string displayName
        string role
        string departmentId
        int totalPoints
        int completedTaskCount
    }
    DEPARTMENTS {
        string id PK
        string title
        int memberCount
    }
    COURSES {
        string id PK
        string title
        string departmentId FK
        int lessonCount
        int estimatedHours
    }
    LESSONS {
        string id PK
        string courseId FK
        string departmentId FK
        string title
        string resourceUrl
        string taskId FK
    }
    TASKS {
        string id PK
        string title
        string departmentId FK
        int maxPoints
        string deadlineAt
        string instructions
        list allowedSubmissionTypes
    }
    SUBMISSIONS {
        string id PK
        string taskId FK
        string userId FK
        string status
        string submissionUrl
        string submittedText
        int awardedPoints
        string reviewComment
        string submittedAt
    }
    SWEAT_EQUITY_LEDGER {
        string id PK
        string userId FK
        string submissionId FK
        int pointsMinted
        string timestamp
        string actionType
    }

    USERS ||--o{ SUBMISSIONS : submits
    USERS ||--o{ SWEAT_EQUITY_LEDGER : owns
    DEPARTMENTS ||--o{ USERS : contains
    DEPARTMENTS ||--o{ COURSES : offers
    DEPARTMENTS ||--o{ TASKS : assigns
    COURSES ||--o{ LESSONS : contains
    LESSONS ||--o| TASKS : references
    TASKS ||--o{ SUBMISSIONS : receives
    SUBMISSIONS ||--|| SWEAT_EQUITY_LEDGER : generates
```

---

## 📈 Data Flow Diagram (DFD Level 1)

This flow tracks how user evidence is input, run through automated AI analysis, graded by mentors, and minted into immutable equity ledgers.

```mermaid
graph TD
    User["👤 Learner / Contributor"]
    Reviewer["👥 Department Head / Mentor"]
    
    subgraph Processors ["Data Flow Processors"]
        P1["1.0 Submit Task & Proof"]
        P2["2.0 Run AI Pre-validation"]
        P3["3.0 Assess & Approve Submission"]
        P4["4.0 Mint Sweat Equity Points"]
    end
    
    subgraph DataStores [("Data Stores")]
        DB_Users[("Users Store")]
        DB_Submissions[("Submissions Store")]
        DB_Ledger[("Sweat Equity Ledger")]
    end
    
    User -->|Submits proof URL & notes| P1
    P1 -->|Draft Recovery & Inputs| DB_Submissions
    
    P1 -->|Triggers validation check| P2
    P2 -->|Reads Task Instructions| DB_Submissions
    P2 -->|Returns AI Pre-check feedback| User
    
    DB_Submissions -->|Presents pending queue| P3
    Reviewer -->|Reviews evidence & logs grade| P3
    P3 -->|Updates submission status| DB_Submissions
    
    P3 -->|Triggers atomic transactions| P4
    P4 -->|Appends Ledger Block| DB_Ledger
    P4 -->|Increments Total Points| DB_Users
```

---

## 👥 Use Case Map

Interaction models showing exact boundaries and access permissions between standard Members, Mentors, and Administrators.

```mermaid
leftToRightDirection
graph TD
    Member["👤 Member (Learner/Builder)"]
    Mentor["👥 Mentor / Department Head"]
    Admin["⚙️ Super Administrator"]

    subgraph UseCases ["EquiSaaS BD Core Capabilities"]
        UC_Register["Register & Select Department"]
        UC_BrowseCourses["Browse Courses & Lessons"]
        UC_ValidateAI["Run AI Pre-check Validation"]
        UC_SubmitProof["Submit Task Proof of Work"]
        UC_ReviewSubmissions["Review Submissions Queue"]
        UC_ManageAccess["Manage Roles & Permissions"]
        UC_MintEquity["Mint Sweat Equity Ledger Points"]
        UC_GenerateCert["Generate HD Certificate OG Image"]
    end

    Member --> UC_Register
    Member --> UC_BrowseCourses
    Member --> UC_ValidateAI
    Member --> UC_SubmitProof
    Member --> UC_GenerateCert

    Mentor --> UC_ReviewSubmissions
    Mentor --> UC_MintEquity

    Admin --> UC_ManageAccess
    Admin --> UC_MintEquity
```

---

## ⏱️ Core Protocol Sequence Diagram

Execution loop detailing task progression, AI precheck loops, manual mentor approval, and atomic points minting.

```mermaid
sequenceDiagram
    autonumber
    actor Learner as 👤 Learner
    participant LMS as 🎓 LMS Frontend (Next.js)
    participant AI as 🧠 AI Validator (/api/ai/validate-proof)
    participant FS as 🔥 Firestore DB
    actor Mentor as 👥 Mentor / Dept Head
    participant Ledger as ⛓️ Sweat Equity Ledger

    Learner->>LMS: Selects Task & opens Verified Resource
    Learner->>LMS: Completes task & inputs Proof URL
    Learner->>LMS: Clicks "Run AI Pre-check"
    activate LMS
    LMS->>AI: POST /api/ai/validate-proof (instructions, checklist, url)
    activate AI
    Note over AI: Simulated labor progress<br>(Vocab/Depth/Structure analysis)
    AI-->>LMS: Return pre-check status (success/warning/error + confidence)
    deactivate AI
    LMS-->>Learner: Display AI Assessment feedback badge
    deactivate LMS
    
    Learner->>LMS: Clicks "Submit proof"
    activate LMS
    LMS->>FS: Write Submission Document (status: pending)
    FS-->>LMS: Return confirmation
    LMS-->>Learner: Display status "Pending Review"
    deactivate LMS

    Mentor->>LMS: Opens Review Queue & inspects proof URL
    Mentor->>LMS: Approves submission (logs points & feedback)
    activate LMS
    LMS->>FS: Execute Atomic Batch Transaction
    FS->>FS: Update Submission document status: "approved"
    FS->>Ledger: Append Sweat Equity Ledger entry
    FS->>FS: Increment Learner totalPoints & completedTaskCount
    FS-->>LMS: Return Transaction Success
    LMS-->>Mentor: Display Approval Successful
    deactivate LMS
    
    LMS-->>Learner: Updates dashboard progress milestones & Sweat Equity ring
```

---

## 🛠️ Tech Stack & Micro-services

We engineer for stability, accessibility, and high performance.

- **Frontend Core**: Vite + React 18 for high-impact, high-conversion landing presentation.
- **Member Engine**: Next.js 15 + React 19 for modular, server-rendered LMS portals.
- **Edge Layer**: Cloudflare Workers for caching, dynamic content delivery, and custom aspect-ratio Open Graph (OG) image generation (via `resvg-wasm` and Satori).
- **Backend Architecture**: Firebase Auth (zero-trust RBAC), Cloud Firestore (NoSQL, server-side atomic constraints), Cloud Storage.
- **Cognitive UX**:
  - **Goal Gradient Effect**: Progressive milestone bars loaded with artificial start values (15%) to boost onboarding momentum.
  - **Zeigarnik Effect**: Active checklist loops and visual tension metrics prompting users to resolve incomplete tasks.
  - **Labor Illusion**: Perceived value spinners simulating server workloads during submission security steps and AI pre-checks.
  - **Scarcity & Urgency**: Live counters of active members and ticking cycle countdowns for intake closing.

---

## 🚀 Getting Started

### Local Setup
```bash
# Clone the protocol OS
git clone https://github.com/EquiSaaS-BD/equisaas-bd.git

# Install ecosystem-wide dependencies
npm install
cd landing && npm install
cd ../lms && npm install
cd ..

# Spin up development environments
npm run dev:landing   # Vite Corporate Hub (Port 5173)
npm run dev:lms       # Next.js Builder Portal (Port 3000)
```

### Global Releases
We run a single-command deploy pipeline to release static landing assets, LMS updates, and purge our global Cloudflare CDNs:
```bash
npm run release:hosting
```

---

<div align="center">
  <br/>
  <i>"Code wins arguments. Equity wins the future."</i>
  <br/><br/>
  <b>EquiSaaS BD Core Engineering Team</b>
</div>
