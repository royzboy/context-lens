import * as vscode from 'vscode';
import { observeWorkspace } from '../workspace/workspaceObserver';
import { ContextState } from '../context/types';

export class ContextPanelProvider
	implements vscode.WebviewViewProvider {

	public static readonly viewType = 'contextLens.panel';

	private view?: vscode.WebviewView;

	private state?: ContextState;

	public resolveWebviewView(
	webviewView: vscode.WebviewView
): void {
	this.view = webviewView;

	webviewView.webview.options = {
		enableScripts: false
	};

	this.state = observeWorkspace();
	webviewView.webview.html = this.getHtml();
}

	public updateState(state: ContextState): void {
	this.state = state;

	if (this.view) {
		this.view.webview.html = this.getHtml();
	}
}

	private getHtml(): string {
	const state = this.state ?? observeWorkspace();

		const activeFile = state.activeFile
			? state.activeFile.split('/').pop()
			: 'None';

		const languageFact = state.facts.find(
		(fact) => fact.id === 'document-language'
		);

		const dirtyFact = state.facts.find(
			(fact) => fact.id === 'document-dirty'
		);

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

					.healthy {
						color: var(--vscode-testing-iconPassed);
					}

					.warning {
						color: var(--vscode-editorWarning-foreground);
					}

					.problem {
						color: var(--vscode-editorError-foreground);
					}

					.health-reason {
						margin-left: 18px;
						margin-top: 2px;
						color: var(--vscode-descriptionForeground);
						font-size: 11px;
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

					<div class="status">
						Language: ${languageFact?.value ?? 'Unknown'}
					</div>

					<div class="status">
						Unsaved Changes: ${dirtyFact?.value ?? 'Unknown'}
					</div>
				</div>

				<div class="section">
					<div class="label">Open Files</div>
					<div class="value">
						${
							state.projectState.openFiles.length > 0
								? state.projectState.openFiles
									.map(file => file.split('/').pop())
									.join('<br>')
								: 'None'
						}
					</div>
				</div>

				<div class="section">
					<div class="label">Observable Context</div>

					<div class="status known">
						✓ Workspace
					</div>

					<div class="status known">
						✓ Active editor
					</div>

					<div class="status known">
						✓ Open editors
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
					<div class="label">Context Health</div>

					<div class="status">
						Overall:
						<span class="${state.health.overallStatus}">
							${state.health.overallStatus}
						</span>
					</div>

					${
						state.health.findings.length > 0
							? state.health.findings.map(finding => `
								<div class="status ${finding.status}">
									${finding.status === 'healthy' ? '✓' :
									finding.status === 'warning' ? '⚠' :
									finding.status === 'problem' ? '✕' : '?'}
									${finding.label}
								</div>

								<div class="health-reason">
									${finding.reason}
								</div>
							`).join('')
							: `
								<div class="status unknown">
									? No health findings available
								</div>
							`
					}
				</div>
			</body>
			</html>
		`;
	}
}