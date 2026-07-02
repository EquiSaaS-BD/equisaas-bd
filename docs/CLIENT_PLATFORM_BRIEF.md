# EquiSaaS BD Platform Client Brief

## 1. Platform Overview

**Platform name:** EquiSaaS BD  
**Live URL:** https://equisaas-bd.web.app  
**LMS URL:** https://equisaas-bd.web.app/lms  
**Current version:** LMS V1  
**Deployment model:** Firebase Hosting + Firebase Authentication + Cloud Firestore

EquiSaaS BD is a two-layer digital platform:

1. A **public-facing website** that explains the organization, its mission, departments, and application path.
2. A **protected LMS and internal operations layer** that manages onboarding, department learning, task submissions, review workflow, attendance, announcements, and sweat equity records.

The platform is designed to be lightweight, practical, and low-cost. The LMS runs on a Spark-safe architecture using static hosting and Firestore-driven content, without server-side rendering, video hosting, or internal chat.

---

## 2. What the Platform Contains

### A. Public Website

The public website is the first layer of the platform. Its purpose is to present EquiSaaS BD publicly and direct users into the LMS or application process.

Current public website sections include:

- Hero / main brand introduction
- Strategy section
- Mission simulator
- Phase 2 section
- How it works
- Department matcher
- Departments explorer
- FAQ
- Footer with external links

Public website features:

- bilingual content support interface
- light and dark theme toggle
- direct link to LMS
- direct application form link
- link to presentation page
- responsive design for mobile and desktop

Important public links:

- Main site: `https://equisaas-bd.web.app`
- LMS entry: `https://equisaas-bd.web.app/lms`
- Presentation page: `https://equisaas-bd.web.app/presentation.html`
- Application form: `https://forms.gle/uawFjdAEkFwpqoQcA`

### B. LMS / Internal Platform

The LMS is the operational core of the platform. It combines four functions in one system:

- Learning Management System
- Department-based training platform
- Submission and review system
- Sweat equity contribution ledger

The LMS is not a general social network, chat application, or payroll system. It is built to manage structured learning and trusted contribution records.

---

## 3. Core Business Purpose

The platform supports community members through a structured departmental training and review process.

Its goals are:

- assign each member to one operating department
- train members through department-specific courses and lessons
- publish tasks linked to learning outcomes
- collect verifiable submissions
- review work manually for quality
- record approved attendance and contribution points
- maintain a trusted sweat equity history for each member

This structure prepares members for practical collaboration and internal project execution.

---

## 4. Department Structure

In V1, each member belongs to **one department only**.

### Parent Groups

- Engineering
- Design
- Product
- Marketing

### Departments

- Front-end Engineer
- Back-end Engineer
- DevOps & QA
- UI/UX Design
- Graphic & Social Design
- Business Analyst
- Product Management
- Digital Marketing
- CRM & Customer Success

This single-department model keeps routing, review scope, permissions, and Firestore queries simple and cost-efficient.

---

## 5. User Roles

The LMS uses five roles.

### 1. Super Admin

Highest system authority.

Capabilities:

- full platform access
- manage all users across all departments
- assign roles
- reassign departments
- manage all courses, lessons, tasks, and announcements
- review all submissions
- approve and award points
- manage critical system configuration

### 2. Director

Organization-wide leadership role with broad oversight.

Capabilities:

- view and manage all departments
- manage users across departments
- create and manage curriculum across departments
- publish both global and department announcements
- review submissions across departments
- award points

### 3. Department Head

Operational owner of a single department.

Capabilities:

- manage curriculum in own department
- create courses
- create lessons
- create tasks
- publish department announcements
- review submissions in own department
- approve or reject submissions in own department
- award points in own department
- update user roles and status within own department scope

### 4. Mentor

Senior contributor or trainer within a department.

Capabilities:

- access review queue for own department
- read submissions in own department
- add recommendation
- add review comment
- recommend points

