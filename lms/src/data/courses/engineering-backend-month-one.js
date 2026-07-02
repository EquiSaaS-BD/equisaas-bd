const makeSandpack = (code) => ({
  template: "react",
  files: {
    "/App.js": { code },
  },
});

const academicLesson = ({
  titleEn, titleBn, introEn, introBn, learnEn, learnBn, whatEn, whatBn, whyEn, whyBn,
  thinkEn, thinkBn, stepsEn, stepsBn, conceptsEn, conceptsBn, whenEn, whenBn,
  exampleEn, exampleBn, mistakesEn, mistakesBn, applyEn, applyBn, assignmentEn,
  assignmentBn, quickCheckEn, quickCheckBn, summaryEn, summaryBn, sandpack, resources,
}) => ({
  titleEn,
  titleBn,
  contentEn: [
    `## ${titleEn}`,
    "", ...introEn, "",
    "### What You Will Learn", ...learnEn.map((item) => `- ${item}`), "",
    "### What It Is", ...whatEn, "",
    "### Why It Matters", ...whyEn, "",
    "### Think Of It Like This", ...thinkEn, "",
    "### How It Works Step by Step", ...stepsEn.map((item, index) => `${index + 1}. ${item}`), "",
    "### Key Concepts", ...conceptsEn.map((item) => `- ${item}`), "",
    "### When To Use It", ...whenEn.map((item) => `- ${item}`), "",
    "### Real Example", ...exampleEn, "",
    "### Common Mistakes", ...mistakesEn.map((item) => `- ${item}`), "",
    "### How To Apply It", ...applyEn.map((item) => `- ${item}`), "",
    "### Assignment Challenge", ...assignmentEn.map((item) => `- ${item}`), "",
    "### Quick Self-Check", ...quickCheckEn.map((item) => `- ${item}`), "",
    "### Summary", ...summaryEn.map((item) => `- ${item}`),
  ].join("\n"),
  contentBn: [
    `## ${titleBn}`,
    "", ...introBn, "",
    "### এই লেসনে আপনি শিখবেন", ...learnBn.map((item) => `- ${item}`), "",
    "### এটি আসলে কী", ...whatBn, "",
    "### কেন গুরুত্বপূর্ণ", ...whyBn, "",
    "### সহজভাবে ভাবুন", ...thinkBn, "",
    "### ধাপে ধাপে কীভাবে কাজ করে", ...stepsBn.map((item, index) => `${index + 1}. ${item}`), "",
    "### মূল ধারণা", ...conceptsBn.map((item) => `- ${item}`), "",
    "### কখন ব্যবহার করবেন", ...whenBn.map((item) => `- ${item}`), "",
    "### বাস্তব উদাহরণ", ...exampleBn, "",
    "### সাধারণ ভুল", ...mistakesBn.map((item) => `- ${item}`), "",
    "### কীভাবে নিজের কাজে ব্যবহার করবেন", ...applyBn.map((item) => `- ${item}`), "",
    "### অ্যাসাইনমেন্ট", ...assignmentBn.map((item) => `- ${item}`), "",
    "### নিজেকে যাচাই করুন", ...quickCheckBn.map((item) => `- ${item}`), "",
    "### সারসংক্ষেপ", ...summaryBn.map((item) => `- ${item}`),
  ].join("\n"),
  sandpack,
  resources,
});

