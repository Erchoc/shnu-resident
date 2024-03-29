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
const booking_service_1 = require("./booking.service");
const booking_entity_1 = require("./booking.entity");
const booking_controller_1 = require("./booking.controller");
const room_module_1 = require("../room/room.module");
const resident_module_1 = require("../resident/resident.module");
const teacher_module_1 = require("../teacher/teacher.module");
let BookingModule = class BookingModule {
};
BookingModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking]), room_module_1.RoomModule, resident_module_1.ResidentModule, teacher_module_1.TeacherModule],
        providers: [booking_service_1.BookingService],
        controllers: [booking_controller_1.BookingController],
        exports: [booking_service_1.BookingService],
    })
], BookingModule);
exports.BookingModule = BookingModule;
//# sourceMappingURL=booking.module.js.map