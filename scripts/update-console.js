const fs = require('fs');

let c = fs.readFileSync('lms/components/pages/management-console.js', 'utf8');

c = c.replace(
  /<TabsContent value="workshop-certificates" className=\{tabContentClassName\}>[\s\S]*?<\/TabsContent>\s*\) : null\}/m,
  (match) => match + '\n\n          {isSuperAdmin ? (\n            <TabsContent value="glc-certificates" className={tabContentClassName}>\n              <GlcCertificatePanel\n                activeDepartmentId={activeDepartmentId}\n                users={users}\n                actor={actor}\n                departmentTitle={getDepartmentTitle(activeDepartmentId)}\n                enabled={activeTab === "glc-certificates"}\n              />\n            </TabsContent>\n          ) : null}'
);

fs.writeFileSync('lms/components/pages/management-console.js', c);
console.log("management-console updated");