const backendCoreResources = [
  { labelEn: "Laravel Lifecycle Docs", labelBn: "Laravel Lifecycle ডকস", url: "https://laravel.com/docs/12.x/lifecycle" },
  { labelEn: "Node.js Intro", labelBn: "Node.js Intro", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" },
  { labelEn: "Express Routing Guide", labelBn: "Express Routing গাইড", url: "https://expressjs.com/en/guide/routing.html" },
];

const apiResources = [
  { labelEn: "MDN HTTP Overview", labelBn: "MDN HTTP Overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
  { labelEn: "Microsoft REST API Guidelines", labelBn: "REST API গাইডলাইন", url: "https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md" },
  { labelEn: "JSON:API Recommendations", labelBn: "JSON:API রেফারেন্স", url: "https://jsonapi.org/recommendations/" },
];

const serviceResources = [
  { labelEn: "Laravel Middleware Docs", labelBn: "Laravel Middleware ডকস", url: "https://laravel.com/docs/12.x/middleware" },
  { labelEn: "Express Middleware Guide", labelBn: "Express Middleware গাইড", url: "https://expressjs.com/en/guide/using-middleware.html" },
  { labelEn: "Martin Fowler Service Layer", labelBn: "Service Layer রেফারেন্স", url: "https://martinfowler.com/eaaCatalog/serviceLayer.html" },
];

export const BACKEND_MONTH_ONE = {
  "be-1-1": academicLesson({
    titleEn: "Laravel/Node Core Concepts",
    titleBn: "Laravel/Node কোর কনসেপ্ট",
    introEn: [
      "Backend engineering starts with one big idea: users do not see backend code, but every trustworthy product experience depends on it. Login, task loading, profile reading, and submission review all travel through backend flow.",
      "Beginners often think backend means only database queries or only framework syntax. Both ideas are too small. Real backend work means understanding request flow: where a request enters, where checks happen, where business rules run, and where data is stored or returned.",
      "Laravel and Node.js look different, but the underlying questions are similar. Where should validation happen? Should controllers stay thin? Where do business decisions live? Once you can answer those questions, any server framework becomes easier to learn.",
      "This lecture builds that foundation so a learner can trace one request from route to response and explain each layer in plain language.",
    ],
    introBn: [
      "Backend engineering বুঝতে হলে একটি বড় idea ধরতে হবে: user backend code দেখে না, কিন্তু trustworthy product experience backend-এর ওপর দাঁড়িয়ে থাকে। login, task loading, profile reading, আর submission review - সব backend flow-এর মধ্য দিয়ে যায়।",
      "নতুনরা সাধারণত ভাবে backend মানে শুধু database query বা শুধু framework syntax। দুইটিই অসম্পূর্ণ। আসল backend কাজ হলো request flow বোঝা: request কোথায় ঢোকে, কোথায় check হয়, কোথায় business rule চলে, আর কোথায় data store বা return হয়।",
      "Laravel আর Node.js দেখতে আলাদা, কিন্তু ভেতরের architectural প্রশ্নগুলো কাছাকাছি। validation কোথায় হবে? controller thin থাকবে? business decision কোথায় থাকবে? এই প্রশ্নগুলোর উত্তর বুঝলে যেকোনো server framework শেখা সহজ হয়।",
      "এই lecture সেই foundation তৈরি করবে, যাতে learner route থেকে response পর্যন্ত request trace করতে পারে এবং প্রতিটি layer নিজের ভাষায় explain করতে পারে।",
    ],
    learnEn: [
      "How the backend request lifecycle works from route to response",
      "Why controllers, middleware, services, and data access should not all do the same job",
      "How Laravel and Node.js share the same architectural ideas even when syntax differs",
      "How to read a backend feature by following responsibility boundaries",
    ],
    learnBn: [
      "route থেকে response পর্যন্ত backend request lifecycle কীভাবে কাজ করে",
      "কেন controller, middleware, service, আর data access-এর একই কাজ করা উচিত না",
      "Laravel আর Node.js syntax আলাদা হলেও architectural idea কীভাবে একই থাকে",
      "responsibility boundary follow করে backend feature কীভাবে পড়তে হয়",
    ],
    whatEn: [
      "Laravel/Node core concepts are the basic building blocks of a server-side application. A route receives the HTTP request, middleware performs shared checks, a controller handles request-response concerns, a service applies business rules, and the data layer talks to storage.",
      "The folder names can change across frameworks, but the responsibility boundaries should stay readable. If all logic mixes together, debugging becomes slower and review becomes riskier.",
      "The goal is not to memorize patterns mechanically. The goal is to make request flow visible and reviewable.",
    ],
    whatBn: [
      "Laravel/Node core concept হলো server-side application-এর basic building block। route HTTP request নেয়, middleware shared check চালায়, controller request-response concern সামলায়, service business rule চালায়, আর data layer storage-এর সাথে কথা বলে।",
      "framework ভেদে folder name বদলাতে পারে, কিন্তু responsibility boundary readable থাকা দরকার। সব logic মিশে গেলে debugging slow হয় আর review riskier হয়।",
      "লক্ষ্য mechanically pattern মুখস্থ করা নয়। লক্ষ্য হলো request flow-কে visible আর reviewable করা।",
    ],
    whyEn: [
      "In a cooperative LMS, many people will contribute over time. Clear layers reduce fear because new contributors can read old flows without guessing hidden side effects.",
      "When a status transition is wrong, the team should be able to point at one clear layer instead of arguing across random files.",
      "This foundation matters before auth, queues, or testing get advanced. If the basic request path is blurry, every advanced topic becomes harder.",
    ],
    whyBn: [
      "একটি cooperative LMS-এ সময়ের সাথে অনেক মানুষ contribute করবে। clear layer fear কমায়, কারণ নতুন contributor hidden side effect আন্দাজ না করে পুরনো flow পড়তে পারে।",
      "status transition ভুল হলে team random file নিয়ে তর্ক না করে একটি clear layer-এ আঙুল রাখতে পারা উচিত।",
      "auth, queue, বা testing advanced হওয়ার আগে এই foundation দরকার। basic request path blurry হলে পরের সব topic কঠিন লাগে।",
    ],
    thinkEn: [
      "Think of a hospital desk. One person receives the visitor, one checks identity, one sends the case to the right doctor, and one stores the record. If one person tries to do everything, the system becomes slow and error-prone.",
      "Backend layers work the same way. Each step has one job, and the request moves forward only after that job is done.",
    ],
    thinkBn: [
      "একটি hospital desk ভাবুন। একজন visitor নেয়, একজন identity check করে, একজন সঠিক doctor-এর কাছে পাঠায়, আর একজন record store করে। একজন যদি সবকিছু করতে যায়, system slow আর error-prone হয়ে যায়।",
      "backend layer-ও একইভাবে কাজ করে। প্রতিটি ধাপের একটি job থাকে, আর কাজ শেষ হলে request সামনে যায়।",
    ],
    stepsEn: [
      "The client sends an HTTP request such as GET /tasks or POST /submissions.",
      "The router matches method and URL to the right handler.",
      "Middleware checks auth, validation, throttling, or request context.",
      "The controller reads the request and delegates the real rule-heavy work.",
      "The service layer applies business rules and decides what should happen.",
      "The data layer reads or writes storage and returns structured data.",
      "The controller shapes the final response and sends it back.",
    ],
    stepsBn: [
      "client GET /tasks বা POST /submissions-এর মতো request পাঠায়।",
      "router method আর URL match করে সঠিক handler খুঁজে বের করে।",
      "middleware auth, validation, throttling, বা request context check করে।",
      "controller request পড়ে এবং rule-heavy কাজ delegate করে।",
      "service layer business rule চালায় এবং কী হওয়া উচিত তা decide করে।",
      "data layer storage read/write করে structured data ফেরত দেয়।",
      "controller final response shape করে ফেরত পাঠায়।",
    ],
    conceptsEn: ["Route", "Middleware", "Controller", "Service", "Repository or data access", "Request lifecycle"],
    conceptsBn: ["Route", "Middleware", "Controller", "Service", "Repository বা data access", "Request lifecycle"],
    whenEn: ["When starting a new backend feature", "When existing backend code feels tangled", "When onboarding new contributors", "When product rules and technical layers are mixing together"],
    whenBn: ["যখন নতুন backend feature শুরু করছেন", "যখন existing backend code জটিল লাগে", "যখন নতুন contributor onboard করছেন", "যখন product rule আর technical layer গুলিয়ে যাচ্ছে"],
    exampleEn: [
      "Suppose a member opens a task review screen. The route receives GET /department-tasks/42. Middleware checks whether the user is signed in and belongs to a permitted scope. The controller passes taskId and user context into a review service. The review service decides whether the user may read the task and what extra data should be included. A repository loads the task and submissions. Finally, the controller returns safe JSON to the frontend.",
    ],
    exampleBn: [
      "ভাবুন member task review screen খুলছে। route GET /department-tasks/42 নেয়। middleware দেখে user signed in আছে কি না এবং permitted scope-এ আছে কি না। controller taskId আর user context review service-এ পাঠায়। review service decide করে user task দেখতে পারবে কি না এবং কোন extra data লাগবে। repository task আর submission load করে। শেষে controller safe JSON ফেরত দেয়।",
    ],
    mistakesEn: ["Putting validation, business rules, and database writes into one controller method", "Letting middleware silently own business decisions", "Querying the database directly from every route", "Naming files by habit while hiding real responsibility"],
    mistakesBn: ["validation, business rule, আর database write এক controller method-এ ঢুকিয়ে দেওয়া", "middleware-এর হাতে business decision ছেড়ে দেওয়া", "প্রতিটি route থেকে সরাসরি database query করা", "real responsibility লুকিয়ে file name-এ ভরসা করা"],
    applyEn: ["Draw the request lifecycle before writing code", "Ask whether each file has one obvious responsibility", "Keep controllers thin and services reviewable", "Make it easy for reviewers to follow request-to-response flow"],
    applyBn: ["code লেখার আগে request lifecycle এঁকে নিন", "প্রতিটি file-এর একটি obvious responsibility আছে কি না দেখুন", "controller thin রাখুন আর service reviewable করুন", "reviewer যেন request-to-response flow সহজে follow করতে পারে"],
    assignmentEn: ["Choose one LMS feature such as login, task submission, or public profile load", "Draw its route, middleware, controller, service, and data access path", "Write 5 to 7 bullets explaining what belongs in each layer", "Submit a diagram plus a short note about where future tests should focus"],
    assignmentBn: ["login, task submission, বা public profile load-এর মতো একটি feature বেছে নিন", "এর route, middleware, controller, service, আর data access path আঁকুন", "প্রতিটি layer-এ কী থাকবে তা নিয়ে ৫ থেকে ৭টি bullet লিখুন", "diagram-এর সাথে short note submit করুন, future test কোথায় focus করবে তা লিখে"],
    quickCheckEn: ["Can you explain middleware vs service in one sentence?", "If a controller is 200 lines long, what smell might that signal?", "Why does visible request flow make debugging easier?"],
    quickCheckBn: ["middleware আর service-এর পার্থক্য এক বাক্যে explain করতে পারবেন?", "একটি controller যদি ২০০ line হয়, সেটা কোন smell দেখাতে পারে?", "visible request flow debugging সহজ করে কেন?"],
    summaryEn: ["Backend architecture becomes easier when request flow is visible", "Framework syntax changes, responsibility boundaries remain important", "Thin controllers and clear services create safer systems", "Understanding lifecycle now makes later backend topics easier"],
    summaryBn: ["request flow visible হলে backend architecture সহজ হয়", "framework syntax বদলালেও responsibility boundary গুরুত্বপূর্ণ থাকে", "thin controller আর clear service safer system তৈরি করে", "এখন lifecycle বুঝলে পরের backend topic সহজ হয়"],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";
const layers=[
{id:"route",title:"Route",detail:"Receives GET /tasks/42",color:"#dbeafe"},
{id:"middleware",title:"Middleware",detail:"Checks auth and request context",color:"#dcfce7"},
{id:"controller",title:"Controller",detail:"Understands HTTP input and output",color:"#fef3c7"},
{id:"service",title:"Service",detail:"Applies workflow rules",color:"#ede9fe"},
{id:"repository",title:"Repository",detail:"Loads and saves data",color:"#fee2e2"},
];
export default function App(){const [active,setActive]=useState("route");const current=useMemo(()=>layers.find((item)=>item.id===active),[active]);return <div style={{fontFamily:"sans-serif",padding:20,maxWidth:620}}><h2>Backend Request Lifecycle</h2><p>Click each layer and explain its job before moving on.</p><div style={{display:"grid",gap:10,marginTop:16}}>{layers.map((layer,index)=><button key={layer.id} onClick={()=>setActive(layer.id)} style={{textAlign:"left",borderRadius:14,border:active===layer.id?"2px solid #2563eb":"1px solid #cbd5e1",padding:14,background:layer.color,cursor:"pointer"}}><strong>{index+1}. {layer.title}</strong><div style={{marginTop:6}}>{layer.detail}</div></button>)}</div><div style={{marginTop:16,background:"#0f172a",color:"#fff",borderRadius:14,padding:16}}><strong>Current focus:</strong><p style={{marginBottom:0}}>{current?.detail}</p></div></div>;}`),
    resources: backendCoreResources,
  }),
  "be-1-2": academicLesson({
    titleEn: "REST API Design",
    titleBn: "REST API ডিজাইন",
    introEn: [
      "Once backend flow makes sense, the next skill is designing the API contract itself. A frontend or mobile client should not have to guess which endpoint to call, which fields are required, or what success and failure look like.",
      "REST API design is not only about URL naming. It is about choosing clear resources, sensible HTTP methods, predictable status codes, and payload shapes that stay understandable as the product grows.",
      "A weak API causes pain everywhere. Frontend code fills with special cases, QA cannot predict outcomes, and refactors become risky because no one is sure which responses are part of the contract.",
      "This lecture teaches how to design APIs that feel boring in the best possible way: clear, consistent, and easy to use.",
    ],
    introBn: [
      "backend flow বুঝে গেলে পরের skill হলো API contract design করা। frontend বা mobile client যেন আন্দাজ না করে endpoint call করতে পারে, required field বুঝতে পারে, আর success বা failure predict করতে পারে।",
      "REST API design শুধু URL naming না। এটি clear resource, sensible HTTP method, predictable status code, আর এমন payload shape বেছে নেওয়া, যা product বড় হলেও বোঝা সহজ থাকে।",
      "weak API সব জায়গায় pain তৈরি করে। frontend code special case-এ ভরে যায়, QA outcome predict করতে পারে না, আর refactor risky হয়ে যায় কারণ কেউ নিশ্চিত থাকে না কোন response contract-এর অংশ।",
      "এই lecture boring in the best possible way এমন API design শেখাবে: clear, consistent, আর easy to use।",
    ],
    learnEn: ["How to think in resources instead of random actions", "How methods, status codes, and payload shapes form an API contract", "How to design list, read, create, and update endpoints safely", "How to reduce frontend confusion with consistent response rules"],
    learnBn: ["random action-এর বদলে resource দিয়ে চিন্তা করতে শেখা", "method, status code, আর payload shape কীভাবে API contract গড়ে", "list, read, create, আর update endpoint safely design করা", "consistent response rule দিয়ে frontend confusion কমানো"],
    whatEn: [
      "REST API design means organizing backend capabilities around resources such as users, tasks, submissions, or reports. Each resource should have readable URLs and understandable operations.",
      "A good contract answers simple questions clearly: What should the client send? What will the server return? What does 200 mean here? What does 403 mean? What happens if validation fails?",
      "Good design does not mean perfection on day one. It means the contract is consistent enough that a new teammate can read it and use it without guesswork.",
    ],
    whatBn: [
      "REST API design মানে backend capability-কে users, tasks, submissions, বা reports-এর মতো resource ঘিরে organize করা। প্রতিটি resource-এর readable URL আর understandable operation থাকা উচিত।",
      "ভালো contract simple question-এর clear answer দেয়: client কী পাঠাবে? server কী ফেরত দেবে? 200 মানে কী? 403 মানে কী? validation fail হলে কী হবে?",
      "ভালো design মানে প্রথম দিনেই perfection না। মানে হলো contract এতটাই consistent যে নতুন teammate guesswork ছাড়াই ব্যবহার করতে পারে।",
    ],
    whyEn: [
      "An LMS has many repeating operations: list lessons, open a task, submit work, review a submission, update a profile. If each endpoint behaves differently without reason, the whole product becomes harder to maintain.",
      "Consistent APIs also support cooperation between frontend, product, QA, and analytics. Everybody depends on a stable contract to plan work.",
      "The more contributors a platform has, the more important boring consistency becomes.",
    ],
    whyBn: [
      "একটি LMS-এ lesson list, task open, work submit, submission review, profile update - এর মতো অনেক repeating operation থাকে। যদি endpoint অযথা আলাদা behave করে, পুরো product maintain করা কঠিন হয়।",
      "consistent API frontend, product, QA, আর analytics-এর cooperation-ও বাড়ায়। সবাই stable contract-এর ওপর কাজ plan করে।",
      "যত বেশি contributor, তত বেশি boring consistency গুরুত্বপূর্ণ।",
    ],
    thinkEn: [
      "Think of an API like a well-labeled service counter. If every desk uses a different form and different rules, visitors get lost. If every desk follows a shared pattern, the building feels easier to use.",
      "REST gives that shared pattern to backend communication.",
    ],
    thinkBn: [
      "API-কে well-labeled service counter ভাবুন। প্রতিটি desk যদি আলাদা form আর rule ব্যবহার করে, visitor হারিয়ে যায়। shared pattern থাকলে পুরো building ব্যবহার করা সহজ হয়।",
      "backend communication-এ REST সেই shared pattern দেয়।",
    ],
    stepsEn: ["Identify the resource such as tasks or submissions", "Choose the URL around that resource instead of inventing vague action names", "Map the correct HTTP method", "Define request body and validation rules", "Define success and error response shape", "Keep naming consistent with related endpoints", "Document examples so frontend and QA can consume the contract safely"],
    stepsBn: ["resource identify করুন, যেমন tasks বা submissions", "vague action name-এর বদলে resource ঘিরে URL ঠিক করুন", "সঠিক HTTP method map করুন", "request body আর validation rule define করুন", "success আর error response shape define করুন", "related endpoint-এর সাথে naming consistent রাখুন", "frontend আর QA safely consume করতে পারে এমন example document করুন"],
    conceptsEn: ["Resource", "Endpoint", "HTTP method", "Status code", "Payload", "Validation error", "Contract"],
    conceptsBn: ["Resource", "Endpoint", "HTTP method", "Status code", "Payload", "Validation error", "Contract"],
    whenEn: ["When creating a new backend feature", "When existing endpoints feel inconsistent", "When QA keeps asking what error responses should look like", "When multiple clients need to use the same backend safely"],
    whenBn: ["যখন নতুন backend feature তৈরি করছেন", "যখন existing endpoint inconsistent লাগে", "যখন QA বারবার error response সম্পর্কে জিজ্ঞেস করছে", "যখন একাধিক client safely একই backend ব্যবহার করবে"],
    exampleEn: [
      "Suppose the product needs a submission workflow. A clean design might use GET /department-tasks to list tasks, GET /department-tasks/:id to read one task, POST /task-submissions to submit work, and PATCH /task-submissions/:id to resubmit after feedback. Review actions may have their own scoped endpoints because review has a different permission boundary than submission.",
    ],
    exampleBn: [
      "ধরুন product-এর submission workflow দরকার। clean design হতে পারে GET /department-tasks দিয়ে task list, GET /department-tasks/:id দিয়ে একটি task read, POST /task-submissions দিয়ে work submit, আর PATCH /task-submissions/:id দিয়ে feedback-এর পরে resubmit। review action-এর জন্য আলাদা scoped endpoint থাকতে পারে, কারণ review permission boundary submission-এর থেকে আলাদা।",
    ],
    mistakesEn: ["Using verbs everywhere instead of clear resources", "Returning different response shapes for similar endpoints", "Treating every failure as 200 with a custom message", "Forgetting to design permission and validation errors explicitly"],
    mistakesBn: ["clear resource-এর বদলে সবখানে verb-based URL ব্যবহার করা", "similar endpoint-এর জন্য ভিন্ন response shape ফেরত দেওয়া", "সব failure-কে 200 body message বানিয়ে দেওয়া", "permission আর validation error explicitly design না করা"],
    applyEn: ["Name endpoints around resources first", "Keep error response patterns consistent", "Design with the consuming client in mind", "Write examples early so gaps become visible before implementation drifts"],
    applyBn: ["প্রথমে resource ঘিরে endpoint name ঠিক করুন", "error response pattern consistent রাখুন", "consuming client-এর কথা মাথায় রেখে design করুন", "implementation drift-এর আগে gap ধরতে early example লিখুন"],
    assignmentEn: ["Design a REST API for one LMS flow such as task submission or review queue", "Include at least four endpoints with method, URL, request body, and response notes", "Explain one permission boundary and one validation rule for each endpoint", "Submit the design as a table or markdown spec plus one paragraph on why the contract is consistent"],
    assignmentBn: ["task submission বা review queue-এর মতো একটি LMS flow-এর জন্য REST API design করুন", "কমপক্ষে চারটি endpoint দিন, যেখানে method, URL, request body, আর response note থাকবে", "প্রতিটি endpoint-এর জন্য একটি permission boundary আর একটি validation rule explain করুন", "table বা markdown spec আকারে submit করুন, সাথে লিখুন কেন contract consistent"],
    quickCheckEn: ["Can you name one resource and two methods that act on it?", "What is the difference between a validation error and a permission error?", "Why is stable response shape helpful for frontend teams?"],
    quickCheckBn: ["একটি resource-এর নাম আর দুইটি method বলতে পারবেন?", "validation error আর permission error-এর পার্থক্য কী?", "stable response shape frontend team-এর জন্য helpful কেন?"],
    summaryEn: ["REST API design is about clarity, consistency, and safe contracts", "Resources, methods, status codes, and payload shapes should work together logically", "Predictable APIs reduce confusion for frontend, QA, and future contributors", "A boring API is often a healthy API"],
    summaryBn: ["REST API design-এর মূল কথা clarity, consistency, আর safe contract", "resource, method, status code, আর payload shape logicalভাবে একসাথে কাজ করা উচিত", "predictable API frontend, QA, আর future contributor-এর confusion কমায়", "অনেক সময় boring API-ই healthy API"],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";
const endpoints=[
{method:"GET",url:"/department-tasks",purpose:"List tasks for current scope",color:"#dbeafe"},
{method:"GET",url:"/department-tasks/:id",purpose:"Read one task",color:"#dcfce7"},
{method:"POST",url:"/task-submissions",purpose:"Create a submission",color:"#fef3c7"},
{method:"PATCH",url:"/task-submissions/:id",purpose:"Resubmit or update notes",color:"#ede9fe"},
];
export default function App(){const [activeIndex,setActiveIndex]=useState(0);const endpoint=useMemo(()=>endpoints[activeIndex],[activeIndex]);return <div style={{fontFamily:"sans-serif",padding:20,maxWidth:640}}><h2>REST Contract Planner</h2><p>Select an endpoint and explain what request body and status code it needs.</p><div style={{display:"grid",gap:10,marginTop:16}}>{endpoints.map((item,index)=><button key={item.url} onClick={()=>setActiveIndex(index)} style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",borderRadius:14,border:index===activeIndex?"2px solid #2563eb":"1px solid #cbd5e1",padding:14,background:item.color,cursor:"pointer",textAlign:"left"}}><div><strong>{item.method}</strong><div>{item.url}</div></div><div style={{color:"#334155"}}>{item.purpose}</div></button>)}</div><div style={{marginTop:16,borderRadius:14,background:"#0f172a",color:"#fff",padding:16}}><strong>Active endpoint:</strong><p>{endpoint.method} {endpoint.url}</p><p style={{marginBottom:0}}>{endpoint.purpose}</p></div></div>;}`),
    resources: apiResources,
  }),
  "be-1-3": academicLesson({
    titleEn: "Service Layer & Middleware",
    titleBn: "সার্ভিস লেয়ার ও মিডলওয়্যার",
    introEn: [
      "After understanding request lifecycle and API contracts, the next important boundary is this: which logic belongs in middleware, and which logic belongs in services? Many beginner backends become confusing exactly at this point.",
      "Middleware is tempting because it runs early and can see every request. Services are tempting because they feel like a place to dump everything the controller does not want. If we use both carelessly, the backend turns into a maze.",
      "A healthier rule is simple. Middleware protects shared request-level concerns such as authentication, validation context, throttling, or request enrichment. Service layers own business rules, workflow decisions, and reusable domain behavior.",
      "Once this boundary is clear, controllers become smaller, reviews become easier, and product logic becomes easier to test.",
    ],
    introBn: [
      "request lifecycle আর API contract বোঝার পরে পরের গুরুত্বপূর্ণ boundary হলো: কোন logic middleware-এ থাকবে, আর কোন logic service-এ থাকবে? অনেক beginner backend ঠিক এই জায়গায় confusing হয়ে যায়।",
      "middleware tempting লাগে কারণ এটি request-এর শুরুতেই run করে এবং সব request দেখতে পায়। service tempting লাগে কারণ controller যা করতে চায় না, সবকিছু সেখানে ফেলে দিতে ইচ্ছে করে। carelessভাবে দুটো ব্যবহার করলে backend maze হয়ে যায়।",
      "একটি healthier rule হলো: middleware shared request-level concern যেমন authentication, validation context, throttling, বা request enrichment protect করবে। service layer business rule, workflow decision, আর reusable domain behavior own করবে।",
      "এই boundary clear হলে controller ছোট হয়, review সহজ হয়, আর product logic test করা সহজ হয়।",
    ],
    learnEn: ["The difference between request checks and domain business rules", "Why controllers should delegate instead of becoming giant logic files", "How service layers improve testability and reuse", "How to decide whether a new rule belongs in middleware or service"],
    learnBn: ["request check আর domain business rule-এর পার্থক্য", "কেন controller giant logic file হওয়া উচিত না", "service layer কীভাবে testability আর reuse improve করে", "নতুন rule middleware নাকি service-এ যাবে তা কীভাবে decide করবেন"],
    whatEn: [
      "Middleware sits in the request path and performs checks or enrichment that multiple routes may need. Examples include authentication, role extraction, tenant detection, and request logging.",
      "A service layer sits closer to the business domain. It decides things like whether a manager may approve a submission, whether a task status may change, or how review feedback should update the queue.",
      "The boundary matters because request-level concerns and business-level concerns change for different reasons. Mixing them creates fragile code.",
    ],
    whatBn: [
      "middleware request path-এর মধ্যে বসে এবং এমন check বা enrichment চালায় যা একাধিক route-এর দরকার হতে পারে। যেমন authentication, role extraction, tenant detection, আর request logging।",
      "service layer business domain-এর কাছাকাছি থাকে। এটি decide করে manager submission approve করতে পারবে কি না, task status বদলানো যাবে কি না, বা review feedback queue-কে কীভাবে update করবে।",
      "এই boundary গুরুত্বপূর্ণ, কারণ request-level concern আর business-level concern ভিন্ন কারণে বদলায়। এগুলো মিশে গেলে fragile code তৈরি হয়।",
    ],
    whyEn: [
      "In a cooperative platform, permission and workflow logic will keep growing. If every controller and middleware duplicates decision logic, the system drifts and users see inconsistent behavior.",
      "Service layers give one reviewable home to domain decisions. Middleware gives one reusable gate for request checks. Together they make the backend more readable and governable.",
      "This also helps peer learning. New members can ask, 'Is this a shared request concern or a business rule?' That question alone prevents many design mistakes.",
    ],
    whyBn: [
      "একটি cooperative platform-এ permission আর workflow logic সময়ের সাথে বাড়তেই থাকবে। যদি প্রতিটি controller আর middleware decision logic duplicate করে, system drift করবে আর user inconsistent behavior দেখবে।",
      "service layer domain decision-এর জন্য এক reviewable home দেয়। middleware shared request check-এর জন্য reusable gate দেয়। একসাথে এগুলো backend-কে বেশি readable আর governable করে।",
      "এটি peer learning-এও সাহায্য করে। নতুন member জিজ্ঞেস করতে পারে, 'এটি shared request concern, নাকি business rule?' শুধু এই প্রশ্নই অনেক design mistake ঠেকায়।",
    ],
    thinkEn: ["Think of middleware like the security and registration desk at the entrance of a building.", "Think of services like the internal office team that decides how work should be done after the person is already allowed inside."],
    thinkBn: ["middleware-কে building-এর entrance security আর registration desk ভাবুন।", "service-কে building-এর ভেতরের office team ভাবুন, যারা ভেতরে ঢোকার পরে কাজ কীভাবে হবে তা decide করে।"],
    stepsEn: ["Ask whether the rule is about the request itself or about the product domain", "Put shared request concerns such as auth checks into middleware", "Keep controllers focused on receiving input and returning output", "Move workflow decisions such as approval rules into services", "Make services reusable across multiple controllers", "Write tests around service behavior", "Review middleware to ensure it is not quietly owning business decisions"],
    stepsBn: ["প্রথমে দেখুন rule request নিজেকে নিয়ে, নাকি product domain-কে নিয়ে", "auth check-এর মতো shared request concern middleware-এ রাখুন", "controller-কে input নেওয়া আর output ফেরত দেওয়ার কাজেই focused রাখুন", "approval rule-এর মতো workflow decision service-এ নিন", "একই business rule লাগলে service reusable রাখুন", "service behavior-এর ওপর test লিখুন", "middleware regular review করুন, যাতে এটি quietly business decision own না করে"],
    conceptsEn: ["Cross-cutting concern", "Middleware", "Service layer", "Thin controller", "Workflow decision", "Testable boundary"],
    conceptsBn: ["Cross-cutting concern", "Middleware", "Service layer", "Thin controller", "Workflow decision", "Testable boundary"],
    whenEn: ["When controller methods are getting too large", "When the same permission or status logic repeats", "When reviewers cannot quickly tell where a business rule lives", "When you want safer tests around important workflows"],
    whenBn: ["যখন controller method বড় হয়ে যাচ্ছে", "যখন একই permission বা status logic repeat হচ্ছে", "যখন reviewer বুঝতে পারছে না business rule কোথায় আছে", "যখন গুরুত্বপূর্ণ workflow-এর জন্য safer test দরকার"],
    exampleEn: [
      "Suppose a manager clicks Approve on a submission. Middleware may check that the requester is authenticated and belongs to a management scope. The controller receives submissionId and calls a review service. The review service decides whether the submission is approvable, writes the approval, updates the queue, and logs the audit event. That logic belongs in the service because it is domain behavior, not just request plumbing.",
    ],
    exampleBn: [
      "ধরুন manager একটি submission-এ Approve click করল। middleware check করতে পারে requester authenticated কি না এবং management scope-এ আছে কি না। controller submissionId নিয়ে review service call করবে। review service decide করবে submission approvable কি না, approval write করবে, queue update করবে, আর audit event log করবে। এই logic service-এ থাকবে, কারণ এটি domain behavior, শুধু request plumbing না।",
    ],
    mistakesEn: ["Putting approval or revision business rules inside middleware", "Letting controllers perform validation, authorization, workflow, and persistence all at once", "Creating services that are only renamed controllers", "Hiding important permission decisions inside tiny helpers nobody reviews"],
    mistakesBn: ["approval বা revision business rule middleware-এ ঢুকিয়ে দেওয়া", "controller-কে validation, authorization, workflow, আর persistence - সবকিছু করানো", "এমন service বানানো যা শুধু renamed controller", "গুরুত্বপূর্ণ permission decision ছোট helper-এ লুকিয়ে ফেলা"],
    applyEn: ["Ask, 'Would many routes need this request check?' If yes, middleware may fit", "Ask, 'Is this deciding product behavior?' If yes, service is usually better", "Keep controller code readable in one quick pass", "Review service methods as the source of truth for workflow rules"],
    applyBn: ["জিজ্ঞেস করুন, 'অনেক route কি এই request check চাইবে?' যদি হ্যাঁ, middleware fit করতে পারে", "জিজ্ঞেস করুন, 'এটি কি product behavior decide করছে?' যদি হ্যাঁ, service better", "controller code একবার দ্রুত পড়েই বোঝা যায় এমন রাখুন", "workflow rule-এর source of truth হিসেবে service method review করুন"],
    assignmentEn: ["Take one LMS flow such as approve submission, publish task, or update public profile", "Split the logic into middleware, controller, and service columns", "Write one sentence for each item explaining why that responsibility belongs there", "Submit the table plus one paragraph describing how you would test the service behavior"],
    assignmentBn: ["approve submission, publish task, বা update public profile-এর মতো একটি flow নিন", "logic-কে middleware, controller, আর service column-এ ভাগ করুন", "প্রতিটি item-এর জন্য লিখুন কেন responsibility ওই layer-এ যাবে", "table-এর সাথে লিখুন service behavior কীভাবে test করবেন"],
    quickCheckEn: ["Should a manager approval rule live in middleware or service, and why?", "What job should a controller still keep in clean architecture?", "How does a service layer reduce duplicated business logic?"],
    quickCheckBn: ["manager approval rule middleware-এ থাকবে নাকি service-এ, এবং কেন?", "clean architecture-এও controller-এর কোন কাজ থাকা উচিত?", "service layer duplicated business logic কমায় কীভাবে?"],
    summaryEn: ["Middleware protects shared request concerns", "Services own business rules and workflow decisions", "Thin controllers make backend flows easier to review and test", "This boundary reduces drift as the platform grows"],
    summaryBn: ["middleware shared request concern protect করে", "service business rule আর workflow decision own করে", "thin controller backend flow review আর test সহজ করে", "platform বড় হলে এই boundary drift কমায়"],
    sandpack: makeSandpack(`import React, { useState } from "react";
const items=[
{name:"Middleware",detail:"Auth check, scope extraction, request validation context",color:"#dbeafe"},
{name:"Controller",detail:"Reads input, calls service, returns HTTP response",color:"#dcfce7"},
{name:"Service",detail:"Approves submission, updates status, writes audit log",color:"#ede9fe"},
];
export default function App(){const [selected,setSelected]=useState(items[0]);return <div style={{fontFamily:"sans-serif",padding:20,maxWidth:620}}><h2>Layer Boundary Board</h2><p>Pick a layer and decide which responsibilities belong there.</p><div style={{display:"grid",gap:10,marginTop:16}}>{items.map((item)=><button key={item.name} onClick={()=>setSelected(item)} style={{borderRadius:14,border:selected.name===item.name?"2px solid #2563eb":"1px solid #cbd5e1",background:item.color,padding:14,textAlign:"left",cursor:"pointer"}}><strong>{item.name}</strong><div style={{marginTop:6}}>{item.detail}</div></button>)}</div><div style={{marginTop:16,borderRadius:14,background:"#0f172a",color:"#fff",padding:16}}><strong>Selected layer:</strong><p>{selected.name}</p><p style={{marginBottom:0}}>{selected.detail}</p></div></div>;}`),
    resources: serviceResources,
  }),
};
