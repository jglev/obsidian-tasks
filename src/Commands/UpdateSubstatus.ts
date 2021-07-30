import { Editor, MarkdownView, View } from 'obsidian';

import { Substatus, SubstatusRule } from '../Settings';
import { toggleLine } from './ToggleDone';

export const updateSubstatus = (
    checking: boolean,
    editor: Editor,
    view: View,
    substatus: Substatus,
) => {
    if (checking) {
        if (!(view instanceof MarkdownView)) {
            // If we are not in a markdown view, the command shouldn't be shown.
            return false;
        }

        // The command should always trigger in a markdown view:
        // - Convert lines to list items.
        // - Convert list items to tasks.
        // - Toggle tasks' status.
        return true;
    }

    if (!(view instanceof MarkdownView)) {
        // Should never happen due to check above.
        return;
    }

    // We are certain we are in the editor due to the check above.
    const path = view.file?.path;
    if (path === undefined) {
        return;
    }

    const cursorPosition = editor.getCursor();
    const lineNumber = cursorPosition.line;
    const line = editor.getLine(lineNumber);
    let updatedLine = line;

    if (substatus.done) {
        updatedLine = toggleLine({ line, path });
    }

    substatus.rules.forEach((rule: SubstatusRule) => {
        updatedLine = updatedLine.replace(
            new RegExp(
                rule.from,
                `u${rule.caseInsensitive ? 'i' : ''}${rule.global ? 'g' : ''}`,
            ),
            rule.to,
        );
    });

    editor.setLine(lineNumber, updatedLine);

    // The cursor is moved to the end of the line by default.
    // If there is text on the line, put the cursor back where it was on the line.
    if (/[^ [\]*-]/.test(updatedLine)) {
        editor.setCursor({
            line: cursorPosition.line,
            // Need to move the cursor by the distance we added to the beginning.
            ch: cursorPosition.ch + updatedLine.length - line.length,
        });
    }
};
