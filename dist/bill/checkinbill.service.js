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
const Excel = require("ejsexcel");
const fs = require("fs");
const util = require("util");
const checkinbill_entity_1 = require("./checkinbill.entity");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let CheckinBillService = class CheckinBillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, billService) {
        super(repo);
        this.repo = repo;
        this.billService = billService;
    }
    generateSheetByYearAndMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            let today = (new Date()).toISOString().split("T")[0];
            const excelBuf = yield readFileAsync(path_1.join(__dirname, '../resources/check.xlsx'));
            let data = yield this.repo.find({ where: { year: parseInt(year), month: parseInt(month) } });
            let dataToRender = data.map(r => { return Object.assign({}, r, { id: r.id + '', comment: r.comment ? r.comment : '' }); });
            let total = data.map(i => i.amount).reduce((a, b) => a + b);
            let footertext = '说明：1、有效刷卡时间为当日20:30--次日早上7点。2、以信息办提供刷卡记录为准。3、每日刷卡有效次数为一次,' + month + '月份按' + data[0].checkbase + '次计算））。4、扣费方式参考学校资产处网站【上海师范大学奉贤校区教职工住宿管理办法】。5、如有疑问请与资产处陆老师查询核对。办公室：徐汇行政楼608，电话：64323153';
            let arrToRender = [[{ booktitle: year + '年' + month + '月份奉贤教工楼教师入住刷卡收费情况', total: total, footer: today, footertext: footertext }], dataToRender];
            return yield Excel.renderExcel(excelBuf, arrToRender);
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
            const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial + bill.booking.room.resident.name);
            groupedByTeacher.forEach((bills, serial) => {
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
                    mb.month = bill.month;
                    mb.year = bill.year;
                    mb.serial = serial;
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
CheckinBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(checkinbill_entity_1.CheckinBill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bill_service_1.BillService])
], CheckinBillService);
exports.CheckinBillService = CheckinBillService;
//# sourceMappingURL=checkinbill.service.js.map