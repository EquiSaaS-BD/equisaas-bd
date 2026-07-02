import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";
import generateModule from "@babel/generator";

const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

const appPath = "D:/projects/EquiSaaS BD/lms/src/App.jsx";
const appSrc = fs.readFileSync(appPath, "utf8");
const appAst = parse(appSrc, { sourceType: "module", plugins: ["jsx"] });

const lucideIcons = new Set();
let appFnPath = null;

traverse(appAst, {
  ImportDeclaration(p) {
    if (p.node.source.value === "lucide-react") {
      for (const spec of p.node.specifiers) {
        if (t.isImportSpecifier(spec)) {
          lucideIcons.add(spec.imported.name);
        }
      }
    }
  },
  VariableDeclarator(p) {
    if (t.isIdentifier(p.node.id, { name: "App" }) && t.isArrowFunctionExpression(p.node.init)) {
      appFnPath = p.get("init");
    }
  }
});

if (!appFnPath) {
  console.error("App component not found for ctx update.");
  process.exit(1);
}

const allowedBindings = new Set();
const programScope = appFnPath.scope.getProgramParent();
Object.keys(programScope.bindings).forEach(name => allowedBindings.add(name));
Object.keys(appFnPath.scope.bindings).forEach(name => allowedBindings.add(name));

const viewFiles = [
  "D:/projects/EquiSaaS BD/lms/src/views/CoursesView.jsx",
  "D:/projects/EquiSaaS BD/lms/src/views/CoopHubView.jsx",
  "D:/projects/EquiSaaS BD/lms/src/views/AdminView.jsx"
];

const requiredCtxNames = new Set();

for (const viewPath of viewFiles) {
  const src = fs.readFileSync(viewPath, "utf8");
  const ast = parse(src, { sourceType: "module", plugins: ["jsx"] });

  // Collect destructured names from useLms
  traverse(ast, {
    VariableDeclarator(p) {
      if (!t.isObjectPattern(p.node.id)) return;
      if (!t.isCallExpression(p.node.init)) return;
      if (!t.isIdentifier(p.node.init.callee, { name: "useLms" })) return;
      for (const prop of p.node.id.properties) {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.value)) {
          const name = prop.value.name;
          if (allowedBindings.has(name) && !lucideIcons.has(name)) {
            requiredCtxNames.add(name);
          }
        }
      }
    }
  });

  // Ensure lucide icons used in JSX are imported
  const usedIcons = new Set();
  traverse(ast, {
    JSXIdentifier(p) {
      const name = p.node.name;
      if (lucideIcons.has(name)) {
        usedIcons.add(name);
      }
    }
  });

  if (usedIcons.size) {
    let importDecl = null;
    for (const node of ast.program.body) {
      if (t.isImportDeclaration(node) && node.source.value === "lucide-react") {
        importDecl = node;
        break;
      }
    }

    if (!importDecl) {
      importDecl = t.importDeclaration(
        Array.from(usedIcons).sort().map(name => t.importSpecifier(t.identifier(name), t.identifier(name))),
        t.stringLiteral("lucide-react")
      );
      // insert after existing imports
      const firstNonImport = ast.program.body.findIndex(node => !t.isImportDeclaration(node));
      const insertIndex = firstNonImport === -1 ? ast.program.body.length : firstNonImport;
      ast.program.body.splice(insertIndex, 0, importDecl);
    } else {
      const existing = new Set(importDecl.specifiers.filter(s => t.isImportSpecifier(s)).map(s => s.imported.name));
      for (const name of usedIcons) {
        if (!existing.has(name)) {
          importDecl.specifiers.push(t.importSpecifier(t.identifier(name), t.identifier(name)));
        }
      }
    }
  }

  const updated = generate(ast, { comments: true, compact: false }).code;
  fs.writeFileSync(viewPath, updated + "\n", "utf8");
}

// Update ctx object in App
const ctxList = Array.from(requiredCtxNames).sort();

traverse(appAst, {
  VariableDeclarator(p) {
    if (!t.isIdentifier(p.node.id, { name: "ctx" })) return;
    if (!t.isObjectExpression(p.node.init)) return;
    p.node.init = t.objectExpression(ctxList.map(name => t.objectProperty(t.identifier(name), t.identifier(name), false, true)));
  }
});

const appOut = generate(appAst, { comments: true, compact: false }).code;
fs.writeFileSync(appPath, appOut + "\n", "utf8");

console.log("Context and view imports fixed.");