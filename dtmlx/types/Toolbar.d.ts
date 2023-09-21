import { Events } from "./Events";
import type { IApi, TItemTemplate, IToolbarItem } from "@xbs/lib-todo";
export interface IToolbarConfig {
    api: IApi;
    items?: string[] | TItemTemplate[] | IToolbarItem[];
    locale?: Record<string, string>;
}
export declare class Toolbar {
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
