import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";
import generateModule from "@babel/generator";

const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

const appPath = "D:/projects/EquiSaaS BD/lms/src/App.jsx";
const src = fs.readFileSync(appPath, "utf8");
const ast = parse(src, { sourceType: "module", plugins: ["jsx"] });

const lucideIcons = new Set();
traverse(ast, {
  ImportDeclaration(p) {
    if (p.node.source.value === "lucide-react") {
      for (const spec of p.node.specifiers) {
        if (t.isImportSpecifier(spec)) {
          lucideIcons.add(spec.imported.name);
        }
      }
    }
  }
});

const views = {
  courses: { comp: "CoursesView", file: "CoursesView.jsx" },
  coop: { comp: "CoopHubView", file: "CoopHubView.jsx" },
  admin: { comp: "AdminView", file: "AdminView.jsx" }
};

const viewData = {};
const ctxNames = new Set();

traverse(ast, {
  LogicalExpression(path) {
    if (path.node.operator !== "&&") return;
    const left = path.node.left;
    if (!t.isBinaryExpression(left, { operator: "===" })) return;
    if (!t.isIdentifier(left.left, { name: "view" })) return;
    if (!t.isStringLiteral(left.right)) return;
    const viewKey = left.right.value;
    const info = views[viewKey];
    if (!info) return;

    const rightPath = path.get("right");
    const names = new Set();
    const icons = new Set();

    rightPath.traverse({
      Identifier(p) {
        if (!p.isReferencedIdentifier()) return;
        const name = p.node.name;
        const binding = p.scope.getBinding(name);
        if (!binding) return;
        names.add(name);
        if (lucideIcons.has(name)) icons.add(name);
      }
    });

    icons.forEach(name => names.delete(name));
    names.forEach(name => ctxNames.add(name));

    const jsxCode = generate(rightPath.node, { compact: false }).code;
    viewData[viewKey] = {
      jsxCode,
      names: Array.from(names).sort(),
      icons: Array.from(icons).sort(),
      info
    };

    const viewEl = t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier(info.comp), [], true),
      null,
      [],
      true
    );

    const fallbackDiv = t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier("div"),
        [t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral("card rounded-3xl p-6 text-sm text-slate-600"))],
        false
      ),
      t.jsxClosingElement(t.jsxIdentifier("div")),
      [t.jsxText("Loading...")],
      false
    );

    const suspenseEl = t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier("Suspense"),
        [t.jsxAttribute(t.jsxIdentifier("fallback"), t.jsxExpressionContainer(fallbackDiv))],
        false
      ),
      t.jsxClosingElement(t.jsxIdentifier("Suspense")),
      [viewEl],
      false
    );

    rightPath.replaceWith(suspenseEl);
  }
});

if (!Object.keys(viewData).length) {
  console.error("No view sections found to split.");
  process.exit(1);
}

// Update React import to include Suspense and lazy
traverse(ast, {
  ImportDeclaration(path) {
    if (path.node.source.value !== "react") return;
    const specifiers = path.node.specifiers;
    const named = new Set(specifiers.filter(s => t.isImportSpecifier(s)).map(s => s.imported.name));
    if (!named.has("Suspense")) {
      specifiers.push(t.importSpecifier(t.identifier("Suspense"), t.identifier("Suspense")));
    }
    if (!named.has("lazy")) {
      specifiers.push(t.importSpecifier(t.identifier("lazy"), t.identifier("lazy")));
    }
  }
});

// Insert LmsContext import after react import
const programBody = ast.program.body;
let lastImportIndex = -1;
let reactImportIndex = -1;
programBody.forEach((node, idx) => {
  if (t.isImportDeclaration(node)) {
    lastImportIndex = idx;
    if (node.source.value === "react") reactImportIndex = idx;
  }
});

const lmsContextImport = t.importDeclaration(
  [t.importSpecifier(t.identifier("LmsContext"), t.identifier("LmsContext"))],
  t.stringLiteral("./lms-context")
);
programBody.splice(reactImportIndex + 1, 0, lmsContextImport);

// Add lazy view imports (const declarations) after imports
const viewDecls = Object.values(views).map(info =>
  t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(info.comp),
      t.callExpression(t.identifier("lazy"), [
        t.arrowFunctionExpression([], t.callExpression(t.import(), [t.stringLiteral(`./views/${info.file}`)]))
      ])
    )
  ])
);
programBody.splice(lastImportIndex + 2, 0, ...viewDecls);

// Find App component and inject ctx + provider
let appFnPath = null;
traverse(ast, {
  VariableDeclarator(path) {
    if (t.isIdentifier(path.node.id, { name: "App" }) && t.isArrowFunctionExpression(path.node.init)) {
      appFnPath = path.get("init");
    }
  }
});

if (!appFnPath) {
  console.error("App component not found.");
  process.exit(1);
}

const ctxList = Array.from(ctxNames).filter(name => !["React", "LmsContext", "Suspense", "lazy"].includes(name));
ctxList.sort();

const ctxDecl = t.variableDeclaration("const", [
  t.variableDeclarator(
    t.identifier("ctx"),
    t.objectExpression(ctxList.map(name => t.objectProperty(t.identifier(name), t.identifier(name), false, true)))
  )
]);

const bodyPath = appFnPath.get("body");
if (!bodyPath.isBlockStatement()) {
  console.error("App body is not a block statement.");
  process.exit(1);
}

const bodyStatements = bodyPath.get("body");
const returnIdx = bodyStatements.findIndex(stmt => stmt.isReturnStatement());
if (returnIdx === -1) {
  console.error("Return statement not found in App.");
  process.exit(1);
}

bodyPath.node.body.splice(returnIdx, 0, ctxDecl);

const returnPath = bodyStatements[returnIdx];
const originalArg = returnPath.node.argument;
if (!originalArg) {
  console.error("Return statement has no argument.");
  process.exit(1);
}

const providerEl = t.jsxElement(
  t.jsxOpeningElement(
    t.jsxMemberExpression(t.jsxIdentifier("LmsContext"), t.jsxIdentifier("Provider")),
    [t.jsxAttribute(t.jsxIdentifier("value"), t.jsxExpressionContainer(t.identifier("ctx")))],
    false
  ),
  t.jsxClosingElement(t.jsxMemberExpression(t.jsxIdentifier("LmsContext"), t.jsxIdentifier("Provider"))),
  [originalArg],
  false
);

returnPath.node.argument = providerEl;

// Write updated App.jsx
const output = generate(ast, { comments: true, compact: false }).code;
fs.writeFileSync(appPath, output + "\n", "utf8");

// Write view files
const viewsDir = "D:/projects/EquiSaaS BD/lms/src/views";
fs.mkdirSync(viewsDir, { recursive: true });

for (const [key, data] of Object.entries(viewData)) {
  const { jsxCode, names, icons, info } = data;
  const iconsImport = icons.length ? `import { ${icons.join(", ")} } from \"lucide-react\";\n` : "";
  const destructure = names.length ? `const { ${names.join(", ")} } = useLms();\n` : "const {} = useLms();\n";
  const content = `import React from \"react\";\nimport { useLms } from \"../lms-context\";\n${iconsImport}\nconst ${info.comp} = () => {\n  ${destructure}  return ${jsxCode};\n};\n\nexport default ${info.comp};\n`;
  fs.writeFileSync(path.join(viewsDir, info.file), content, "utf8");
}

console.log("Split views complete:", Object.keys(viewData));