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
const quizzesUrl = process.env.QUIZZES_URL;
let QuizzesController = class QuizzesController {
    async allQuizzes() {
        const quizzes = await request.get(`${quizzesUrl}`);
        return quizzes;
    }
    async postQuizzes(userId, body) {
        const result = await request
            .post(`${quizzesUrl}/quizzes`)
            .set('userId', userId.id)
            .send(body);
        return result.body;
    }
    async deleteQuiz(userId, id) {
        const result = await request
            .delete(`${quizzesUrl}/${id}`)
            .set('userId', userId.id);
        return result.body;
    }
};
__decorate([
    routing_controllers_1.Get('/quizzes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "allQuizzes", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/quizzes'),
    __param(0, routing_controllers_1.CurrentUser()), __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "postQuizzes", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Delete('/quizzes/{:id}'),
    __param(0, routing_controllers_1.CurrentUser()), __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "deleteQuiz", null);
QuizzesController = __decorate([
    routing_controllers_1.JsonController()
], QuizzesController);
exports.default = QuizzesController;
//# sourceMappingURL=quizzes.js.map