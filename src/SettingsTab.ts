import cloneDeep from 'lodash.clonedeep';
import { PluginSettingTab, Setting } from 'obsidian';

import {
    Substatus,
    SubstatusRule,
    defaultSettings,
    getSettings,
    updateSettings,
} from './Settings';
import type TasksPlugin from './main';

export class SettingsTab extends PluginSettingTab {
    private readonly plugin: TasksPlugin;

    constructor({ plugin }: { plugin: TasksPlugin }) {
        super(plugin.app, plugin);

        this.plugin = plugin;
    }

    public display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Tasks Settings' });
        containerEl.createEl('p', {
            cls: 'tasks-setting-important',
            text: 'Changing any settings requires a restart of obsidian.',
        });

        new Setting(containerEl)
            .setName('Global task filter')
            .setDesc(
                'The global filter will be applied to all checklist items.',
            )
            .addText((text) => {
                const settings = getSettings();

                text.setPlaceholder('#task')
                    .setValue(settings.globalFilter)
                    .onChange(async (value) => {
                        updateSettings({ globalFilter: value });

                        await this.plugin.saveSettings();
                    });
            });
        containerEl.createEl('div', {
            cls: 'setting-item-description',
            text:
                'The global filter will be applied to all checklist items to filter out "non-task" checklist items.\n' +
                'A checklist item must include the specified string in its description in order to be considered a task.\n' +
                'For example, if you set the global filter to `#task`, the Tasks plugin will only handle checklist items tagged with `#task`.\n' +
                'Other checklist items will remain normal checklist items and not appear in queries or get a done date set.\n' +
                'Leave empty if you want all checklist items from your vault to be tasks managed by this plugin.',
        });

