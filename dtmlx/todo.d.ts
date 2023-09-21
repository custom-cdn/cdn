declare type TDataBlock = {
    in: string[];
    out: string[];
    exec: any;
    length?: number;
};
declare type TDataConfig = TDataBlock[];
declare type TID = number | string;
declare type TDispatch$1<T> = <A extends keyof T>(action: A, data: T[A]) => void;
interface DataHash {
    [key: string]: any;
}
interface IWritable<T> {
    subscribe: (fn: (v: T) => any) => any;
    update: (fn: (v: T) => any) => any;
    set: (val: T) => any;
}
declare type TWritableCreator = (val: any) => IWritable<typeof val>;

declare type TState<Type> = {
    [Property in keyof Type]: IWritable<Type[Property]>;
};
declare class Store<T extends DataHash> {
    private _state;
    private _values;
    private _writable;
    constructor(writable: TWritableCreator);
    setState(data: Partial<T>): void;
    getState(): T;
    getReactive(): TState<T>;
    private _wrapWritable;
}

declare class EventBus<T> {
    private _handlers;
    protected _nextHandler: TDispatch$1<T>;
    constructor();
    on(name: string, handler: any): void;
    exec(name: string, ev: any): void;
    setNext(next: TDispatch$1<T>): void;
}

declare const uid: () => number;

declare type TDispatch = <A extends keyof THandlersConfig>(action: A, data: THandlersConfig[A]) => void;
declare type TSubTaskCounter = "percentage" | "number";
declare type TItemType = "task" | "project";
declare type TMenuType = "task" | "user" | "project";
interface IApi {
    exec: EventBus<THandlersConfig>["exec"];
    on: EventBus<THandlersConfig>["on"];
    intercept: EventBus<THandlersConfig>["on"];
    getState: () => IDataStoreState;
    getReactiveState: () => any;
    setNext: (ev: IEventBus) => void;
    getStores: () => {
        state: DataStore;
    };
    serialize: () => IToDoData;
    parse: (obj: IToDoData) => void;
    existsTask: (obj: {
        id: TID;
    }) => boolean;
    existsProject: (obj: {
        id: TID;
    }) => boolean;
    getTask: (obj: {
        id: TID;
    }) => ITaskItem;
    getProject: (obj: {
        id: TID;
    }) => IProjectItem;
    hasChildren: (obj: {
        id: TID;
        filtered?: boolean;
    }) => boolean;
    getChildrenIds: (obj: {
        id: TID;
        filtered?: boolean;
        tree?: boolean;
    }) => TID[];
    getParentIds: (obj: {
        id: TID;
    }) => TID[];
}
interface IEventBus {
    exec(name: string, ev: any): void;
    setNext(next: TDispatch): void;
}
interface IComponentConfig {
    id?: TID;
    tasks?: ITaskItem[];
    users?: IUserItem[];
    projects?: IProjectItem[];
    tags?: string[];
    activeProject?: TID | null;
    selected?: TID | null;
    readonly?: boolean;
    taskShape?: ITaskShape;
}
interface IDataStoreState {
    id: TID;
    tasks: ITaskItem[];
    users: IUserItem[];
    projects: IProjectItem[];
    tags: string[];
    activeProject: TID | null;
    selected: TID | null;
    taskShape: ITaskShape;
    readonly: boolean;
    usersMap: IUsersMap | null;
    children: {
        [key: TID]: ITaskTreeItem[];
    } | null;
    filteredChildren: {
        [key: TID]: ITaskTreeItem[];
    } | null;
    treeTasks: ITaskTreeItem[];
    filter: IFilterConfig | null;
    menu: IMenuConfig;
    editableItem: IEditableItem | null;
    copiedTasks: ITaskItem[];
    defaultTags: string[];
    stateSearch: IStateSearch;
    stateDueDate: IStateDueDate;
}
interface ITaskShape {
    counter?: {
        type: TSubTaskCounter;
    };
    date?: {
        format: string;
        validate: boolean;
    };
    selectable?: {
        behavior: "manual" | "auto";
    };
}
interface ITaskItem {
    id?: TID;
    parent?: TID | null;
    project?: TID | null;
    text?: string;
    checked?: boolean;
    collapsed?: boolean;
    assigned?: TID[];
    due_date?: Date | string;
    [key: string]: any;
}
interface IProjectItem {
    id: TID | null;
    label: string;
}
interface IUserItem {
    id: string;
    label: string;
    avatar?: string;
    color?: string;
}
interface ITaskTreeItem extends ITaskItem {
    children?: ITaskTreeItem[];
    counter?: ISubTaskCounter;
    availableUsers?: IUserItem[];
}
interface IEditableItem {
    id: TID;
    type?: TItemType;
    initValue?: string;
    currentValue?: string;
    targetDate?: string;
    dropdown?: {
        type: "menu" | "datepicker";
        coords: ICoords;
        data?: any[];
    };
}
interface ISubTaskCounter {
    total: number;
    done: number;
    type: TSubTaskCounter;
}
interface IMenuConfig {
    id: TID;
    type: TMenuType;
    open: boolean;
    coords: ICoords;
    context?: boolean;
    data?: any[];
}
interface ICoords {
    x: number;
    y: number;
}
interface IUsersMap {
    [id: string]: IUserItem;
}
interface IFilterConfig {
    match: string | null;
    by?: string;
    highlight?: boolean;
    strict?: boolean;
}
interface IStateDueDate {
    id: TID;
    value: string;
    open: boolean;
}
interface IStateSearch {
    value: string;
    open?: boolean;
    dropdown?: {
        open: boolean;
        coords: ICoords;
        data: string[];
    };
    focus?: boolean;
}
declare type TItemTemplate = (config: Record<string, any>) => void[];
interface IToolbarItem {
    type?: string;
    template?: TItemTemplate;
}
interface IToDoData {
    tasks?: IComponentConfig["tasks"];
    users?: IComponentConfig["users"];
    projects?: IComponentConfig["projects"];
    tags?: IComponentConfig["tags"];
    activeProject?: IComponentConfig["activeProject"];
}

