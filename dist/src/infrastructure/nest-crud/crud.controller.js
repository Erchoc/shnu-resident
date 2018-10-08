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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
const common_1 = require("@nestjs/common");
class CrudController {
    constructor(crudService) {
        this.crudService = crudService;
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.create(entity);
        });
    }
    updateBatch(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.updateBatch(entity);
        });
    }
    query(q) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.crudService.query(q);
            let currPage = ~~(q.skip / q.take) + 1;
            let maxPage = Math.ceil(res[1] / q.take);
            return { total: res[1], result: res[0], currPage: currPage, maxPage: maxPage };
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.getOne(id);
        });
    }
    getAll(q) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.getAll(q);
        });
    }
    update(id, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.update(id, entity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.delete(id);
        });
    }
}
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof T !== "undefined" && T) === "function" && _a || Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "create", null);
__decorate([
    common_1.Post('batch'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "updateBatch", null);
__decorate([
    common_1.Get('query'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "query", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "getOne", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "getAll", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_b = typeof T !== "undefined" && T) === "function" && _b || Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "delete", null);
exports.CrudController = CrudController;
//# sourceMappingURL=crud.controller.js.map