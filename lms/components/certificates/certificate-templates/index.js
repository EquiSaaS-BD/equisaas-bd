import { forwardRef } from "react";
import { StandardEquisaasTemplate } from "./standard-equisaas";
import { GlcSpokenEnglishTemplate } from "./glc-spoken-english";

export const CertificateTemplateRouter = forwardRef(function CertificateTemplateRouter(
  props,
  ref,
) {
  const { certificate } = props;
  
  if (!certificate) return null;

  // Render specific templates based on themeStyle
  switch (certificate.themeStyle) {
    case "glc-spoken-english":
      return <GlcSpokenEnglishTemplate ref={ref} {...props} />;
    
    // Future templates can be added here
    // case "equisaas-internship":
    //   return <InternshipTemplate ref={ref} {...props} />;
      
    case "standard":
    default:
      return <StandardEquisaasTemplate ref={ref} {...props} />;
  }
});
