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
let MonthlyBillService = class MonthlyBillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, billService) {
        super(repo);
        this.repo = repo;
        this.billService = billService;
    }
    generateByYearAndMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parseInt(month) !== ((new Date()).getMonth()) + 1)
                return null;
            let findOption = { year: parseInt(year), month: parseInt(month) };
            yield this.repo.delete(findOption);
            let bills = yield this.billService.getAll(findOption);
            let res = yield this.groupBillsAndGenMonthlyByTeacher(bills);
            return this.repo.save(res);
        });
    }
    groupBillsAndGenMonthlyByTeacher(bills) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial);
            groupedByTeacher.forEach((bills, teacher) => {
                let mb = new monthlybill_entity_1.MonthlyBill();
                mb.amount = 0;
                mb.diff = 0;
                bills.forEach(bill => {
                    if (bill.type === '正常')
                        mb.amount += bill.amount;
                    else
                        mb.diff += bill.amount;
                    mb.institute = teacher.institute;
                    mb.month = bill.month;
                    mb.year = bill.year;
                    mb.serial = teacher.serial;
                    mb.resident = bill.booking.room.resident.name + bill.booking.room.block + '栋' + bill.booking.room.room + '室';
                });
                res.push(mb);
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
MonthlyBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(monthlybill_entity_1.MonthlyBill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bill_service_1.BillService])
], MonthlyBillService);
exports.MonthlyBillService = MonthlyBillService;
//# sourceMappingURL=monthlybill.service.js.map