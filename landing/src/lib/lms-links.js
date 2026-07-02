export function buildLmsTrackUrl(pathId = "", districtId = "") {
  const params = new URLSearchParams();
  if (pathId) {
    params.set("department", pathId);
    params.set("path", pathId);
  }
  if (districtId) params.set("district", districtId);
  const query = params.toString();
  return `/lms/login${query ? `?${query}` : ""}`;
}
