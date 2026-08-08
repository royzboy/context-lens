import * as vscode from 'vscode';
import { observeWorkspace } from '../workspace/workspaceObserver';

export class ContextPanelProvider
	implements vscode.WebviewViewProvider {

	public static readonly viewType = 'contextLens.panel';

	public resolveWebviewView(
		webviewView: vscode.WebviewView
	): void {
		webviewView.webview.options = {
			enableScripts: false
		};

		webviewView.webview.html = this.getHtml();
	}

	private getHtml(): string {
		const state = observeWorkspace();

		const activeFile = state.activeFile
			? state.activeFile.split('/').pop()
			: 'None';

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<style>
					body {
						padding: 12px;
						font-family: var(--vscode-font-family);
						color: var(--vscode-foreground);
					}

					h2 {
						font-size: 14px;
						margin-top: 0;
					}

					.section {
						margin-top: 20px;
					}

					.label {
						color: var(--vscode-descriptionForeground);
						font-size: 11px;
						text-transform: uppercase;
					}

					.value {
						margin-top: 4px;
					}

					.status {
						margin-top: 6px;
					}

					.known {
						color: var(--vscode-testing-iconPassed);
					}

					.unknown {
						color: var(--vscode-descriptionForeground);
					}
				</style>
			</head>

			<body>
				<h2>CONTEXT LENS</h2>

				<div class="section">
					<div class="label">Workspace</div>
					<div class="value">${state.workspaceName}</div>
				</div>

				<div class="section">
					<div class="label">Current File</div>
					<div class="value">${activeFile}</div>
				</div>

				<div class="section">
					<div class="label">Observable Context</div>

					<div class="status known">
						✓ Workspace
					</div>

					<div class="status known">
						✓ Active editor
					</div>

					<div class="status unknown">
						? AI conversation
					</div>

					<div class="status unknown">
						? AI prompt
					</div>

					<div class="status unknown">
						? System instructions
					</div>

					<div class="status unknown">
						? Token count
					</div>
				</div>

				<div class="section">
					<div class="label">Project State</div>
					<div class="value">
						No project state yet.
					</div>
				</div>
			</body>
			</html>
		`;
	}
}