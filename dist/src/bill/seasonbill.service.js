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
const crud_typeorm_service_1 = require("../infrastructure/nest-crud/crud-typeorm.service");
const seasonbill_entity_1 = require("./seasonbill.entity");
const bill_service_1 = require("./bill.service");
const path_1 = require("path");
const Excel = require("ejsexcel");
const fs = require("fs");
const util = require("util");
const resident_service_1 = require("../resident/resident.service");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const XLSX = require("exceljs");
const stream = require('stream');
let SeasonBillService = class SeasonBillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, billService, residentService) {
        super(repo);
        this.repo = repo;
        this.billService = billService;
        this.residentService = residentService;
    }
    generateSheetByYearAndSeasonAndResident(year, season, resident) {
        return __awaiter(this, void 0, void 0, function* () {
            const excelBuf = yield readFileAsync(path_1.join(__dirname, '../resources/SeasonBill.xlsx'));
            let data = yield this.repo.find({ where: { year: parseInt(year), season: parseInt(season), resident: new typeorm_2.FindOperator('like', '%' + resident + '%') } });
            if (!data || data.length < 1)
                return yield Excel.renderExcel(excelBuf, [[{ booktitle: resident + '公寓（' + year + '年第' + season + '季度)' }], [{}]]);
            let dataToRender = data.map(r => { return { id: r.id + '', resident: r.resident, contact: r.contact, start: r.start, end: r.end, institute: r.institute, name: r.name, serial: r.serial, amount: r.month1 + r.month2 + r.month3, month1: r.month1, month2: r.month2, month3: r.month3 }; });
            dataToRender.push({ id: '总计', amount: dataToRender.map(i => i.amount).reduce((a, b) => a + b), month1: dataToRender.map(i => i.month1).reduce((a, b) => a + b), month2: dataToRender.map(i => i.month2).reduce((a, b) => a + b), month3: dataToRender.map(i => i.month3).reduce((a, b) => a + b) });
            let arrToRender = [[{ booktitle: resident + '公寓（' + year + '年第' + season + '季度)' }], dataToRender];
            return yield Excel.renderExcel(excelBuf, arrToRender);
        });
    }
    generateSheetByYearAndSeason(year, season, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let wbGeneral = new XLSX.Workbook();
            let allResidents = yield this.residentService.getAll({});
            for (let i in allResidents) {
                let j = allResidents[i];
                let wbSub = new XLSX.Workbook();
                let sub = yield this.generateSheetByYearAndSeasonAndResident(year, season, j.name);
                var bufferStream = new stream.PassThrough();
                bufferStream.end(new Buffer(sub));
                let workbook = yield wbSub.xlsx.read(bufferStream);
                let wsSub = workbook.getWorksheet(1);
                let wsGen = wbGeneral.addWorksheet(j.name, { pageSetup: wsSub.pageSetup, views: wsSub.views, properties: wsSub.properties });
                wsGen.model = wsSub.model;
                wsGen.name = j.name;
                for (let masterName in wsSub._merges) {
                    let dimensions = wsSub._merges[masterName].model;
                    let master = wsGen.getCell(dimensions.top, dimensions.left);
                    for (let i = dimensions.top; i <= dimensions.bottom; i++) {
                        for (let j = dimensions.left; j <= dimensions.right; j++) {
                            if ((i > dimensions.top) || (j > dimensions.left)) {
                                wsGen.getCell(i, j).merge(master);
                            }
                        }
                    }
                }
            }
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');
            return yield wbGeneral.xlsx.write(res);
        });
    }
    generateByYearAndSeason(year, season) {
        return __awaiter(this, void 0, void 0, function* () {
            let monthBase = (parseInt(season) - 1) * 3 + 1;
            let currentMonth = ((new Date()).getMonth()) + 1;
            if (currentMonth < monthBase || currentMonth > monthBase + 2)
                return null;
            let findOption = { where: { year: parseInt(year), month: new typeorm_2.FindOperator('in', [monthBase, monthBase + 1, monthBase + 2]) } };
            yield this.repo.delete({ year: parseInt(year), season: parseInt(season) });
            let bills = yield this.billService.getAll(Object.assign({}, findOption, { relations: ['booking'] }));
            let res = yield this.groupBillsAndGenSeasonByTeacher(bills, parseInt(season));
            return this.repo.save(res);
        });
    }
    groupBillsAndGenSeasonByTeacher(bills, season) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            let monthBase = (season - 1) * 3 + 1;
            const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial + bill.booking.room.resident.name);
            groupedByTeacher.forEach((bills, serial) => {
                let sb = new seasonbill_entity_1.SeasonBill();
                sb.month1 = 0;
                sb.month2 = 0;
                sb.month3 = 0;
                bills.forEach((bill) => {
                    if (bill.month === monthBase) {
                        sb.month1 += bill.amount;
                        if (bill.type === '正常') {
                            let earlierDate = bill.booking.start > bill.booking.checkin ? bill.booking.checkin : bill.booking.start;
                            if (sb.start) {
                                sb.start = sb.start > earlierDate ? earlierDate : sb.start;
                            }
                            else {
                                sb.start = earlierDate;
                            }
                        }
                    }
                    else if (bill.month === monthBase + 1) {
                        sb.month2 += bill.amount;
                    }
                    else {
                        sb.month3 += bill.amount;
                        if (bill.type === '正常') {
                            let laterDate = bill.booking.end > bill.booking.checkout ? bill.booking.end : bill.booking.checkout;
                            if (sb.end) {
                                sb.end = sb.end > laterDate ? sb.end : laterDate;
                            }
                            else {
                                sb.end = laterDate;
                            }
                        }
                    }
                    sb.name = bill.booking.teacher.name;
                    sb.institute = bill.booking.teacher.institute;
                    sb.contact = bill.booking.teacher.contact;
                    sb.season = season;
                    sb.year = bill.year;
                    sb.serial = bill.booking.teacher.serial;
                    sb.resident = bill.booking.room.resident.name + bill.booking.room.block + '栋' + bill.booking.room.room + '室';
                    sb.comment = '调试信息：' + serial;
                });
                res.push(sb);
            });
            return res;
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
SeasonBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(seasonbill_entity_1.SeasonBill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bill_service_1.BillService,
        resident_service_1.ResidentService])
], SeasonBillService);
exports.SeasonBillService = SeasonBillService;
//# sourceMappingURL=seasonbill.service.js.map