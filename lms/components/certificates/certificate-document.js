"use client";

import { CertificateTemplateRouter } from "./certificate-templates";

// We keep this export name identical so that anywhere importing `CertificateDocument` 
// continues to work without needing to update hundreds of imports across the codebase.
export const CertificateDocument = CertificateTemplateRouter;
