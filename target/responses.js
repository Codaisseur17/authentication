"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const request = require("superagent");
const responsesUrl = process.env.RESPONSES_URL || 'http://responses:4002';
let ResponseController = class ResponseController {
    async getResponses(userId) {
        const result = await request
            .get(`${responsesUrl}/responses`)
            .set('userId', userId.id)
            .catch(error => console.log(error));
        if (!result)
            throw new routing_controllers_1.BadRequestError('Invalid permissions');
        return result;
    }
    async createResponse(body) {
        const result = await request
            .post(`${responsesUrl}/responses`)
            .send(body)
            .catch(error => console.log(error));
        if (!result)
            throw new routing_controllers_1.BadRequestError('Something went wrong');
        return result;
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/responses'),
    __param(0, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "getResponses", null);
__decorate([
    routing_controllers_1.Post('/responses'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "createResponse", null);
ResponseController = __decorate([
    routing_controllers_1.JsonController()
], ResponseController);
exports.default = ResponseController;
//# sourceMappingURL=responses.js.map