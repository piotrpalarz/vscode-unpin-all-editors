# Unpin All Editors

A VSCode/Cursor extension that provides the missing "Unpin All Editors" feature. While VS Code has an "Unpin Editor" command, it lacks the ability to unpin all pinned editors at once.

## Features

- **Unpin All Editors**: Quickly unpin all pinned editors in your workspace
- **Exclude Patterns**: Configure patterns to exclude specific files from being unpinned

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Unpin All Editors" and select the command
3. All pinned editors will be unpinned and closed

### Command ID

The extension provides the command `extension.unpinAllEditors` which you can bind to a keyboard shortcut in your `keybindings.json` file. By default, no keyboard shortcut is assigned.

### Keyboard Shortcut (Optional)

To add a keyboard shortcut, open Command Palette and run "Preferences: Open Keyboard Shortcuts (JSON)", then add:

```json
{
    "key": "ctrl+shift+u",
    "command": "extension.unpinAllEditors"
}
```

## Extension Settings

This extension contributes the following settings:

* `unpinAllEditors.excludePatterns`: Array of glob patterns to exclude files from being unpinned (e.g., `["*.md", "package.json"]`), I personally use `today.md` as my daily note and I want to keep it pinned.

## Example Configuration

```json
{
    "unpinAllEditors.excludePatterns": [
        "*.md",
        "package.json",
        "src/important-file.ts"
    ]
}
```

## Requirements

- VSCode 1.78.0 or higher (works with Cursor as well)

## License

This extension is released under the MIT License.
