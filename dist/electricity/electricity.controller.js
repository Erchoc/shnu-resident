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
const electricity_service_1 = require("./electricity.service");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let ElectricityController = class ElectricityController extends crud_controller_1.CrudController {
    constructor(service) {
        super(service);
        this.service = service;
    }
    generate(season, raw) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            for (let region in raw) {
                raw[region].data.map(element => {
                    data.push(Object.assign({}, element, { region: raw[region].region }));
                });
            }
            let res = yield this.service.generate(parseInt(season), data);
            return res;
        });
    }
    generateSheetByYearAndSeason(year, season, resident, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.generateSheetByYearAndSeasonAndResident(year, season, resident);
            resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            resp.send(res);
        });
    }
};
__decorate([
    common_1.Post('season/:season/gen'),
    __param(0, common_1.Param('season')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ElectricityController.prototype, "generate", null);
__decorate([
    common_1.Get('season/:year/:season/resident/:resident/sheet'),
    __param(0, common_1.Param('year')), __param(1, common_1.Param('season')), __param(2, common_1.Param('resident')), __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ElectricityController.prototype, "generateSheetByYearAndSeason", null);
ElectricityController = __decorate([
    common_1.Controller('electricity'),
    __metadata("design:paramtypes", [electricity_service_1.ElectricityService])
], ElectricityController);
exports.ElectricityController = ElectricityController;
//# sourceMappingURL=electricity.controller.js.map