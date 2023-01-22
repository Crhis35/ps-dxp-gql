
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Notification {
    id: string;
    actor: User;
}

export abstract class ISubscription {
    abstract onCreateNotification(): Nullable<string> | Promise<Nullable<string>>;
}

export abstract class IQuery {
    abstract service(): Nullable<string> | Promise<Nullable<string>>;
}

export abstract class IMutation {
    abstract detectedDevice(): Nullable<string> | Promise<Nullable<string>>;
}

export class User {
    id: string;
    notifications?: Nullable<Nullable<Notification>[]>;
}

type Nullable<T> = T | null;