Limitations:

- cannot finalize point approval
- cannot create official ledger credits
- cannot update user roles
- cannot manage system-wide settings

### 5. Member

Standard learner and contributor role.

Capabilities:

- register and log in
- choose department during onboarding
- access only own department content
- view published courses and lessons
- submit task work
- view submission status
- view official points ledger
- read announcements
- update limited personal profile fields

Limitations:

- cannot review other submissions
- cannot edit others' data
- cannot award or edit points
- cannot access management or review actions beyond own scope

---

## 6. Role Summary Matrix

| Action | Super Admin | Director | Department Head | Mentor | Member |
|---|---|---|---|---|---|
| Register / login | Yes | Yes | Yes | Yes | Yes |
| Choose own department on first setup | Yes | Yes | Yes | Yes | Yes |
| View own dashboard | Yes | Yes | Yes | Yes | Yes |
| View published department content | Yes | Yes | Yes | Yes | Yes |
| Submit tasks | Yes | Yes | Yes | Yes | Yes |
| View own points ledger | Yes | Yes | Yes | Yes | Yes |
| Create courses / lessons / tasks | Yes | Yes | Yes, own department | No | No |
| Publish department announcements | Yes | Yes | Yes | No | No |
| Publish global announcements | Yes | Yes | No | No | No |
| Review department submissions | Yes | Yes | Yes, own department | Yes, own department | No |
| Final approve / reject submissions | Yes | Yes | Yes, own department | No | No |
| Award points | Yes | Yes | Yes, own department | No | No |
| Record attendance with points | Yes | Yes | Yes, own department | No | No |
| Update user role / status | Yes | Yes | Yes, own department | No | No |
| Manage configs | Yes | No | No | No | No |

---

## 7. Public and Protected Pages

### Public Pages

- `/`
- `/presentation.html`
- external application form link
- `/lms`
- `/lms/login`
- `/lms/register`

### Protected LMS Pages

- `/lms/dashboard`
- `/lms/department`
- `/lms/courses`
- `/lms/lesson`
- `/lms/task`
- `/lms/submissions`
- `/lms/points`
- `/lms/announcements`
- `/lms/manage`
- `/lms/review`

Notes:

- The LMS uses static export, so lesson and task detail pages use query parameters instead of server-generated dynamic routes.
- Example: `/lms/task?taskId=...`
- Example: `/lms/lesson?lessonId=...&courseId=...`

---

## 8. LMS Module Breakdown

### 8.1 Authentication

Authentication is handled by Firebase Authentication.

Current V1 launch flow:

- email and password sign-up
- email and password login
- optional Google sign-in path exists in the UI, but email/password is the primary launch flow and Google should only be used if enabled in Firebase console

### 8.2 User Profile

Each user profile stores:

- full name
- display name
- email
- phone
- department
- parent department
- role
- status
- join date
- profile image URL
- total points
- completed task count
- current stage

### 8.3 Department Dashboard

The department area gives members a scoped departmental view.

It includes:

- department name
- parent group
- member count
- course count
- department head reference
- mentor count
- department announcements
- department course list

### 8.4 Courses and Lessons

Courses are department-specific and published from Firestore.

Each course can include:

- title
- description
- difficulty
- estimated hours
- lesson count
- ordered sequence

Each lesson can include:

- title
- summary
- video URL
- reading content
- linked task
- completion tracking

### 8.5 Task System

Tasks are the main assignment unit in the LMS.

Each task can include:

- title
- instructions
- related department
- related course
- optional lesson relationship
- allowed submission types
- maximum points
- deadline
- manual review mode

Allowed submission styles include:

- text
- GitHub link
- Figma link
- Google Drive link
- generic link

### 8.6 Submission System

Members submit work through the task page.

Each submission records:

- task ID
- user ID
- user display name
- department ID
- optional course ID
- optional lesson ID
- notes or explanation
- one or more submission links
- status
- review comment
- recommendation fields
- awarded points
- timestamps

