import * as path from "path";
import * as vscode from "vscode";

const OPEN_ROUTE_FILE = "routeAnnotator.openRouteFile";
vscode.commands.registerCommand(OPEN_ROUTE_FILE, async (path) => {
  // const document = await vscode.workspace.openTextDocument(path);
  // await vscode.window.showTextDocument(document);

  const uri = vscode.Uri.file(path);
  try {
    await vscode.workspace.fs.stat(uri);
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
  } catch (error) {
    await vscode.workspace.fs.writeFile(uri, new Uint8Array());
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
  }
});
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "typescript", scheme: "file", pattern: "**/routes.ts" },
      {
        provideCodeLenses: (document) => {
          const targetFile = "routes.ts";
          if (!document.fileName.endsWith(path.join("app", targetFile))) return [];
          const links: any = [];
          // const regex = /["'`](\.\/routes\/[^"'`]+\.(tsx))["'`]/g;
          const regex = /["'`]((\.\/)?routes\/[^"'`]+\.(tsx))["'`]/g;
          let match;
          const text = document.getText();
          while ((match = regex.exec(text)) !== null) {
            const matchText = match[1];
            const start = document.positionAt(match.index + 1);
            const baseDir = path.dirname(document.fileName);
            const linkTargetPath = path.resolve(baseDir, matchText);
            links.push(
              new vscode.CodeLens(new vscode.Range(start.line, 0, start.line, 0), {
                title: `-> ${matchText}`,
                command: OPEN_ROUTE_FILE,
                arguments: [linkTargetPath],
                tooltip: `Open file ${matchText}`,
              }),
            );
          }
          return links;
        },
      },
    ),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
