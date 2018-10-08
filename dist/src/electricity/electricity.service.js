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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const electricity_entity_1 = require("./electricity.entity");
const crud_typeorm_service_1 = require("../infrastructure/nest-crud/crud-typeorm.service");
const booking_service_1 = require("../booking/booking.service");
const path_1 = require("path");
const moment = require("moment");
const Excel = require("ejsexcel");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let ElectricityService = class ElectricityService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, bookingService) {
        super(repo);
        this.repo = repo;
        this.bookingService = bookingService;
    }
    generate(season, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let year = new Date().getFullYear();
            yield this.deleteAll({ year: year, season: season });
            let res = [];
            let fails = [];
            for (let i in data) {
                let raw = data[i];
                let booking = yield this.bookingService.findBookingByRoomAndSeason(raw.region, raw.room, season);
                if (booking.length < 1) {
                    fails.push(raw);
                    continue;
                }
                let electricities = yield this.booking2electrity(booking, raw.price, season);
                res = res.concat(electricities);
            }
            yield this.updateBatch(res);
            return fails;
        });
    }
    generateSheetByYearAndSeasonAndResident(year, season, resident) {
        return __awaiter(this, void 0, void 0, function* () {
            const excelBuf = yield readFileAsync(path_1.join(__dirname, '../resources/electricity.xlsx'));
            let data = yield this.repo.find({ where: { year: parseInt(year), season: parseInt(season), resident: new typeorm_2.FindOperator('like', '%' + resident + '%') } });
            let dataToRender = data.map(r => { return { roomname: r.roomname, serial: r.serial, amount: r.amount, teachername: r.teachername, comment: r.comment }; });
            dataToRender.push({ roomname: '总计', amount: dataToRender.map(i => i.amount).reduce((a, b) => a + b) });
            let arrToRender = [[{ booktitle: resident + '公寓（' + year + '年第' + season + '季度)电费' }], dataToRender];
            return yield Excel.renderExcel(excelBuf, arrToRender);
        });
    }
    booking2electrity(b, amount, season) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            let startedAt = moment().month((season - 1) * 3).startOf('month').toDate();
            let endsAt = moment().month((season - 1) * 3 + 2).endOf('month').toDate();
            let days = b.map(i => moment(i.checkout > endsAt ? endsAt : i.checkout).diff(moment(i.checkin < startedAt ? startedAt : i.checkin), 'days') + 1);
            let daysSum = days.reduce((a, b) => a + b);
            for (let i = 0; i < b.length; i++) {
                let booking = b[i];
                booking.checkout = booking.checkout > endsAt ? endsAt : booking.checkout;
                booking.checkin = booking.checkin < startedAt ? startedAt : booking.checkin;
                let e = new electricity_entity_1.Electricity();
                e.amount = Math.ceil(days[i] / daysSum * amount);
                e.room = booking.room;
                e.roomname = booking.room.room;
                e.season = season;
                e.teacher = booking.teacher;
                e.teachername = booking.teacher.name;
                e.serial = booking.teacher.serial;
                e.year = new Date().getFullYear();
                e.resident = booking.room.resident.name + booking.room.block + '栋' + booking.room.room + '室';
                e.comment = '调试信息:电费总额' + amount + '，这季从' + moment(booking.checkin).format('YYYY-MM-DD') + '住到' + moment(booking.checkout).format('YYYY-MM-DD') + '一共' + days[i] + '天，该公寓这季所有人一共住了' + daysSum + '天，总额为向上取整(' + days[i] + '/' + daysSum + '*' + amount + ')';
                res.push(e);
            }
            return res;
        });
    }
};
ElectricityService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(electricity_entity_1.Electricity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        booking_service_1.BookingService])
], ElectricityService);
exports.ElectricityService = ElectricityService;
//# sourceMappingURL=electricity.service.js.map