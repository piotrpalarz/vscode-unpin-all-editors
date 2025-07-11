# Unpin All Editors

A VSCode extension that provides the missing "Unpin All Editors" feature. While VS Code has an "Unpin Editor" command, it lacks the ability to unpin all pinned editors at once.

## Features

- **Unpin All Editors**: Quickly unpin all pinned editors in your workspace
- **Exclude Patterns**: Configure patterns to exclude specific files from being unpinned

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Unpin All Editors" and select the command
3. All pinned editors will be unpinned and closed

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

- VSCode 1.102.0 or higher

## Release Notes

### 0.0.1

Initial release of Unpin All Editors extension.

## License

This extension is released under the MIT License.
