"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archive = exports.deleteAllPrivateKeys = exports.installPrivateKey = exports.notarizeApp = void 0;
const exec = __importStar(require("@actions/exec"));
const fs = __importStar(require("fs"));
const io = __importStar(require("@actions/io"));
const path = __importStar(require("path"));
/**
 Upload the specified application.
 @param appPath The path to the app to notarize.
 @param apiKeyId The id of the API key to use (private key must already be installed)
 @param issuerId The issuer identifier of the API key.
 @param primaryBundleId the primary bundle id of the app to notarize.
 @param options (Optional) Command execution options.
 */
function notarizeApp(appPath, apiKeyId, issuerId, primaryBundleId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = [
            'altool',
            '--output-format',
            'json',
            '--notarize-app',
            '--file',
            appPath,
            '--apiKey',
            apiKeyId,
            '--apiIssuer',
            issuerId,
            '--primary-bundle-id',
            primaryBundleId
        ];
        yield exec.exec('xcrun', args, options);
    });
}
exports.notarizeApp = notarizeApp;
function privateKeysPath() {
    const home = process.env['HOME'] || '';
    if (home === '') {
        throw new Error('Unable to determine user HOME path');
    }
    return path.join(home, 'private_keys');
}
function installPrivateKey(apiKeyId, apiPrivateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        yield io.mkdirP(privateKeysPath());
        fs.writeFileSync(path.join(privateKeysPath(), `AuthKey_${apiKeyId}.p8`), apiPrivateKey);
    });
}
exports.installPrivateKey = installPrivateKey;
function deleteAllPrivateKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        yield io.rmRF(privateKeysPath());
    });
}
exports.deleteAllPrivateKeys = deleteAllPrivateKeys;
function archive(appPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const archivePath = '/tmp/archive.zip'; // TODO Temporary file
        const args = [
            '-c',
            '-k',
            '--keepParent',
            appPath,
            archivePath // Destination
        ];
        yield exec.exec('ditto', args);
        return archivePath;
    });
}
exports.archive = archive;
