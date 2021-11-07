export interface Settings {
    globalFilter: string;
    removeGlobalFilter: boolean;
    makeDatesBacklinks: boolean;
}

export const defaultSettings: Settings = {
    globalFilter: '',
    removeGlobalFilter: false,
    makeDatesBacklinks: false,
};

let settings: Settings = { ...defaultSettings };

export const getSettings = (): Settings => {
    return { ...settings };
};

export const updateSettings = (newSettings: Partial<Settings>): Settings => {
    settings = { ...settings, ...newSettings };

    return getSettings();
};