Important V1 rule:

- each member has one primary submission record per task
- resubmitting updates that same record instead of creating duplicates

### 8.7 Review Workflow

Reviews are manual in V1.

Mentors can:

- read department submissions
- recommend approve / revision / reject
- write review comments
- recommend points

Department heads, directors, and super admins can:

- approve submissions
- request revision
- reject submissions
- finalize awarded points

### 8.8 Sweat Equity Ledger

This is a trusted points ledger, not just a counter.

Every approved point change creates a ledger entry that stores:

- user
- department
- source type
- source document ID
- points
- approver
- note
- timestamp

The user profile also stores a summary total for fast dashboard reads.

### 8.9 Attendance

Attendance is manual in V1.

Supported examples:

- orientation
- workshop
- assignment
- check-in

If points are assigned through attendance, the system also creates the matching points ledger entry.

### 8.10 Announcements

Announcements are official broadcast records.

Supported scopes:

- global
- department

Use cases:

- deadlines
- internal notices
- event reminders
- department updates

### 8.11 Management Panel

The management page is the operations console for authorized roles.

Capabilities include:

- create course
- create lesson
- create task
- publish announcement
- record attendance
- update user role, status, and department

### 8.12 Dashboard Summaries

The dashboard is optimized to load small summary sets only.

It intentionally loads:

- latest 3 announcements
- latest 3 open tasks
- latest 3 user submissions
- latest 3 points entries
- latest course summary items

This protects read usage on Firebase Spark.

---

## 9. How the Platform Is Used

### A. Member Journey

1. Member visits public site.
2. Member applies through the public application form or enters LMS directly if already approved.
3. Member registers with email/password.
4. On first login, member selects one department.
5. Member lands on dashboard.
6. Member opens courses and lessons.
7. Member marks lessons complete.
8. Member opens linked tasks.
9. Member submits work.
10. Submission enters manual review.
11. Member checks status on Submissions page.
12. If approved, points appear on Points page.

### B. Mentor Journey

1. Mentor logs in.
2. Mentor opens Review page.
3. Mentor checks department submissions.
4. Mentor adds recommendation and comment.
5. Mentor suggests points for the approver.

### C. Department Head Journey

1. Department head logs in.
2. Opens Manage page to create curriculum and assignments.
3. Publishes department announcements.
4. Reviews incoming submissions.
5. Approves or requests revision.
6. Awards official points after approval.
7. Records attendance when needed.
8. Updates user role/status within department scope.

### D. Director / Super Admin Journey

1. Logs in with full super-admin access.
2. Monitors all departments.
3. Publishes global announcements if needed.
4. Reassigns roles and departments.
5. Reviews or resolves high-level submission workflows.
6. Oversees platform integrity and operational governance.

---

## 10. Data Architecture

The platform uses Cloud Firestore.

### Main Collections

- `users`
- `departments`
- `courses`
- `lessons`
- `tasks`
- `submissions`
- `pointsLedger`
- `attendance`
- `announcements`
- `configs`
- `users/{uid}/progress/{courseId}`

### Purpose of Each Collection

**users**  
Stores profile, role, department, status, and summary counters.

**departments**  
Stores each department's metadata, head reference, mentor IDs, course count, and member count.

**courses**  
Stores published department learning units.

**lessons**  
Stores lesson content, ordering, YouTube link, reading content, and linked task reference.

**tasks**  
Stores assignments, deadlines, review mode, and max points.

**submissions**  
Stores member task evidence and review status.

**pointsLedger**  
Stores official approved credit records.

**attendance**  
Stores manual attendance events and related credits.

**announcements**  
Stores official global and department notices.

**configs**  
Stores app-wide rules such as points rules and app settings.

**progress subcollection**  
Stores per-course lesson completion by user.

---

## 11. Security and Integrity Model

