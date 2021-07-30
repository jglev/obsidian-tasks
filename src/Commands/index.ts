import { createOrEdit } from './CreateOrEdit';

import { toggleDone } from './ToggleDone';
import { applySubstatus } from './ApplySubstatus';
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

        plugin.addCommand({
            id: 'applySubstatus',
            name: 'Apply substatus',
            editorCheckCallback: (
                checking: boolean,
                editor: Editor,
                view: View,
            ) => {
                return applySubstatus(checking, editor, view, this.app);
            },
        });

        // const substatuses = getSettings().substatuses;
        // substatuses.forEach((substatus: Substatus, substatusIndex: number) => {
        //     plugin.addCommand({
        //         id:
        //             substatus.name.replace(/\s+/g, '-') ||
        //             `untitled-tasks-substatus-${substatusIndex}`,
        //         name:
        //             substatus.name || `(Untitled Substatus ${substatusIndex})`,
        //         editorCheckCallback: (
        //             checking: boolean,
        //             editor: Editor,
        //             view: View,
        //         ) => {
        //             return applySubstatus(checking, editor, view, substatus);
        //         },
        //     });
        // });
    }
}
