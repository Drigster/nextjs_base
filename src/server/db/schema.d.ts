import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Session = {
    id: string;
    user_id: string;
    expires_at: string;
};
export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    createdAt: Generated<string>;
};
export type DB = {
    Session: Session;
    User: User;
};
