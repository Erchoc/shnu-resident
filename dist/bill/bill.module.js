"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bill_entity_1 = require("./bill.entity");
const bill_service_1 = require("./bill.service");
const bill_controller_1 = require("./bill.controller");
const monthlybill_controller_1 = require("./monthlybill.controller");
const monthlybill_service_1 = require("./monthlybill.service");
const monthlybill_entity_1 = require("./monthlybill.entity");
let BillModule = class BillModule {
};
BillModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([bill_entity_1.Bill]), typeorm_1.TypeOrmModule.forFeature([monthlybill_entity_1.MonthlyBill])],
        providers: [bill_service_1.BillService, monthlybill_service_1.MonthlyBillService],
        controllers: [bill_controller_1.BillController, monthlybill_controller_1.MonthlyBillController],
        exports: [bill_service_1.BillService, monthlybill_service_1.MonthlyBillService],
    })
], BillModule);
exports.BillModule = BillModule;
//# sourceMappingURL=bill.module.js.map