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
const consts_service_1 = require("./consts.service");
const consts_entity_1 = require("./consts.entity");
const consts_controller_1 = require("./consts.controller");
let ConstsModule = class ConstsModule {
};
ConstsModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([consts_entity_1.Consts])],
        providers: [consts_service_1.ConstsService],
        controllers: [consts_controller_1.ConstsController],
        exports: [consts_service_1.ConstsService],
    })
], ConstsModule);
exports.ConstsModule = ConstsModule;
//# sourceMappingURL=consts.module.js.map