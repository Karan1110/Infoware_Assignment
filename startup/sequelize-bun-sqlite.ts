/*
 * This is a wrapper around the `bun:sqlite` module to make it compatible with the `sequelize`.
 *
 * Usage:
 * ```ts
 * import { Sequelize } from 'sequelize';
 * import * as sqlite3 from './sqlite3.ts';
 *
 * const sequelize = new Sequelize({
 *     dialect: 'sqlite',
 *     storage: 'db.sqlite',
 *     dialectModule: sqlite3,
 * });
 * ```
 */

import { Database as BunSqlite, constants } from 'bun:sqlite';

export const OPEN_READWRITE = constants.SQLITE_OPEN_READWRITE;
export const OPEN_CREATE = constants.SQLITE_OPEN_CREATE;

// sequelize sqlite need the constructor named `Statement`
class Statement {
    declare lastID: number;
    declare changes: number;
}

export class Database {
    #sqlite!: BunSqlite;

    constructor(filename: string, options: number, callback: (err: Error | null) => void) {
        try {
            this.#sqlite = new BunSqlite(filename, options);
            setImmediate(() => callback(null));
        } catch (err) {
            setImmediate(() => callback(err as Error));
        }
    }

    run(sql: string, callback?: (this: Statement | void, err: Error | null) => void): this;
    run(
        sql: string,
        params: any,
        callback?: (this: Statement | void, err: Error | null) => void,
    ): this;
    run(
        sql: string,
        paramsOrCallback: any,
        callback?: (this: Statement | void, err: Error | null) => void,
    ): this {
        let params: any;

        if (typeof callback === 'undefined') {
            callback = paramsOrCallback;
            params = undefined;
        } else {
            params = paramsOrCallback;
        }

        try {
            const stmt = this.#sqlite.prepare(sql, params);
            stmt.run();
            stmt.finalize();
            if(callback) {
                const metadata = Object.assign(new Statement(), this.#changes());
                callback = callback.bind(metadata);
                setImmediate(() => callback!(null));
            }
        } catch (err) {
            callback && setImmediate(() => callback!(err as Error));
        }
        return this;
    }

    all<T>(
        sql: string,
        callback?: (this: Statement | void, err: Error | null, rows?: T[]) => void,
    ): this;
    all<T>(
        sql: string,
        params: any,
        callback?: (this: Statement | void, err: Error | null, rows?: T[]) => void,
    ): this;
    all<T>(
        sql: string,
        paramsOrCallback: any,
        callback?: (this: Statement | void, err: Error | null, rows?: T[]) => void,
    ): this {
        let params: any;

        if (typeof callback === 'undefined') {
            callback = paramsOrCallback;
            params = undefined;
        } else {
            params = paramsOrCallback;
        }

        try {
            const stmt = this.#sqlite.prepare(sql, params);
            const rows = stmt.all() as T[];
            stmt.finalize();
            if(callback) {
                const metadata = Object.assign(new Statement(), this.#changes());
                callback = callback.bind(metadata);
                setImmediate(() => callback!(null, rows));
            }
        } catch (err) {
            callback && setImmediate(() => callback!(err as Error));
        }
        return this;
    }

    serialize(callback: () => void): void {
        Promise.resolve().then(callback);
    }

    #changes() {
        const changes = this.#sqlite.query<{ lastID: number; changes: number }, []>(
            'SELECT last_insert_rowid() AS lastID, changes() AS changes',
        );
        try {
            return changes.get()!;
        } finally {
            changes.finalize();
        }
    }
}
