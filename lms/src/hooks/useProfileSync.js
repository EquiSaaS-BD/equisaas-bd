import { useEffect, useMemo, useRef, useState } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { PATHS } from "../data/structure.mjs";
import { computeEarnedBadges, mergeEarnedBadges } from "../lib/badgeEngine";
import {
  EMPTY_PUBLIC_PROFILE_STATS,
  getPublicProfileDocRef,
  getPublicProfileStats,
} from "../lib/publicProfile";
import { buildDefaultUserDoc, buildPublicProfilePayload } from "../lib/governance";

const getPathsForSubdept = (subdeptId, roadmapsBySubdept) => {
  if (!subdeptId) return [];
  const overridePaths = roadmapsBySubdept?.[subdeptId]?.paths || [];
  return overridePaths.length ? overridePaths : PATHS.filter((path) => path.subdeptId === subdeptId);
};

export default function useProfileSync({
  db,
  isAdmin,
  roadmapsBySubdept,
  selectedDeptId,
  selectedPathId,
  selectedSubdeptId,
  setSelectedDeptId,
  setSelectedPathId,
  setSelectedSubdeptId,
  setShowTrackModal,
  setTrackDeptId,
  setTrackPathId,
  setTrackSubdeptId,
  showTrackModal,
  translations,
  mentorRequests,
  contributions,
  user,
}) {
  const [profile, setProfile] = useState(null);
  const [publicProfileStats, setPublicProfileStats] = useState(EMPTY_PUBLIC_PROFILE_STATS);
  const [userRole, setUserRole] = useState(null);
  const userDocSyncRef = useRef("");
  const publicProfileSyncRef = useRef("");
  const hasHydratedSelectionRef = useRef(false);

  useEffect(() => {
    if (!db || !user) {
      setProfile(null);
      setUserRole(null);
      hasHydratedSelectionRef.current = false;
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const data = snap.data() || null;
      setUserRole(data?.role || "member");
      setProfile(data);

      if (!hasHydratedSelectionRef.current && data?.departmentId && data?.subdepartmentId) {
        setSelectedDeptId(data.departmentId);
        setSelectedSubdeptId(data.subdepartmentId);
        if (data.pathId) setSelectedPathId(data.pathId);
        hasHydratedSelectionRef.current = true;
      }
    });

    return unsubscribe;
  }, [db, setSelectedDeptId, setSelectedPathId, setSelectedSubdeptId, user]);

  useEffect(() => {
    if (!db || !user) {
      userDocSyncRef.current = "";
      return;
    }

    const normalizedUser = buildDefaultUserDoc({
      authUser: user,
      current: profile || {},
      claimsAdmin: isAdmin,
    });
    const syncSignature = JSON.stringify({
      uid: normalizedUser.uid,
      displayName: normalizedUser.displayName,
      email: normalizedUser.email,
      avatarUrl: normalizedUser.avatarUrl,
      role: normalizedUser.role,
      roles: normalizedUser.roles,
      districtId: normalizedUser.districtId,
      departmentId: normalizedUser.departmentId,
      subdepartmentId: normalizedUser.subdepartmentId,
      pathId: normalizedUser.pathId,
      squadId: normalizedUser.squadId,
      coreTeam: normalizedUser.coreTeam,
      managementScopeIds: normalizedUser.managementScopeIds,
      scopeSummary: normalizedUser.scopeSummary,
      memberSinceReady: Boolean(profile?.memberSince || profile?.createdAt),
    });

    if (syncSignature === userDocSyncRef.current) return;
    userDocSyncRef.current = syncSignature;

    setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        displayName: normalizedUser.displayName,
        email: normalizedUser.email,
        avatarUrl: normalizedUser.avatarUrl,
        role: normalizedUser.role,
        roles: normalizedUser.roles,
        status: normalizedUser.status || "active",
        districtId: normalizedUser.districtId,
        departmentId: normalizedUser.departmentId,
        subdepartmentId: normalizedUser.subdepartmentId,
        pathId: normalizedUser.pathId,
        squadId: normalizedUser.squadId,
        coopPoints: Number(profile?.coopPoints || 0),
        trustScore: Number(profile?.trustScore || 0),
        badges: Array.isArray(normalizedUser.badges) ? normalizedUser.badges : [],
        coreTeam: normalizedUser.coreTeam,
        managementScopeIds: normalizedUser.managementScopeIds,
        scopeSummary: normalizedUser.scopeSummary,
        memberSince: profile?.memberSince || profile?.createdAt || serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        createdAt: profile?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch((error) => {
      console.error("User profile sync failed:", error);
      userDocSyncRef.current = "";
    });
  }, [
    db,
    isAdmin,
    profile,
    user,
  ]);

  useEffect(() => {
    if (!db || !user) {
      setPublicProfileStats(EMPTY_PUBLIC_PROFILE_STATS);
      return;
    }

    const unsubscribe = onSnapshot(getPublicProfileDocRef(db, user.uid), (snap) => {
      setPublicProfileStats(getPublicProfileStats(snap.data() || null));
    });

    return unsubscribe;
  }, [db, user]);

  const earnedBadgeIds = useMemo(() => {
    const computed = computeEarnedBadges({ user, profile, contributions, mentorRequests, translations });
    return mergeEarnedBadges(computed, [...(profile?.badges || []), ...(publicProfileStats.badges || [])]);
  }, [contributions, mentorRequests, profile, publicProfileStats.badges, translations, user]);

  const resolvedPath = useMemo(() => {
    const activeSubdeptId = profile?.subdepartmentId || selectedSubdeptId || "";
    const preferredPathId = profile?.pathId || selectedPathId || "";
    const paths = getPathsForSubdept(activeSubdeptId, roadmapsBySubdept);
    return paths.find((path) => path.id === preferredPathId) || PATHS.find((path) => path.id === preferredPathId) || paths[0] || null;
  }, [profile?.pathId, profile?.subdepartmentId, roadmapsBySubdept, selectedPathId, selectedSubdeptId]);

  const publicProfilePayload = useMemo(
    () =>
      buildPublicProfilePayload({
        user,
        profile,
        selectedPath: resolvedPath,
        earnedBadgeIds,
        publicStats: publicProfileStats,
      }),
    [earnedBadgeIds, profile, publicProfileStats, resolvedPath, user],
  );

  useEffect(() => {
    if (!db || !user || !publicProfilePayload) {
      publicProfileSyncRef.current = "";
      return;
    }

    const signature = JSON.stringify(publicProfilePayload);
    if (signature === publicProfileSyncRef.current) return;
    publicProfileSyncRef.current = signature;

    setDoc(
      getPublicProfileDocRef(db, user.uid),
      {
        ...publicProfilePayload,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch((error) => {
      console.error("Public profile identity sync failed:", error);
      publicProfileSyncRef.current = "";
    });
  }, [db, publicProfilePayload, user]);

  useEffect(() => {
    if (!user || isAdmin) {
      setShowTrackModal(false);
      return;
    }

    setShowTrackModal(!profile?.departmentId || !profile?.subdepartmentId);
  }, [isAdmin, profile, setShowTrackModal, user]);

  useEffect(() => {
    if (!showTrackModal) return;
    const deptId = profile?.departmentId || selectedDeptId || "";
    const subId = profile?.subdepartmentId || selectedSubdeptId || "";
    const firstPath = getPathsForSubdept(subId, roadmapsBySubdept)[0];
    const pathId = profile?.pathId || selectedPathId || firstPath?.id || "";

    setTrackDeptId(deptId);
    setTrackSubdeptId(subId);
    setTrackPathId(pathId);
  }, [
    profile,
    roadmapsBySubdept,
    selectedDeptId,
    selectedPathId,
    selectedSubdeptId,
    setTrackDeptId,
    setTrackPathId,
    setTrackSubdeptId,
    showTrackModal,
  ]);

  return {
    earnedBadgeIds,
    profile,
    publicProfileStats,
    setProfile,
    setPublicProfileStats,
    userRole,
  };
}
