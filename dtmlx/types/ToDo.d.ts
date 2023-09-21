import { Events } from "./Events";
import type { IApi, IComponentConfig, IProjectItem, ITaskItem, IToDoData, THandlersConfig, TID } from "@xbs/lib-todo";
export interface IToDoConfig extends IComponentConfig {
    locale?: Record<string, string>;
}
export declare class ToDo {
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
