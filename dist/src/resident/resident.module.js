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
const resident_service_1 = require("./resident.service");
const resident_entity_1 = require("./resident.entity");
const resident_controller_1 = require("./resident.controller");
let ResidentModule = class ResidentModule {
};
ResidentModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([resident_entity_1.Resident])],
        providers: [resident_service_1.ResidentService],
        controllers: [resident_controller_1.ResidentController],
        exports: [resident_service_1.ResidentService],
    })
], ResidentModule);
exports.ResidentModule = ResidentModule;
//# sourceMappingURL=resident.module.js.map