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
const electricity_service_1 = require("./electricity.service");
const electricity_entity_1 = require("./electricity.entity");
const electricity_controller_1 = require("./electricity.controller");
const booking_module_1 = require("../booking/booking.module");
let ElectricityModule = class ElectricityModule {
};
ElectricityModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([electricity_entity_1.Electricity]), booking_module_1.BookingModule],
        providers: [electricity_service_1.ElectricityService],
        controllers: [electricity_controller_1.ElectricityController],
        exports: [electricity_service_1.ElectricityService],
    })
], ElectricityModule);
exports.ElectricityModule = ElectricityModule;
//# sourceMappingURL=electricity.module.js.map