import * as vscode from 'vscode';
import * as micromatch from 'micromatch';

/**
 * Checks if a file should be excluded based on the configured patterns
 */
function shouldExcludeFile(filePath: string): boolean {
    const config = vscode.workspace.getConfiguration('unpinAllEditors');
    const excludePatterns = config.get<string[]>('excludePatterns', []);

    if (excludePatterns.length === 0) {
        return false;
    }

    // Convert file path to forward slashes for consistent matching
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Get the filename for basename matching
    const path = require('path');
    const filename = path.basename(normalizedPath);

    // Check if the full path matches any pattern
    if (micromatch.isMatch(normalizedPath, excludePatterns)) {
        return true;
    }

    // Check if the filename matches any pattern (for patterns like *.md, *.json, etc.)
    if (micromatch.isMatch(filename, excludePatterns)) {
        return true;
    }

    return false;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.unpinAllEditors', async () => {
        // Get all tab groups
        const tabGroups = vscode.window.tabGroups.all;
        let unpinnedCount = 0;

        // Collect all pinned tabs first
        const pinnedTabs: { tab: vscode.Tab; group: vscode.TabGroup }[] = [];
        const excludedTabs: { tab: vscode.Tab; group: vscode.TabGroup }[] = [];

        for (const tabGroup of tabGroups) {
            for (const tab of tabGroup.tabs) {
                if (tab.isPinned) {
                    // Check if this tab should be excluded
                    if (tab.input && typeof tab.input === 'object') {
                        const input = tab.input as any;
                        if (input.uri && input.uri.fsPath) {
                            if (shouldExcludeFile(input.uri.fsPath)) {
                                excludedTabs.push({ tab, group: tabGroup });
                                continue;
                            }
                        }
                    }
                    pinnedTabs.push({ tab, group: tabGroup });
                }
            }
        }

        if (pinnedTabs.length === 0) {
            if (excludedTabs.length > 0) {
                vscode.window.showInformationMessage(`✨ No pinned editors found to unpin. ${excludedTabs.length} pinned editor${excludedTabs.length !== 1 ? 's' : ''} excluded by patterns.`);
            } else {
                vscode.window.showInformationMessage('✨ No pinned editors found. All tabs are already unpinned!');
            }
            return;
        }

        // Show progress notification
        const progressOptions = {
            location: vscode.ProgressLocation.Notification,
            title: `Unpinning ${pinnedTabs.length} editor${pinnedTabs.length !== 1 ? 's' : ''}...`,
            cancellable: false
        };

        await vscode.window.withProgress(progressOptions, async (progress) => {
            // Now unpin each tab
            for (let i = 0; i < pinnedTabs.length; i++) {
                const { tab, group } = pinnedTabs[i];

                try {
                    progress.report({
                        message: `Processing: ${tab.label}`,
                        increment: (100 / pinnedTabs.length)
                    });

                    // Try to open the tab by its input
                    if (tab.input && typeof tab.input === 'object') {
                        const input = tab.input as any;

                        if (input.uri) {
                            // Text document
                            await vscode.window.showTextDocument(input.uri, {
                                viewColumn: group.viewColumn,
                                preview: false
                            });
                        } else if (input.original && input.modified) {
                            // Diff view
                            await vscode.commands.executeCommand('vscode.diff', input.original, input.modified, undefined, {
                                viewColumn: group.viewColumn,
                                preview: false
                            });
                        } else if (input.notebookType) {
                            // Notebook
                            await vscode.commands.executeCommand('vscode.openWith', input.uri, input.notebookType, {
                                viewColumn: group.viewColumn,
                                preview: false
                            });
                        } else {
                            continue;
                        }

                        // Small delay to ensure the tab is properly opened
                        await new Promise(resolve => setTimeout(resolve, 100));

                        // Unpin the currently active tab
                        await vscode.commands.executeCommand('workbench.action.unpinEditor');

                        // Close the tab
                        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

                        unpinnedCount++;

                        // Small delay before processing next tab
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                } catch (e) {
                    // Continue with next tab even if one fails
                }
            }
        });

        // Don't restore any editor - let the user decide what to open
        // All pinned editors will be closed, giving a clean workspace

        if (unpinnedCount > 0) {
            let message = `✅ Successfully unpinned and closed ${unpinnedCount} editor${unpinnedCount !== 1 ? 's' : ''}!`;
            if (excludedTabs.length > 0) {
                message += ` (${excludedTabs.length} excluded by patterns)`;
            }
            vscode.window.showInformationMessage(message);
        } else {
            vscode.window.showInformationMessage('❌ No editors were unpinned. Please try again.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
