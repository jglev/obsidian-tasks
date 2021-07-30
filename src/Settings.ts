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
    name: string;
    done: boolean;
    rules: SubstatusRule[];
}

export interface SubstatusRule {
    from: string;
    to: string;
    caseInsensitive: boolean;
    global: boolean;
}

export const defaultSettings: Settings = {
    globalFilter: '',
    removeGlobalFilter: false,
    makeDatesBacklinks: false,
    dueDateMarker: '📅',
    doneDateMarker: '✅',
    recurrenceMarker: '🔁',
    substatuses: [],
};

let settings: Settings = { ...defaultSettings };

export const getSettings = (): Settings => {
    return { ...settings };
};

export const updateSettings = (newSettings: Partial<Settings>): Settings => {
    settings = { ...cloneDeep(settings), ...cloneDeep(newSettings) };

    return getSettings();
};
