import {
    ContextHealth,
    ContextFinding,
    ContextSnapshot
} from './types';
import { aggregateFindingStatus } from './statusAggregation';

export function evaluateContextHealth(
    snapshot: ContextSnapshot
): ContextHealth {
    const findings: ContextFinding[] = [];

    const hasWorkspace = snapshot.facts.some(fact => fact.id === 'workspace');
    const hasProjectState =
        snapshot.projectState !== undefined &&
        snapshot.projectState.openFiles.length > 0;
    const hasObservedFacts = snapshot.facts.length > 0;

    const dirtyFact = snapshot.facts.find(
        fact => fact.id === 'document-dirty'
    );

    const hasUnsavedChanges = dirtyFact?.value === 'Yes';

    const activeFile = snapshot.facts.find(
        fact => fact.id === 'active-file'
    );

    const activeFilePath = activeFile?.value;

    const hasActiveFile =
        activeFilePath !== undefined &&
        activeFilePath !== 'None';

    const activeFileIsOpen =
        activeFilePath !== undefined &&
        activeFilePath !== 'None' &&
        snapshot.projectState !== undefined &&
        snapshot.projectState.openFiles.some(
            file => file.path === activeFilePath
        );
        
    const activeFileIsInWorkspace =
        hasActiveFile &&
        snapshot.workspacePath !== undefined &&
        snapshot.workspacePath !== '' &&
        activeFilePath.startsWith(snapshot.workspacePath);

    if (hasWorkspace && hasObservedFacts) {
        findings.push({
            id: 'workspace-state',
            label: 'Workspace State',
            status: 'healthy',
            reason: 'Workspace information is being observed successfully.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        findings.push({
            id: 'workspace-state',
            label: 'Workspace State',
            status: 'unknown',
            reason: 'Insufficient workspace information is available to evaluate context health.',
            source: 'Context Lens Workspace Observer'
        });
    }

    if (hasProjectState) {
        findings.push({
            id: 'project-state',
            label: 'Project State',
            status: 'healthy',
            reason: 'Open project files are being observed.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        findings.push({
            id: 'project-state',
            label: 'Project State',
            status: 'unknown',
            reason: 'No open project files are currently available to evaluate.',
            source: 'Context Lens Workspace Observer'
        });
    }

    if (hasUnsavedChanges) {
        findings.push({
            id: 'unsaved-changes',
            label: 'Unsaved Changes',
            status: 'warning',
            reason: 'The active document contains unsaved changes that may not be reflected in the saved project state.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        findings.push({
            id: 'unsaved-changes',
            label: 'Unsaved Changes',
            status: 'healthy',
            reason: 'The active document has no unsaved changes.',
            source: 'Context Lens Workspace Observer'
        });
    }

    if (activeFileIsOpen) {
        findings.push({
            id: 'active-file-coherence',
            label: 'Active File Coherence',
            status: 'healthy',
            reason: 'The active file is present in the observed project state.',
            source: 'Context Lens Workspace Observer'
        });
    } else if (!hasActiveFile) {
        findings.push({
            id: 'active-file-coherence',
            label: 'Active File Coherence',
            status: 'unknown',
            reason: 'No active file is currently available to compare with project state.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        findings.push({
            id: 'active-file-coherence',
            label: 'Active File Coherence',
            status: 'warning',
            reason: 'The active file is not present in the currently observed project state.',
            source: 'Context Lens Workspace Observer'
        });
    }

    if (activeFileIsInWorkspace) {
        findings.push({
            id: 'workspace-file-coherence',
            label: 'Workspace File Coherence',
            status: 'healthy',
            reason: 'The active file is located within the observed workspace.',
            source: 'Context Lens Workspace Observer'
        });
    } else if (!hasActiveFile) {
        findings.push({
            id: 'workspace-file-coherence',
            label: 'Workspace File Coherence',
            status: 'unknown',
            reason: 'No active file is currently available to compare with the workspace.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        findings.push({
            id: 'workspace-file-coherence',
            label: 'Workspace File Coherence',
            status: 'warning',
            reason: 'The active file is outside the currently observed workspace.',
            source: 'Context Lens Workspace Observer'
        });
    }

    const workspacePath = snapshot.workspacePath;

    const openFilesOutsideWorkspace =
        workspacePath !== undefined &&
        workspacePath.length > 0 &&
        snapshot.projectState !== undefined &&
        snapshot.projectState.openFiles.some(
            file => !file.path.startsWith(`${workspacePath}/`)
        );

    if (
        workspacePath === undefined ||
        workspacePath.length === 0
    ) {
        findings.push({
            id: 'open-file-coherence',
            label: 'Open File Coherence',
            status: 'unknown',
            reason: 'No workspace information is currently available to evaluate open file coherence.',
            source: 'Context Lens Workspace Observer'
        });
    } else if (openFilesOutsideWorkspace) {
        findings.push({
            id: 'open-file-coherence',
            label: 'Open File Coherence',
            status: 'warning',
            reason: 'One or more observed open files are outside the current workspace.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        findings.push({
            id: 'open-file-coherence',
            label: 'Open File Coherence',
            status: 'healthy',
            reason: 'All observed open files are located within the current workspace.',
            source: 'Context Lens Workspace Observer'
        });
    }

    return {
        overallStatus: aggregateFindingStatus(findings),
        findings
    };
}