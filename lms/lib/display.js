export function statusVariant(status) {
  switch (status) {
    case "approved":
    case "active":
    case "published":
    case "open":
      return "success";
    case "revision_requested":
    case "probation":
      return "warning";
    case "rejected":
    case "paused":
      return "danger";
    case "pending":
    default:
      return "subtle";
  }
}

export function statusLabel(status) {
  return String(status || "pending").replace(/_/g, " ");
}
