"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
var mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
var BaseDaddyInuImpl = /** @class */ (function () {
    function BaseDaddyInuImpl(endpoint) {
        if (typeof endpoint === "string")
            this.umi = (0, umi_bundle_defaults_1.createUmi)(endpoint);
        else
            this.umi = endpoint;
        this.umi.use((0, mpl_candy_machine_1.mplCandyMachine)()).use((0, mpl_candy_machine_1.mplCandyMachine)());
    }
    return BaseDaddyInuImpl;
}());
exports.default = BaseDaddyInuImpl;
