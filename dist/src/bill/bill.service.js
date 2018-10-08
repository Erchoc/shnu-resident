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
const bill_entity_1 = require("./bill.entity");
const crud_typeorm_service_1 = require("../infrastructure/nest-crud/crud-typeorm.service");
const booking_service_1 = require("../booking/booking.service");
const moment = require("moment");
let BillService = class BillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, bookingService) {
        super(repo);
        this.repo = repo;
        this.bookingService = bookingService;
    }
    generateAnomaly(month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            let q = yield this.repo.createQueryBuilder("bill")
                .select("distinct type,booking_id")
                .where("type != :t", { t: '正常' })
                .groupBy("type").addGroupBy("booking_id")
                .having("max(year*100+month)=:mm", { mm: year * 100 + month })
                .getRawMany();
            let res = yield Promise.all(q.map((i) => __awaiter(this, void 0, void 0, function* () { return yield this.generateAnomalyHelper(i); })));
            return res;
        });
    }
    findInRange(from, to, resident) {
        return __awaiter(this, void 0, void 0, function* () {
            resident = resident ? resident : '';
            let fromDate = moment(from);
            let toDate = moment(to);
            let qb = this.repo.createQueryBuilder("bill")
                .leftJoinAndSelect("bill.booking", "booking")
                .leftJoinAndSelect("booking.teacher", "teacher")
                .leftJoinAndSelect("booking.room", "room")
                .leftJoinAndSelect("room.resident", "resident")
                .where("(year*100+month) between :from and :to", { from: fromDate.year() * 100 + (fromDate.month() + 1), to: toDate.year() * 100 + (toDate.month() + 1) });
            if (resident) {
                qb = qb.andWhere("resident likes %:resident%", { resident: resident });
            }
            return yield qb.getMany();
        });
    }
    generateAnomalyHelper({ type, booking_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            let booking = yield this.bookingService.getOne(booking_id);
            return { type: type,
                bookingId: booking.id,
                name: booking.teacher.name,
                institute: booking.teacher.institute,
                resident: booking.room.resident,
                serial: booking.teacher.serial
            };
        });
    }
};
BillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(bill_entity_1.Bill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        booking_service_1.BookingService])
], BillService);
exports.BillService = BillService;
//# sourceMappingURL=bill.service.js.map