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
const bill_service_1 = require("./bill.service");
let BillController = class BillController extends crud_controller_1.CrudController {
    constructor(service) {
        super(service);
        this.service = service;
    }
    anomaly() {
        return __awaiter(this, void 0, void 0, function* () {
            let month = new Date().getMonth();
            let year = new Date().getFullYear();
            let r = yield this.service.generateAnomaly(month, year);
            return r;
        });
    }
    anomalySpecified(month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            let mm = parseInt(month);
            let yy = parseInt(year);
            let r = yield this.service.generateAnomaly(mm, yy);
            return r;
        });
    }
};
__decorate([
    common_1.Get('anomaly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillController.prototype, "anomaly", null);
__decorate([
    common_1.Get('anomaly/:year/:month'),
    __param(0, common_1.Param('month')), __param(1, common_1.Param('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "anomalySpecified", null);
BillController = __decorate([
    common_1.Controller('bill'),
    __metadata("design:paramtypes", [bill_service_1.BillService])
], BillController);
exports.BillController = BillController;
//# sourceMappingURL=bill.controller.js.map