        new Setting(containerEl)
            .setName('Remove global filter from description')
            .setDesc(
                'Enabling this removes the string that you set as global filter from the task description when displaying a task.',
            )
            .addToggle((toggle) => {
                const settings = getSettings();

                toggle
                    .setValue(settings.removeGlobalFilter)
                    .onChange(async (value) => {
                        updateSettings({ removeGlobalFilter: value });

                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Wrap dates in backlink brackets')
            .setDesc(
                'Enabling this will wrap due dates and done dates in backlink brackets (e.g., "[[YYYY-MM-DD]]"). Toggling this setting will not affect existing items until this plugin next interacts with them.',
            )
            .addToggle((toggle) => {
                const settings = getSettings();

                toggle
                    .setValue(settings.makeDatesBacklinks)
                    .onChange(async (value) => {
                        updateSettings({ makeDatesBacklinks: value });

                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Due date marker')
            .setDesc('A marker that immediately precedes due dates.')
            .addText((text) => {
                const settings = getSettings();

                text.setPlaceholder(defaultSettings.dueDateMarker)
                    .setValue(
                        settings.dueDateMarker === defaultSettings.dueDateMarker
                            ? ''
                            : settings.dueDateMarker,
                    )
                    .onChange(async (value) => {
                        updateSettings({
                            dueDateMarker:
                                value !== ''
                                    ? value
                                    : defaultSettings.dueDateMarker,
                        });

                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Done date marker')
            .setDesc('A marker that immediately precedes done dates.')
            .addText((text) => {
                const settings = getSettings();

                text.setPlaceholder(defaultSettings.doneDateMarker)
                    .setValue(
                        settings.doneDateMarker ===
                            defaultSettings.doneDateMarker
                            ? ''
                            : settings.doneDateMarker,
                    )
                    .onChange(async (value) => {
                        updateSettings({
                            doneDateMarker:
                                value !== ''
                                    ? value
                                    : defaultSettings.doneDateMarker,
                        });

                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName('Recurrence marker')
            .setDesc('A marker that immediately precedes a recurrence date.')
            .addText((text) => {
                const settings = getSettings();

                text.setPlaceholder(defaultSettings.recurrenceMarker)
                    .setValue(
                        settings.recurrenceMarker ===
                            defaultSettings.recurrenceMarker
                            ? ''
                            : settings.recurrenceMarker,
                    )
                    .onChange(async (value) => {
                        updateSettings({
                            recurrenceMarker:
                                value !== ''
                                    ? value
                                    : defaultSettings.recurrenceMarker,
                        });

                        await this.plugin.saveSettings();
                    });
            });

        const substatusesEl = containerEl.createEl('div');
        substatusesEl.addClass('substatuses');
        const substatuses = getSettings().substatuses;
        substatuses.forEach((substatus: Substatus, substatusIndex: number) => {
            const substatusEl = substatusesEl.createEl('div');
            substatusEl.addClass('substatus');

            new Setting(substatusEl)
                .addText((text) => {
                    text.setPlaceholder('Substatus name')
                        .setValue(substatus.name)
                        .onChange(async (value) => {
                            const newSubstatuses = cloneDeep(
                                getSettings().substatuses,
                            );
                            newSubstatuses.splice(substatusIndex, 1, {
                                ...substatuses[substatusIndex],
                                name: value,
                            });
                            updateSettings({
                                substatuses: newSubstatuses,
                            });

                            await this.plugin.saveSettings();
                        });
                })
                .addToggle((toggle) => {
                    toggle
                        .setTooltip('Substatus represents a "Done" state.')
                        .setValue(substatus.done)
                        .onChange(async (value) => {
                            const newSubstatuses = cloneDeep(
                                getSettings().substatuses,
                            );
                            newSubstatuses[substatusIndex].done = value;
                            updateSettings({ substatuses: newSubstatuses });

                            await this.plugin.saveSettings();
                        });
                })
                .addExtraButton((button) => {
                    button
                        .setIcon('cross')
                        .setTooltip('Delete substatus')
                        .onClick(async () => {
                            const newSubstatuses = cloneDeep(
                                getSettings().substatuses,
                            );
                            newSubstatuses.splice(substatusIndex, 1);
                            updateSettings({
                                substatuses: newSubstatuses,
                            });

                            await this.plugin.saveSettings();
                            this.display();
                        });
                });

            const rulesEl = substatusEl.createEl('div');
            rulesEl.addClass('rules');

            substatus.rules.forEach((rule: SubstatusRule, ruleIndex) => {
                const ruleEl = rulesEl.createEl('div');
                substatusEl.addClass('rule');

                new Setting(ruleEl)
                    .addText((text) => {
                        text.setPlaceholder('From (Regex)')
                            .setValue(rule.from)
                            .onChange(async (value) => {
                                const newSubstatuses = cloneDeep(
                                    getSettings().substatuses,
                                );
                                newSubstatuses[substatusIndex].rules.splice(
                                    ruleIndex,
                                    1,
                                    {
                                        ...newSubstatuses[substatusIndex].rules[
                                            ruleIndex
                                        ],
                                        from: value,
                                    },
                                );
                                updateSettings({
                                    substatuses: newSubstatuses,
                                });

                                await this.plugin.saveSettings();
                            });
                    })
                    .addToggle((toggle) => {
                        toggle
                            .setTooltip('Case-insensitive')
                            .setValue(rule.caseInsensitive)
                            .onChange(async (value) => {
                                const newSubstatuses = cloneDeep(
                                    getSettings().substatuses,
                                );
                                newSubstatuses[substatusIndex].rules[
                                    ruleIndex
                                ].caseInsensitive = value;
                                updateSettings({
                                    substatuses: newSubstatuses,
                                });

                                await this.plugin.saveSettings();
                            });
                    })
                    .addToggle((toggle) => {
                        toggle
                            .setTooltip('Global')
                            .setValue(rule.global)
                            .onChange(async (value) => {
                                const newSubstatuses = cloneDeep(
                                    getSettings().substatuses,
                                );
                                newSubstatuses[substatusIndex].rules[
                                    ruleIndex
                                ].global = value;
                                updateSettings({
                                    substatuses: newSubstatuses,
                                });

                                await this.plugin.saveSettings();
                            });
                    })
                    .addText((text) => {
                        text.setPlaceholder('To')
                            .setValue(rule.to)
                            .onChange(async (value) => {
                                const newSubstatuses = cloneDeep(
                                    getSettings().substatuses,
                                );
                                newSubstatuses[substatusIndex].rules.splice(
                                    ruleIndex,
                                    1,
                                    {
                                        ...newSubstatuses[substatusIndex].rules[
                                            ruleIndex
                                        ],
                                        to: value,
                                    },
                                );
                                updateSettings({
                                    substatuses: newSubstatuses,
                                });

                                await this.plugin.saveSettings();
                            });
                    })
                    .addExtraButton((button) => {
                        button
                            .setIcon('cross-in-box')
                            .setTooltip('Delete rule')
                            .onClick(async () => {
                                const newSubstatuses = cloneDeep(
                                    getSettings().substatuses,
                                );
                                newSubstatuses[substatusIndex].rules.splice(
                                    ruleIndex,
                                    1,
                                );
                                updateSettings({
                                    substatuses: newSubstatuses,
                                });

                                await this.plugin.saveSettings();
                                this.display();
                            });
                    });
            });

            new Setting(rulesEl).addButton((button) => {
                button
                    .setButtonText('Add find/replace rule')
                    .setClass('add-rule-button')
                    .onClick(async () => {
                        const newSubstatuses = cloneDeep(
                            getSettings().substatuses,
                        );
                        newSubstatuses[substatusIndex].rules.push({
                            from: '',
                            to: '',
                            caseInsensitive: false,
                            global: false,
                        });
                        updateSettings({
                            substatuses: newSubstatuses,
                        });
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });
        });

        new Setting(substatusesEl).addButton((button) => {
            button
                .setButtonText('Add substatus')
                .setClass('add-substatus-button')
                .onClick(async () => {
                    updateSettings({
                        substatuses: [
                            ...getSettings().substatuses,
                            { name: '', done: false, rules: [] },
                        ],
                    });
                    await this.plugin.saveSettings();
                });
        });
    }
}