The platform uses Firebase Auth plus Firestore security rules.

Key controls:

- users can only edit their own limited profile fields
- users can only create and edit their own submissions
- members can only read published content for their assigned department
- mentors can review only within their own department
- department heads can manage and approve only within their own department
- directors and super admins have wider organizational scope
- points cannot be self-awarded by members
- points ledger records cannot be casually edited
- only approved roles can create official credits

Points integrity rule:

- a point total is never treated as the only source of truth
- the ledger is the trusted record
- the user total is the summary field for fast reads

---

## 12. Platform Architecture and Technology

### Frontend

- Public site: React + Vite
- LMS: Next.js App Router configured as static export

### Backend / Cloud Services

- Firebase Hosting
- Firebase Authentication
- Cloud Firestore

### Why This Architecture Was Chosen

- works on Firebase Spark-friendly constraints
- low hosting cost
- simple deployment flow
- minimal moving parts
- no server runtime needed for V1
- safer read patterns through summary documents and limited dashboard queries

### Deployment Structure

- root site serves the public website
- LMS is served under `/lms`
- both are deployed together through Firebase Hosting

---

## 13. Current Seeded / Configured Behavior

The platform includes setup support for:

- canonical department seeding
- course and lesson seeding from templates
- task seeding from roadmap templates
- legacy user migration into the V1 role and department model
- app settings document
- points rules document

Current app settings include:

- single department per user in V1
- manual review required for points approval
- authorized point approver roles: super admin, director, department head
- Google sign-in marked as optional, not required for launch

---

## 14. What Is Not Included in V1

To keep the platform lean and cost-efficient, the following features are intentionally out of scope:

- internal chat
- real-time messaging
- discussion forum
- built-in video hosting
- advanced quiz engine
- certificate generator
- advanced analytics dashboard
- payroll or revenue payout logic
- gamification badges
- complex automation workflows

Recommended external tools:

- WhatsApp/email for direct support communication
- YouTube for video hosting
- GitHub, Figma, and Google Drive for work evidence

---

## 15. Operational Guidance for Client

### Recommended Daily Operations

- members complete lessons and tasks
- mentors review incoming submissions
- department heads finalize outcomes
- announcements are used for official notices
- attendance is recorded only when needed

### Recommended Weekly Operations

- review department submissions backlog
- publish current-week announcements
- update curriculum if needed
- confirm role assignments
- verify ledger entries for approved work

### Recommended Governance Rules

- only approved work should receive points
- do not give manual points without a source event
- keep one active department per user
- use department announcements for official notices, not chat
- keep videos external to avoid storage cost

---

## 16. Initial Client Admin Checklist

Before or during onboarding, the client team should ensure:

1. Super admin account is assigned correctly.
2. Departments are seeded.
3. Courses, lessons, and initial tasks are seeded or created.
4. Department heads and mentors are assigned by role.
5. Firebase Authentication providers are configured as intended.
6. If Google sign-in is desired, it must be enabled in Firebase console before use.
7. Members are instructed to choose their department after first login.
8. Reviewers understand that mentors recommend and approvers finalize.

---

## 17. Plain-Language Summary for Client

EquiSaaS BD is a community platform with a public website and a protected internal LMS.

The public website explains the organization and directs people to apply or log in.  
The LMS is where members are onboarded, assigned to a department, trained through courses and lessons, given tasks, reviewed manually, and credited through a trusted points ledger.

The platform is intentionally lean in V1. It focuses on learning, contribution evidence, review quality, and operational clarity instead of trying to do everything at once. This keeps it sustainable, easier to manage, and suitable for low-cost Firebase hosting.

---

## 18. Handover Status

Current status:

- platform deployed
- public website live
- LMS live
- Firestore rules deployed
- Firestore indexes deployed
- role-based access model implemented
- V1 content and migration tooling included

Live URL for handoff:

- https://equisaas-bd.web.app
