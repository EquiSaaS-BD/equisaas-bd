import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityTracker() {
  useEffect(() => {
    const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (projectId) {
      Clarity.init(projectId);
    }
  }, []);

  return null;
}