declare class DataStore extends Store<IDataStoreState> {
    in: EventBus<THandlersConfig>;
    out: EventBus<THandlersConfig>;
    private _router;
    constructor(writable: TWritableCreator);
    init(state: Partial<IDataStoreState>): void;
    setState(state: Partial<IDataStoreState>, ctx?: TDataConfig): void;
    serialize(): IToDoData;
    parse(obj: IToDoData): void;
    existsTask(id: TID): boolean;
    existsProject(id: TID): boolean;
    updateTask({ id, task, skipStateCalc, }: THandlersConfig["update-task"]): void;
    moveTask({ id, project, parent, targetId, reverse, silent, }: {
        id: TID;
        project?: TID | null;
        parent?: TID | null;
        targetId?: TID;
        reverse?: boolean;
        operation?: string;
        silent?: boolean;
    }): void;
    pasteTask({ targetId, parent, project, reverse, clone, }: {
        targetId?: TID;
        parent?: TID | null;
        project?: TID | null;
        reverse?: boolean;
        clone?: boolean;
    }): void;
    getTask(id: TID): ITaskItem;
    getProject(id: TID): IProjectItem;
    getChildren({ id, tree, filtered, }: {
        id?: TID;
        tree?: boolean;
        filtered?: boolean;
    }): ITaskTreeItem[];
    getChildrenIds({ id, tree, filtered, }: {
        id: TID;
        tree?: boolean;
        filtered?: boolean;
    }): TID[];
    getTailId(id: TID, filtered?: boolean): TID;
    hasChildren(id: TID, filtered?: boolean): boolean;
    getTreeIndex(id: TID, filtered?: boolean): number;
    getParentIds(id: TID): TID[];
    getNearId({ id, dir, flat, filtered, }: {
        id: TID;
        dir?: "prev" | "next";
        flat?: boolean;
        filtered?: boolean;
    }): TID;
    getInnerState(tasks: ITaskItem[], project?: TID | null): {
        treeTasks: ITaskTreeItem[];
        children: {
            [key: TID]: ITaskItem[];
        };
        filteredChildren: {
            [key: TID]: ITaskItem[];
        };
        usersMap: IUsersMap;
        tags: string[];
    };
    private _setHandlers;
    private _getNextId;
    private _getPrevId;
}
interface THandlersConfig {
    ["add-task"]: {
        id?: TID;
        project?: TID | null;
        parent?: TID | null;
        targetId?: TID;
        task?: ITaskItem;
        reverse?: boolean;
    };
    ["move-task"]: {
        id: TID;
        project?: TID | null;
        parent?: TID | null;
        targetId?: TID;
        reverse?: boolean;
        operation?: string;
    };
    ["copy-task"]: {
        id: TID;
        targetId?: TID;
        parent?: TID | null;
        project?: TID | null;
        reverse?: boolean;
    };
    ["paste-task"]: {
        targetId?: TID;
        parent?: TID | null;
        project?: TID | null;
        reverse?: boolean;
    };
    ["update-task"]: {
        id: TID;
        task: ITaskItem;
        skipProvider?: boolean;
        skipStateCalc?: boolean;
        bunch?: ITaskItem[];
    };
    ["delete-task"]: {
        id: TID;
    };
    ["indent-task"]: {
        id: TID;
    };
    ["unindent-task"]: {
        id: TID;
    };
    ["check-task"]: {
        id: TID;
        manual?: boolean;
        skipStateCalc?: boolean;
    };
    ["uncheck-task"]: {
        id: TID;
        manual?: boolean;
        skipStateCalc?: boolean;
    };
    ["expand-task"]: {
        id: TID;
    };
    ["collapse-task"]: {
        id: TID;
    };
    ["select-task"]: {
        id: TID | null;
    };
    ["unselect-task"]: {
        id: TID;
    };
    ["open-inline-editor"]: {
        id: TID;
        type?: TItemType;
    };
    ["close-inline-editor"]: {
        id?: TID;
        save?: boolean;
    };
    ["open-menu"]: {
        id: TID;
        type: TMenuType;
        coords: ICoords;
        context?: boolean;
    };
    ["close-menu"]: {
        id?: TID;
        type?: TMenuType;
        coords?: ICoords;
        context?: boolean;
    };
    ["assign-user"]: {
        id: TID;
        userId: string;
    };
    ["unassign-user"]: {
        id: TID;
        userId: string;
    };
    ["add-project"]: {
        id?: TID;
        project?: IProjectItem;
    };
    ["update-project"]: {
        id: TID;
        project: IProjectItem;
    };
    ["set-project"]: {
        id: TID | null;
    };
    ["delete-project"]: {
        id: TID | null;
    };
    ["set-filter"]: IFilterConfig;
    ["edit-item"]: {
        id: TID;
        currentValue: string;
    };
    ["click-menu-item"]: {
        id: TID;
        action: string;
        extra?: string;
    };
    ["keypress-on-todo"]: {
        code: string;
        event: KeyboardEvent;
    };
    ["clone-task"]: {
        targetId?: TID;
        parent?: TID | null;
        project?: TID | null;
        bunch: ITaskItem[];
    };
    ["set-state-search"]: IStateSearch;
    ["set-state-due-date"]: IStateDueDate;
}

