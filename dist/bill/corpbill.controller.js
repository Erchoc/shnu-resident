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
const corpbill_service_1 = require("./corpbill.service");
let CorpBillController = class CorpBillController extends crud_controller_1.CrudController {
    constructor(service) {
        super(service);
        this.service = service;
    }
    generateBySeasonAndResident(season, resident, raw) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.generateBySeasonAndResident(parseInt(season), parseInt(resident), raw);
            return res;
        });
    }
    generateSheetBySeasonAndResident(year) {
        return __awaiter(this, void 0, void 0, function* () {
            let raw = yield this.service.getAll({ year: parseInt(year) });
            let grouped = this.groupBy(raw, corpBill => corpBill.season);
            let count = [{ name: '第一季度', amount: 0, subsidy: 0, children: [] }, { name: '第二季度', amount: 0, subsidy: 0, children: [] }, { name: '第三季度', amount: 0, subsidy: 0, children: [] }, { name: '第四季度', amount: 0, subsidy: 0, children: [] }];
            grouped.forEach((corpBills, season) => {
                corpBills.map(corpBill => {
                    count[season - 1].amount += Math.ceil(corpBill.amount);
                    count[season - 1].subsidy += Math.ceil(corpBill.subsidy);
                    count[season - 1].children.push(corpBill);
                });
            });
            return count;
        });
    }
    groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            }
            else {
                collection.push(item);
            }
        });
        return map;
    }
};
__decorate([
    common_1.Post('season/:season/resident/:resident/gen'),
    __param(0, common_1.Param('season')), __param(1, common_1.Param('resident')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], CorpBillController.prototype, "generateBySeasonAndResident", null);
__decorate([
    common_1.Get('year/:year'),
    __param(0, common_1.Param('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CorpBillController.prototype, "generateSheetBySeasonAndResident", null);
CorpBillController = __decorate([
    common_1.Controller('bill/corp'),
    __metadata("design:paramtypes", [corpbill_service_1.CorpBillService])
], CorpBillController);
exports.CorpBillController = CorpBillController;
//# sourceMappingURL=corpbill.controller.js.map