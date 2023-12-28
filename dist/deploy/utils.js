"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfigs = exports.walkDirectory = void 0;
var fs_1 = require("fs");
var walkDirectory = function (path) {
    if ((0, fs_1.lstatSync)(path).isFile())
        return [path];
    var dir = (0, fs_1.readdirSync)(path);
    var files = [];
    for (var _i = 0, dir_1 = dir; _i < dir_1.length; _i++) {
        var path_1 = dir_1[_i];
        if ((0, fs_1.lstatSync)(path_1).isDirectory())
            files.concat((0, exports.walkDirectory)(path_1));
        else
            files.push(path_1);
    }
    return files;
};
exports.walkDirectory = walkDirectory;
var loadConfigs = function (paths) {
    var configs = [];
    var _loop_1 = function (path) {
        var json = (0, fs_1.readFileSync)(path, "utf-8");
        configs.push([
            JSON.parse(json),
            function (value) { return (0, fs_1.writeFileSync)(path, JSON.stringify(value, null, 2)); },
        ]);
    };
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var path = paths_1[_i];
        _loop_1(path);
    }
    return configs;
};
exports.loadConfigs = loadConfigs;
