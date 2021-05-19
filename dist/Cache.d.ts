import { RedisClient } from "redis";
declare class Cache {
    client: RedisClient;
    constructor();
    getString(key: string): Promise<string>;
    getNumber(key: string): Promise<number>;
    getBoolean(key: string): Promise<boolean>;
    getJSON(key: string): Promise<any>;
    private get;
    set(key: string, value: unknown): Promise<void>;
    mset(key: string, ...nameValues: any[]): Promise<void>;
}
export default Cache;
