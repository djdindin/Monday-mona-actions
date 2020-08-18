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
        while (_) try {
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
var core = require('@actions/core');
var github = require('@actions/github');
var Octokit = require("@octokit/action");
var axios = require('axios');
var myToken = core.getInput('GITHUB_TOKEN');
var mondayToken = core.getInput('MONDAY_TOKEN');
var _a = require("graphql"), graphql = _a.graphql, buildSchema = _a.buildSchema;
var octoGraphQl = require("@octokit/graphql").octoGraphQl;
var mondayUrl = "https://api.monday.com/v2/";
var mondayBoardId = 409101405; // update this
var octokit = github.getOctokit(myToken);
var issueComment = github.context.payload.comment.body;
var issueBody = github.context.payload.issue.body;
var commentPayload = github.context.payload.comment;
var issuePayload = github.context.payload;
var issueNumber = github.context.payload.issue.number;
var repoOrg = 'github'; //update this
var repoName = 'it-operations'; // update this
var mondayItemData = function () {
    return __awaiter(this, void 0, void 0, function () {
        var options, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        headers: {
                            // Reads from your .env file
                            Authorization: mondayToken
                        },
                        // GraphQL query here
                        data: { query: "\n                    query ($itemId: [Int]) {\n                    boards(ids: $itemId){\n                          items {\n                            id\n                          }\n                        }\n                      }\n                  \n                    ",
                            variables: {
                                itemId: mondayBoardId
                            }
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get(mondayUrl, options)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.data.data.boards[0].items];
                case 3:
                    err_1 = _a.sent();
                    console.log('Monday API Error!!!', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var actionBastard = function () {
    return __awaiter(this, void 0, void 0, function () {
        var mondayData, _a, _b, _i, i, options, response, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(github.context.payload.comment.user.login != 'mondaymona[bot]')) return [3 /*break*/, 8];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    console.log('awaiting data');
                    return [4 /*yield*/, mondayItemData()];
                case 2:
                    mondayData = _c.sent();
                    console.log('data awaited', mondayData);
                    _a = [];
                    for (_b in mondayData)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    i = _a[_i];
                    if (!issueBody.includes(mondayData[i].id)) return [3 /*break*/, 5];
                    console.log('inside loop', mondayData[i].id);
                    options = {
                        query: "\n                           mutation ($id: Int!, $body: String!){\n                           create_update (item_id: $id, body: $body) {\n                               id\n                           }\n                       }",
                        variables: {
                            id: parseInt(mondayData[i].id),
                            body: 'From @' + commentPayload.user.login + ': ' + '\n' + issueComment + '\n' + 'Link to comment: ' + commentPayload.html_url
                        }
                    };
                    console.log('posting');
                    return [4 /*yield*/, axios.post(mondayUrl, options, {
                            headers: {
                                Authorization: mondayToken
                            }
                        })];
                case 4:
                    response = _c.sent();
                    console.log(response.data);
                    console.log(commentPayload.user.login);
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_2 = _c.sent();
                    console.log(err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
};
actionBastard();
