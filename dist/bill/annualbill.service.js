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
const annualbill_entity_1 = require("./annualbill.entity");
const bill_service_1 = require("./bill.service");
const path_1 = require("path");
const Excel = require("ejsexcel");
const fs = require("fs");
const util = require("util");
const moment = require("moment");
const consts_service_1 = require("../consts/consts.service");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let AnnualBillService = class AnnualBillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, billService, constService) {
        super(repo);
        this.repo = repo;
        this.billService = billService;
        this.constService = constService;
    }
    generateSheetByResident(year, resident) {
        return __awaiter(this, void 0, void 0, function* () {
            const excelBuf = yield readFileAsync(path_1.join(__dirname, '../resources/AnnualBill.xlsx'));
            let data = yield this.repo.find({ where: { year: parseInt(year), resident: new typeorm_2.FindOperator('like', '%' + resident + '%') } });
            let dataToRender = data.map(i => {
                return Object.assign({}, i, { id: i.id + '', startend1: i.start1 + '~' + i.end1, startend2: i.start2 + '~' + i.end2, checkinout: i.checkin + '~' + i.checkout });
            });
            dataToRender.push({ id: '总计', amount: dataToRender.map(i => i.amount).reduce((a, b) => a + b), subsidy: dataToRender.map(i => i.subsidy).reduce((a, b) => a + b) });
            let arrToRender = [[{ booktitle: resident + '公寓（' + year + '年)' }], dataToRender];
            return yield Excel.renderExcel(excelBuf, arrToRender);
        });
    }
    generate(year) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentYear = (new Date()).getFullYear();
            if (currentYear !== parseInt(year))
                return null;
            let findOption = { year: parseInt(year) };
            yield this.repo.delete(findOption);
            let bills = yield this.billService.getAll({ where: findOption, relations: ['booking'] });
            let res = yield this.groupBillsAndGenSeasonByTeacher(bills);
            return this.repo.save(res);
        });
    }
    groupBillsAndGenSeasonByTeacher(bills) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            let subsidyRate = yield this.constService.getAll({ field: 'rate' });
            let realSubsidyRate = subsidyRate && subsidyRate[0] ? parseInt(subsidyRate[0].value) / 100 : 0.5;
            const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial + bill.booking.room.resident.name);
            groupedByTeacher.forEach((bills, serial) => {
                let ab = new annualbill_entity_1.AnnualBill();
                let monthStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
                let bookingStats = {};
                let bookingKeyLists = [];
                let subsidyDisabled = false;
                ab.amount = 0;
                ab.month12 = '';
                bills.forEach((bill) => {
                    monthStats[bill.month] += (bill.amount);
                    bookingStats[bill.booking.checkin.getTime() + ''] = bill.booking;
                    if (bookingKeyLists.length < 1 || bookingKeyLists[bookingKeyLists.length - 1] !== bill.booking.checkin.getTime()) {
                        bookingKeyLists.push(bill.booking.checkin.getTime());
                    }
                    if (bill.type === '正常') {
                        let earlierDate = bill.booking.start > bill.booking.checkin ? bill.booking.checkin : bill.booking.start;
                        if (ab.checkin) {
                            ab.checkin = ab.checkin > earlierDate ? earlierDate : ab.checkin;
                        }
                        else {
                            ab.checkin = earlierDate;
                        }
                        let laterDate = bill.booking.end > bill.booking.checkout ? bill.booking.end : bill.booking.checkout;
                        if (ab.checkout) {
                            ab.checkout = ab.checkout > laterDate ? ab.checkout : laterDate;
                        }
                        else {
                            ab.checkout = laterDate;
                        }
                    }
                    else {
                        subsidyDisabled = true;
                    }
                    ab.name = bill.booking.teacher.name;
                    ab.institute = bill.booking.teacher.institute;
                    ab.contact = bill.booking.teacher.contact;
                    ab.year = bill.year;
                    ab.serial = serial;
                    ab.resident = bill.booking.room.resident.name + bill.booking.room.block + '栋' + bill.booking.room.room + '室';
                });
                for (let i = 1; i < 13; i++) {
                    ab.amount += monthStats[i];
                    ab.month12 += (monthStats[i] + ',');
                }
                ab.month12 = ab.month12.slice(0, -1);
                let realCheckout = moment(ab.checkout) > moment().endOf('year') ? moment().endOf('year') : moment(ab.checkout);
                let realCheckIn = moment(ab.checkin) < moment().startOf('year') ? moment().startOf('year') : moment(ab.checkin);
                let daysDiff = moment(realCheckout).diff(moment(realCheckIn), 'days') + 1;
                ab.subsidy = subsidyDisabled ? 0 : Math.ceil(ab.amount * realSubsidyRate * (daysDiff / 365));
                ab.comment = subsidyDisabled ? '补贴计算调试信息：有异常情况' : '补贴计算调试信息：' + ab.amount + '*' + realSubsidyRate + '*(' + daysDiff + ' / 365)' + ',其中实际结算的日期为' + realCheckIn.format('YYYY-MM-DD') + '至' + realCheckout.format('YYYY-MM-DD');
                let b1, b2;
                if (bookingKeyLists.length > 1) {
                    if (bookingKeyLists[0] < bookingKeyLists[1]) {
                        b1 = bookingStats[bookingKeyLists[0]];
                        b2 = bookingStats[bookingKeyLists[1]];
                    }
                    else {
                        b1 = bookingStats[bookingKeyLists[1]];
                        b2 = bookingStats[bookingKeyLists[0]];
                    }
                    ab.amount1 = b1.rent;
                    ab.start1 = b1.start;
                    ab.end1 = b1.end;
                    ab.amount2 = b2.rent;
                    ab.start2 = b2.start;
                    ab.end2 = b2.end;
                }
                else {
                    b1 = bookingStats[bookingKeyLists[0]];
                    ab.amount1 = b1.rent;
                    ab.start1 = b1.start;
                    ab.end1 = b1.end;
                    ab.amount2 = 0;
                    ab.start2 = null;
                    ab.end2 = null;
                }
                res.push(ab);
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
AnnualBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(annualbill_entity_1.AnnualBill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bill_service_1.BillService,
        consts_service_1.ConstsService])
], AnnualBillService);
exports.AnnualBillService = AnnualBillService;
//# sourceMappingURL=annualbill.service.js.map