declare class Events {
    private _api;
    constructor(api: IApi);
    on<K extends keyof THandlersConfig>(event: K, callback: (config: THandlersConfig[K]) => any): void;
    exec<K extends keyof THandlersConfig>(event: K, data: THandlersConfig[K]): void;
}

interface IToDoConfig extends IComponentConfig {
    locale?: Record<string, string>;
}
declare class ToDo {
    api: IApi;
    events: Events;
    config: IToDoConfig;
    container: HTMLElement | Element;
    private _widget;
    constructor(container: HTMLElement | Element | string, config: IToDoConfig);
    destructor(): void;
    setConfig(config: Partial<IToDoConfig>): void;
    parse(data: IToDoData): void;
    serialize(): IToDoData;
    existsTask(config: {
        id: TID;
    }): boolean;
    existsProject(config: {
        id: TID;
    }): boolean;
    getTask(config: {
        id: TID;
    }): ITaskItem;
    getProject(config: {
        id: TID;
    }): IProjectItem;
    hasChildren(config: {
        id: TID;
        filtered?: boolean;
    }): boolean;
    getChildrenIds(config: {
        id: TID;
        filtered?: boolean;
        tree?: boolean;
    }): TID[];
    getParentIds(config: {
        id: TID;
    }): TID[];
    setLocale(locale: Record<string, string>): void;
    setFilter(config: THandlersConfig["set-filter"]): void;
    selectTask(config: THandlersConfig["select-task"]): void;
    unselectTask(config: THandlersConfig["unselect-task"]): void;
    getSelection(): TID[];
    addTask(config: THandlersConfig["add-task"]): void;
    copyTask(config: THandlersConfig["copy-task"]): void;
    pasteTask(config: THandlersConfig["paste-task"]): void;
    moveTask(config: THandlersConfig["move-task"]): void;
    updateTask(config: THandlersConfig["update-task"]): void;
    deleteTask(config: THandlersConfig["delete-task"]): void;
    indentTask(config: THandlersConfig["indent-task"]): void;
    unindentTask(config: THandlersConfig["unindent-task"]): void;
    checkTask(config: THandlersConfig["check-task"]): void;
    uncheckTask(config: THandlersConfig["uncheck-task"]): void;
    expandTask(config: THandlersConfig["expand-task"]): void;
    collapseTask(config: THandlersConfig["collapse-task"]): void;
    openInlineEditor(config: THandlersConfig["open-inline-editor"]): void;
    closeInlineEditor(config: THandlersConfig["close-inline-editor"]): void;
    openMenu(config: THandlersConfig["open-menu"]): void;
    closeMenu(config: THandlersConfig["close-menu"]): void;
    assignUser(config: THandlersConfig["assign-user"]): void;
    unassignUser(config: THandlersConfig["unassign-user"]): void;
    addProject(config: THandlersConfig["add-project"]): void;
    updateProject(config: THandlersConfig["update-project"]): void;
    setProject(config: THandlersConfig["set-project"]): void;
    deleteProject(config: THandlersConfig["delete-project"]): void;
    private _init;
}

