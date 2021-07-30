import cloneDeep from 'lodash.clonedeep';

export interface Settings {
    globalFilter: string;
    removeGlobalFilter: boolean;
    makeDatesBacklinks: boolean;
    dueDateMarker: string;
    doneDateMarker: string;
    recurrenceMarker: string;
    substatuses: Substatus[];
}

export interface Substatus {
    name: string = '';
    rules: { from: string; to: string }[];
}

export const defaultSettings: Settings = {
    globalFilter: '',
    removeGlobalFilter: false,
    makeDatesBacklinks: false,
    dueDateMarker: '📅',
    doneDateMarker: '✅',
    recurrenceMarker: '🔁',
    substatuses: [
        {
            name: 'Migrated',
            rules: [{ from: '1', to: '2' }],
        },
    ],
};

let settings: Settings = { ...defaultSettings };

export const getSettings = (): Settings => {
    return { ...settings };
};

export const updateSettings = (newSettings: Partial<Settings>): Settings => {
    settings = { ...cloneDeep(settings), ...cloneDeep(newSettings) };

    return getSettings();
};
