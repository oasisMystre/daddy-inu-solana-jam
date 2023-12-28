"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs_1 = require("fs");
var umi_1 = require("@metaplex-foundation/umi");
var daddy_inu_1 = __importDefault(require("../src/daddy_inu"));
var deploy_1 = require("./deploy");
var utils_1 = require("./utils");
function initialize(path, endpoint) {
    var keypair = (0, fs_1.readFileSync)(path);
    var dinu = new daddy_inu_1.default(endpoint);
    var wallet = dinu.umi.eddsa.createKeypairFromSeed(keypair);
    dinu.umi.use((0, umi_1.keypairIdentity)(wallet));
    return dinu;
}
commander_1.program
    .name("Big Daddy Inu (BDI) NFT Mintter")
    .description("Create and update Solana NFT data with just a single json config")
    .version("1.0");
commander_1.program
    .command("create")
    .requiredOption("--enpoint <string>", "solana rpc endpoint")
    .requiredOption("--keypair <string>", "solana wallet keypair secret")
    .requiredOption("--path <string>", "nft config directory or file")
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var keypair, path, endpoint, dinu, configs, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keypair = options.keypair, path = options.path, endpoint = options.endpoint;
                dinu = initialize(keypair, endpoint);
                configs = (0, utils_1.loadConfigs)((0, utils_1.walkDirectory)(path));
                promise = configs
                    .filter(function (_a) {
                    var config = _a[0];
                    return config.metadata === null;
                })
                    .map(function (args) { return deploy_1.createMint.apply(void 0, __spreadArray([dinu], args, false)); });
                return [4 /*yield*/, Promise.all(promise)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.program
    .command("create")
    .requiredOption("--enpoint <string>", "solana rpc endpoint")
    .requiredOption("--keypair <type>", "solana wallet keypair secret")
    .option("--path <string>", "nft pack config directory or file")
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var keypair, path, endpoint, dinu, configs, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keypair = options.keypair, path = options.path, endpoint = options.endpoint;
                dinu = initialize(keypair, endpoint);
                configs = (0, utils_1.loadConfigs)((0, utils_1.walkDirectory)(path));
                promise = configs
                    .filter(function (_a) {
                    var config = _a[0];
                    return config.metadata !== null;
                })
                    .map(function (_a) {
                    var config = _a[0];
                    return (0, deploy_1.updateMint)(dinu, config);
                });
                return [4 /*yield*/, Promise.all(promise)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.program.parse();
