"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const Log_1 = __importDefault(require("./Log"));
class Cache {
    constructor() {
        this.client = redis_1.default.createClient(process.env.REDIS_URL || "redis://127.0.0.1:6379");
        this.client.on("error", Log_1.default.w);
    }
    async getString(key) {
        const value = await this.get(key);
        return value === null ? null : value.toString();
    }
    async getNumber(key) {
        const value = await this.get(key);
        return value === null ? null : Number(value);
    }
    async getBoolean(key) {
        const value = await this.get(key);
        return value === null ? null : Boolean(value === "true");
    }
    async getJSON(key) {
        const value = await this.get(key);
        return value === null ? null : JSON.parse(value);
    }
    async get(key) {
        try {
            const getAsync = util_1.promisify(this.client.get).bind(this.client);
            return await getAsync(key);
        }
        catch (_a) {
            return null;
        }
    }
    async set(key, value) {
        const setAsync = util_1.promisify(this.client.set).bind(this.client);
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        else {
            value = value.toString();
        }
        await setAsync(key, value);
    }
    async mset(key, ...nameValues) {
        const msetAsync = util_1.promisify(this.client.mset).bind(this.client);
        const values = nameValues.map(nameOrValue => {
            if (!nameOrValue) {
                throw new Error("mset: even number of name or value must be provided");
            }
            if (typeof nameOrValue === "object") {
                nameOrValue = JSON.stringify(nameOrValue);
            }
            else {
                nameOrValue = nameOrValue.toString();
            }
            return nameOrValue;
        });
        Log_1.default.d(values);
        await msetAsync(key, values);
    }
}
exports.default = Cache;
//# sourceMappingURL=Cache.js.map