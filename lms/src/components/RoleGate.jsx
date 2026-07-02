import React from 'react';
import { useLms } from '../lms-context';

/**
 * RoleGate ensures that children are only rendered if the user has an allowed role.
 * @param {Array<string>} allowedRoles - List of allowed roles (e.g. ['admin', 'squad_lead'])
 * @param {ReactNode} fallback - Fallback UI (optional)
 */
const RoleGate = ({ allowedRoles, children, fallback = null }) => {
  const { userRole, isAdmin } = useLms();

  if (isAdmin) return <>{children}</>;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback;
  }

  return <>{children}</>;
};

export default RoleGate;
