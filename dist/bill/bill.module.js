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
const seasonbill_service_1 = require("./seasonbill.service");
const seasonbill_controller_1 = require("./seasonbill.controller");
const seasonbill_entity_1 = require("./seasonbill.entity");
const annualbill_controller_1 = require("./annualbill.controller");
const annualbill_entity_1 = require("./annualbill.entity");
const annualbill_service_1 = require("./annualbill.service");
const consts_module_1 = require("../consts/consts.module");
const corpbill_service_1 = require("./corpbill.service");
const corpbill_controller_1 = require("./corpbill.controller");
const corpbill_entity_1 = require("./corpbill.entity");
const teacher_module_1 = require("../teacher/teacher.module");
const room_module_1 = require("../room/room.module");
const resident_module_1 = require("../resident/resident.module");
const booking_module_1 = require("../booking/booking.module");
const checkinbill_service_1 = require("./checkinbill.service");
const checkinbill_controller_1 = require("./checkinbill.controller");
const checkinbill_entity_1 = require("./checkinbill.entity");
let BillModule = class BillModule {
};
BillModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([bill_entity_1.Bill, monthlybill_entity_1.MonthlyBill, seasonbill_entity_1.SeasonBill, annualbill_entity_1.AnnualBill, corpbill_entity_1.CorpBill, checkinbill_entity_1.CheckinBill]), consts_module_1.ConstsModule, teacher_module_1.TeacherModule, room_module_1.RoomModule, resident_module_1.ResidentModule, booking_module_1.BookingModule],
        providers: [bill_service_1.BillService, monthlybill_service_1.MonthlyBillService, seasonbill_service_1.SeasonBillService, annualbill_service_1.AnnualBillService, corpbill_service_1.CorpBillService, checkinbill_service_1.CheckinBillService],
        controllers: [bill_controller_1.BillController, monthlybill_controller_1.MonthlyBillController, seasonbill_controller_1.SeasonBillController, annualbill_controller_1.AnnualBillController, corpbill_controller_1.CorpBillController, checkinbill_controller_1.CheckinBillController],
        exports: [bill_service_1.BillService, monthlybill_service_1.MonthlyBillService, seasonbill_service_1.SeasonBillService, annualbill_service_1.AnnualBillService, corpbill_service_1.CorpBillService, checkinbill_service_1.CheckinBillService],
    })
], BillModule);
exports.BillModule = BillModule;
//# sourceMappingURL=bill.module.js.map