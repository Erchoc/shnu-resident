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
const monthlybill_entity_1 = require("./monthlybill.entity");
const bill_service_1 = require("./bill.service");
const path_1 = require("path");
const ejsexcelplus_1 = require("../../lib/ejsexcelplus");
const fs = require("fs");
const util = require("util");
const resident_service_1 = require("../resident/resident.service");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let MonthlyBillService = class MonthlyBillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, billService, residentService) {
        super(repo);
        this.repo = repo;
        this.billService = billService;
        this.residentService = residentService;
    }
    generateSheetByYearAndMonthAndResident(year, month, resident) {
        return __awaiter(this, void 0, void 0, function* () {
            const excelBuf = yield readFileAsync(path_1.join(__dirname, '../resources/monthlyBill.xlsx'));
            let realResidents = yield this.residentService.getAll({ name: new typeorm_2.FindOperator('like', '%' + resident + '%') });
            let realResident = realResidents[0];
            if (!realResident)
                return yield ejsexcelplus_1.renderExcel(excelBuf, [[{ booktitle: resident + '公寓（' + year + '年' + month + '月)' }], []]);
            let realMonth = parseInt(month) + realResident.monthdiff;
            let data = yield this.repo.find({ where: { year: parseInt(year), month: parseInt(month), resident: new typeorm_2.FindOperator('like', '%' + realResident.name + '%') } });
            if (data.length < 1)
                return yield ejsexcelplus_1.renderExcel(excelBuf, [[{ booktitle: realResident.name + '公寓（' + year + '年' + month + '月)' }], []]);
            let dataToRender = data.map(r => {
                if (r.amount_differed) {
                    return { id: r.id + '**RED**', name: r.name + '**RED**', serial: r.serial + '**RED**', amount: r.amount + '**RED**' };
                }
                else {
                    return { id: r.id + '', name: r.name, serial: r.serial, amount: r.amount };
                }
            });
            dataToRender.push({ id: '总计', amount: data.map(i => i.amount).reduce((a, b) => a + b) });
            let arrToRender = [[{ booktitle: resident + '公寓（' + year + '年' + month + '月)' }], dataToRender];
            return yield ejsexcelplus_1.renderExcel(excelBuf, arrToRender);
        });
    }
    generateByYearAndMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parseInt(month) !== ((new Date()).getMonth()) + 1)
                return null;
            let findOption = { year: parseInt(year), month: parseInt(month) };
            yield this.repo.delete(findOption);
            let bills = yield this.billService.getAll({ where: Object.assign({}, findOption), relations: ['booking'] });
            let res = yield this.groupBillsAndGenMonthlyByTeacher(bills);
            return this.repo.save(res);
        });
    }
    groupBillsAndGenMonthlyByTeacher(bills) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            let grouped = yield this.groupBy(bills, bill => bill.booking.teacher.serial +
                bill.booking.room.resident.name);
            for (let [key, bills] of grouped.entries()) {
                let mb = yield this.multipleBillsToSingleMonthlyBill(bills, key);
                res.push(mb);
            }
            return res;
        });
    }
    multipleBillsToSingleMonthlyBill(bills, serial) {
        return __awaiter(this, void 0, void 0, function* () {
            let mb = new monthlybill_entity_1.MonthlyBill();
            mb.amount = 0;
            mb.diff = 0;
            bills.forEach(bill => {
                if (bill.type === '正常')
                    mb.amount += bill.amount;
                else
                    mb.diff += bill.amount;
                mb.name = bill.booking.teacher.name;
                mb.institute = bill.booking.teacher.institute;
                mb.serial = bill.booking.teacher.serial;
                mb.month = bill.month;
                mb.year = bill.year;
                mb.resident = bill.booking.room.resident.name +
                    bill.booking.room.block + '栋' +
                    bill.booking.room.room + '室';
            });
            mb.amount_differed = yield this.isAmountDifferedFromPreviousMonth(mb);
            return mb;
        });
    }
    isAmountDifferedFromPreviousMonth(mb) {
        return __awaiter(this, void 0, void 0, function* () {
            let previousOptions = JSON.parse(JSON.stringify(mb));
            delete previousOptions.amount;
            delete previousOptions.diff;
            delete previousOptions.id;
            delete previousOptions.comment;
            if (previousOptions.month === 1) {
                previousOptions.year -= 1;
                previousOptions.month = 12;
            }
            else {
                previousOptions.month -= 1;
            }
            let previousBills = yield this.getAll(previousOptions);
            if (previousBills.length < 1) {
                return false;
            }
            else {
                let previousBill = previousBills[0];
                return previousBill.amount !== mb.amount;
            }
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
MonthlyBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(monthlybill_entity_1.MonthlyBill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bill_service_1.BillService,
        resident_service_1.ResidentService])
], MonthlyBillService);
exports.MonthlyBillService = MonthlyBillService;
//# sourceMappingURL=monthlybill.service.js.map