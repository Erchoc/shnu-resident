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
const common_1 = require("@nestjs/common");
const crud_controller_1 = require("../infrastructure/nest-crud/crud.controller");
const monthlybill_service_1 = require("./monthlybill.service");
let MonthlyBillController = class MonthlyBillController extends crud_controller_1.CrudController {
    constructor(service) {
        super(service);
        this.service = service;
    }
    generateByYearAndMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.generateByYearAndMonth(year, month);
            return !!res;
        });
    }
    generateSheetByYearAndMonth(year, month, resident, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.generateSheetByYearAndMonthAndResident(year, month, resident);
            resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            resp.send(res);
        });
    }
};
__decorate([
    common_1.Get(':year/:month/gen'),
    __param(0, common_1.Param('year')), __param(1, common_1.Param('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MonthlyBillController.prototype, "generateByYearAndMonth", null);
__decorate([
    common_1.Get(':year/:month/resident/:resident/sheet'),
    __param(0, common_1.Param('year')), __param(1, common_1.Param('month')), __param(2, common_1.Param('resident')), __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MonthlyBillController.prototype, "generateSheetByYearAndMonth", null);
MonthlyBillController = __decorate([
    common_1.Controller('bill/monthly'),
    __metadata("design:paramtypes", [monthlybill_service_1.MonthlyBillService])
], MonthlyBillController);
exports.MonthlyBillController = MonthlyBillController;
//# sourceMappingURL=monthlybill.controller.js.map