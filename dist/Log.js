"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    static d(...value) {
        console.log("  ", ...value);
    }
    static w(...value) {
        console.warn("  ", ...value);
    }
    static e(...value) {
        console.error("  ", ...value);
    }
}
exports.default = Log;
//# sourceMappingURL=Log.js.map