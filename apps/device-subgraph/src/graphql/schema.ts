
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Notification {
    id: string;
    actor: User;
}

export interface ISubscription {
    onCreateNotification(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IQuery {
    service(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    detectedDevice(): Nullable<string> | Promise<Nullable<string>>;
}

export interface User {
    id: string;
    notifications?: Nullable<Nullable<Notification>[]>;
}

type Nullable<T> = T | null;
