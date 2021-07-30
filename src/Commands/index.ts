import { Substatus, getSettings } from '../Settings';
import { createOrEdit } from './CreateOrEdit';

import { toggleDone } from './ToggleDone';
import { updateSubstatus } from './UpdateSubstatus';
import type { App, Editor, Plugin, View } from 'obsidian';

export class Commands {
    private readonly plugin: Plugin;

    private get app(): App {
        return this.plugin.app;
    }

    constructor({ plugin }: { plugin: Plugin }) {
        this.plugin = plugin;

        plugin.addCommand({
            id: 'edit-task',
            name: 'Create or edit task',
            editorCheckCallback: (
                checking: boolean,
                editor: Editor,
                view: View,
            ) => {
                return createOrEdit(checking, editor, view, this.app);
            },
        });

        plugin.addCommand({
            id: 'toggle-done',
            name: 'Toggle task done',
            editorCheckCallback: toggleDone,
        });

        const substatuses = getSettings().substatuses;
        substatuses.forEach((substatus: Substatus, substatusIndex: number) => {
            plugin.addCommand({
                id:
                    substatus.name.replace(/\s+/g, '-') ||
                    `untitled-tasks-substatus-${substatusIndex}`,
                name:
                    substatus.name || `(Untitled Substatus ${substatusIndex})`,
                editorCheckCallback: (
                    checking: boolean,
                    editor: Editor,
                    view: View,
                ) => {
                    return updateSubstatus(checking, editor, view, substatus);
                },
            });
        });
    }
}
