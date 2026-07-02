import {
  deleteDocument,
  listDocuments,
  patchDocument,
} from "./shared/firebase-cli-rest.mjs";

const BANGLADESH_UTC_OFFSET_MS = 6 * 60 * 60 * 1000;
const WEEK_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const timestampValue = (value) => ({ __type: "timestamp", value: new Date(value).toISOString() });

const normalizeDate = (value) => {
  const nextDate = value ? new Date(value) : new Date();
  return Number.isNaN(nextDate.getTime()) ? new Date() : nextDate;
};

const getBangladeshWeekWindow = (value) => {
  const safeDate = normalizeDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  const bangladeshDayIndex = bangladeshDate.getUTCDay();
  const mondayOffset = bangladeshDayIndex === 0 ? 6 : bangladeshDayIndex - 1;
  const weekStartBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth(),
    bangladeshDate.getUTCDate() - mondayOffset,
    0,
    0,
    0,
    0,
  ));
  const weekEndBangladesh = new Date(weekStartBangladesh.getTime() + WEEK_DURATION_MS);

  return {
    weekKey: [
      weekStartBangladesh.getUTCFullYear(),
      String(weekStartBangladesh.getUTCMonth() + 1).padStart(2, "0"),
      String(weekStartBangladesh.getUTCDate()).padStart(2, "0"),
    ].join(""),
    weekStartsAt: new Date(weekStartBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
    weekEndsAt: new Date(weekEndBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
  };
};

const getBangladeshMonthWindow = (value) => {
  const safeDate = normalizeDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  const monthStartBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth(),
    1,
    0,
    0,
    0,
    0,
  ));
  const monthEndBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  ));

  return {
    monthKey: [
      monthStartBangladesh.getUTCFullYear(),
      String(monthStartBangladesh.getUTCMonth() + 1).padStart(2, "0"),
    ].join(""),
    monthStartsAt: new Date(monthStartBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
    monthEndsAt: new Date(monthEndBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
  };
};

const getMemberName = (user) => String(user?.displayName || user?.fullName || user?.email || user?.id || "EquiSaaS member");

const ensureBoard = (registry, collectionName, periodKey, departmentId, leaderboardData = {}) => {
  if (!registry.has(collectionName)) {
    registry.set(collectionName, new Map());
  }

  const collectionRegistry = registry.get(collectionName);
  const boardKey = `${periodKey}:${departmentId}`;
  if (!collectionRegistry.has(boardKey)) {
    collectionRegistry.set(boardKey, {
      collectionName,
      periodKey,
      departmentId,
      leaderboardData,
      participants: new Map(),
      participantCount: 0,
      lastEntryId: "",
      lastAwardedAt: null,
    });
  }

  return collectionRegistry.get(boardKey);
};

const ensureParticipant = (board, user, scoreField) => {
  if (!board.participants.has(user.id)) {
    board.participants.set(user.id, {
      userId: user.id,
      departmentId: board.departmentId,
      displayName: getMemberName(user),
      photoURL: String(user.photoURL || ""),
      [scoreField]: 0,
      approvedCredits: 0,
      taskCredits: 0,
      attendanceCredits: 0,
      lastAwardedAt: null,
    });
  }

  return board.participants.get(user.id);
};

const applyLedgerToBoard = ({ board, user, scoreField, pointsDelta, isCredit, isTaskCredit, isAttendanceCredit, awardedAt, entryId }) => {
  const participant = ensureParticipant(board, user, scoreField);
  participant[scoreField] = Math.max(0, Number(participant[scoreField] || 0) + pointsDelta);
  participant.approvedCredits = Math.max(0, Number(participant.approvedCredits || 0) + (isCredit ? 1 : 0));
  participant.taskCredits = Math.max(0, Number(participant.taskCredits || 0) + (isTaskCredit ? 1 : 0));
  participant.attendanceCredits = Math.max(0, Number(participant.attendanceCredits || 0) + (isAttendanceCredit ? 1 : 0));

  const participantLastAwardedAt = normalizeDate(participant.lastAwardedAt);
  if (!participant.lastAwardedAt || awardedAt >= participantLastAwardedAt) {
    participant.lastAwardedAt = awardedAt.toISOString();
  }

  const boardLastAwardedAt = normalizeDate(board.lastAwardedAt);
  if (!board.lastAwardedAt || awardedAt >= boardLastAwardedAt) {
    board.lastAwardedAt = awardedAt.toISOString();
    board.lastEntryId = entryId;
  }
};

const purgeLeaderboardCollection = async (collectionName) => {
  const topLevelDocs = await listDocuments(collectionName).catch(() => []);

  for (const topDoc of topLevelDocs) {
    const departments = await listDocuments(`${collectionName}/${topDoc.id}/departments`).catch(() => []);

    for (const department of departments) {
      const participants = await listDocuments(`${collectionName}/${topDoc.id}/departments/${department.id}/participants`).catch(() => []);
      for (const participant of participants) {
        await deleteDocument(`${collectionName}/${topDoc.id}/departments/${department.id}/participants/${participant.id}`);
      }

      await deleteDocument(`${collectionName}/${topDoc.id}/departments/${department.id}`);
    }

    await deleteDocument(`${collectionName}/${topDoc.id}`);
  }
};

const writeBoard = async (board, scoreField) => {
  const sortedParticipants = [...board.participants.values()]
    .filter((participant) => Number(participant[scoreField] || 0) > 0 || Number(participant.approvedCredits || 0) > 0)
    .sort((left, right) => {
      const pointsDelta = Number(right[scoreField] || 0) - Number(left[scoreField] || 0);
      if (pointsDelta !== 0) return pointsDelta;
      return String(left.displayName || left.userId || "").localeCompare(String(right.displayName || right.userId || ""));
    });

  if (!sortedParticipants.length) {
    return;
  }

  const leaderboardPath = `${board.collectionName}/${board.periodKey}/departments/${board.departmentId}`;
  await patchDocument(leaderboardPath, {
    departmentId: board.departmentId,
    participantCount: sortedParticipants.length,
    lastEntryId: board.lastEntryId || "",
    updatedAt: timestampValue(new Date().toISOString()),
    ...board.leaderboardData,
  });

  for (const participant of sortedParticipants) {
    await patchDocument(`${leaderboardPath}/participants/${participant.userId}`, {
      userId: participant.userId,
      departmentId: participant.departmentId,
      displayName: participant.displayName,
      photoURL: participant.photoURL || "",
      [scoreField]: Number(participant[scoreField] || 0),
      approvedCredits: Number(participant.approvedCredits || 0),
      taskCredits: Number(participant.taskCredits || 0),
      attendanceCredits: Number(participant.attendanceCredits || 0),
      lastAwardedAt: participant.lastAwardedAt ? timestampValue(participant.lastAwardedAt) : null,
      updatedAt: timestampValue(new Date().toISOString()),
    });
  }
};

const main = async () => {
  const [users, ledgerEntries] = await Promise.all([
    listDocuments("users"),
    listDocuments("pointsLedger"),
  ]);
  const userMap = new Map(users.map((user) => [user.id, user]));
  const registry = new Map();

  for (const entry of ledgerEntries) {
    const departmentId = String(entry.departmentId || "").trim();
    const userId = String(entry.userId || "").trim();
    const user = userMap.get(userId);
    const direction = String(entry.direction || "").trim();
    const points = Math.max(0, Math.round(Number(entry.points || 0)));

    if (!departmentId || !userId || !user || ![\"credit\", \"debit\"].includes(direction) || points <= 0) {
      continue;
    }

    const awardedAt = normalizeDate(entry.createdAt);
    const pointsDelta = direction === \"debit\" ? -points : points;
    const isCredit = direction === \"credit\";
    const isTaskCredit = isCredit && String(entry.sourceType || \"\").trim() === \"task_submission\";
    const isAttendanceCredit = isCredit && String(entry.sourceType || \"\").trim() === \"attendance\";
    const weekWindow = getBangladeshWeekWindow(awardedAt);
    const monthWindow = getBangladeshMonthWindow(awardedAt);

    applyLedgerToBoard({
      board: ensureBoard(registry, \"departmentLeaderboards\", weekWindow.weekKey, departmentId, {
        weekKey: weekWindow.weekKey,
        weekStartsAt: timestampValue(weekWindow.weekStartsAt),
        weekEndsAt: timestampValue(weekWindow.weekEndsAt),
      }),
      user,
      scoreField: \"weeklyPoints\",\n+      pointsDelta,
      isCredit,
      isTaskCredit,
      isAttendanceCredit,
      awardedAt,
      entryId: entry.id,
    });

    applyLedgerToBoard({
      board: ensureBoard(registry, \"departmentMonthlyLeaderboards\", monthWindow.monthKey, departmentId, {
        monthKey: monthWindow.monthKey,
        monthStartsAt: timestampValue(monthWindow.monthStartsAt),
        monthEndsAt: timestampValue(monthWindow.monthEndsAt),
      }),
      user,
      scoreField: \"monthlyPoints\",\n+      pointsDelta,
      isCredit,
      isTaskCredit,
      isAttendanceCredit,
      awardedAt,
      entryId: entry.id,
    });

    applyLedgerToBoard({
      board: ensureBoard(registry, \"departmentOverallLeaderboards\", \"alltime\", departmentId, {
        boardKey: \"alltime\",
      }),
      user,
      scoreField: \"overallPoints\",\n+      pointsDelta,
      isCredit,
      isTaskCredit,
      isAttendanceCredit,
      awardedAt,
      entryId: entry.id,
    });
  }

  const scoreFields = {
    departmentLeaderboards: \"weeklyPoints\",
    departmentMonthlyLeaderboards: \"monthlyPoints\",
    departmentOverallLeaderboards: \"overallPoints\",
  };

  for (const collectionName of Object.keys(scoreFields)) {
    await purgeLeaderboardCollection(collectionName);
    const collectionBoards = registry.get(collectionName);
    if (!collectionBoards) continue;

    for (const board of collectionBoards.values()) {
      await writeBoard(board, scoreFields[collectionName]);
    }
  }

  console.log(`Rebuilt leaderboards from ${ledgerEntries.length} ledger entries for ${users.length} users.`);\n+};\n+\n+main().catch((error) => {\n+  console.error(error);\n+  process.exitCode = 1;\n+});\n*** End Patch
ეხtra End Patch