interface IToolbarConfig {
    api: IApi;
    items?: string[] | TItemTemplate[] | IToolbarItem[];
    locale?: Record<string, string>;
}
declare class Toolbar {
    api: IApi;
    events: Events;
    config: IToolbarConfig;
    container: HTMLElement;
    private _toolbar;
    constructor(container: HTMLElement, config: IToolbarConfig);
    destructor(): void;
    setConfig(config: Partial<IToolbarConfig>): void;
    setLocale(locale: Record<string, string>, api: IApi): void;
    private _init;
    private _configToProps;
    private _normalizeItems;
}

declare class RestDataProvider extends EventBus<THandlersConfig> {
    private _url;
    private _api;
    private _queue;
    constructor(url?: string, api?: IApi);
    getTasks(): Promise<ITaskItem[]>;
    getProjectTasks(id: TID): Promise<ITaskItem[]>;
    getUsers(): Promise<IUserItem[]>;
    getProjects(): Promise<IProjectItem[]>;
    getTags(): Promise<string[]>;
    setAPI(api: IApi): void;
    protected getHandlers(handlers: Partial<Record<keyof THandlersConfig, any>>): Partial<Record<keyof THandlersConfig, any>>;
    protected send<T>(url: string, method: string, data?: any, customHeaders?: any): Promise<T>;
    protected parseTasks(data: any[]): any[];
    protected toArray(data: any[]): any[];
}

export { RestDataProvider, ToDo, Toolbar, uid };
