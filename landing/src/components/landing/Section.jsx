import React from "react";

export default function Section({ id, className, children }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}


