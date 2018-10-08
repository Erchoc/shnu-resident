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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const teacher_module_1 = require("./teacher/teacher.module");
const room_module_1 = require("./room/room.module");
const resident_module_1 = require("./resident/resident.module");
const electricity_module_1 = require("./electricity/electricity.module");
const consts_module_1 = require("./consts/consts.module");
const booking_module_1 = require("./booking/booking.module");
const bill_module_1 = require("./bill/bill.module");
const auth_module_1 = require("./infrastructure/auth/auth.module");
const helmet_1 = require("@nest-middlewares/helmet");
let AppModule = class AppModule {
    constructor(connection) {
        this.connection = connection;
    }
    configure(consumer) {
        helmet_1.HelmetMiddleware.configure({});
        consumer.apply(helmet_1.HelmetMiddleware).forRoutes(app_controller_1.AppController);
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(),
            teacher_module_1.TeacherModule,
            room_module_1.RoomModule,
            resident_module_1.ResidentModule,
            electricity_module_1.ElectricityModule,
            consts_module_1.ConstsModule,
            booking_module_1.BookingModule,
            bill_module_1.BillModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map