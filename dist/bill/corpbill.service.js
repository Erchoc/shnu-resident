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
const bill_service_1 = require("./bill.service");
const fs = require("fs");
const util = require("util");
const corpbill_entity_1 = require("./corpbill.entity");
const resident_service_1 = require("../resident/resident.service");
const room_service_1 = require("../room/room.service");
const teacher_service_1 = require("../teacher/teacher.service");
const booking_service_1 = require("../booking/booking.service");
const consts_service_1 = require("../consts/consts.service");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
let CorpBillService = class CorpBillService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, billService, residentService, roomService, teacherService, bookingService, constService) {
        super(repo);
        this.repo = repo;
        this.billService = billService;
        this.residentService = residentService;
        this.roomService = roomService;
        this.teacherService = teacherService;
        this.bookingService = bookingService;
        this.constService = constService;
    }
    generateBySeasonAndResident(season, resident, raw) {
        return __awaiter(this, void 0, void 0, function* () {
            let r = yield this.residentService.getOne(resident);
            let findOption = { year: new Date().getFullYear(), season: season, residentname: new typeorm_2.FindOperator('like', '%' + r.name + '%') };
            yield this.repo.delete(findOption);
            let fail = [];
            let success = [];
            let rate = yield this.constService.getAll({ field: 'rate' });
            let realRate = rate && rate.length > 0 ? parseInt(rate[0].value) / 100 : 0.5;
            for (let indice in raw) {
                let i = raw[indice];
                let cb = new corpbill_entity_1.CorpBill();
                let bookings = yield this.bookingService.findBookingByRoomBlockTeacherNameAndSeason(r.name, i.roomname, i.block, i.name, season);
                if (bookings.length < 1) {
                    fail.push(i);
                    continue;
                }
                let room = bookings[0].room;
                cb.roomname = room.room;
                cb.start = new Date(i.start);
                cb.end = new Date(i.end);
                cb.block = room.block;
                cb.amount = parseInt(i.amount + '');
                cb.name = bookings[0].teacher.name;
                cb.season = season;
                cb.residentname = r.name;
                cb.teacher = bookings[0].teacher;
                cb.room = room;
                cb.subsidy = cb.amount * realRate;
                cb.year = new Date().getFullYear();
                success.push(cb);
            }
            this.updateBatch(success);
            return fail;
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
CorpBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(corpbill_entity_1.CorpBill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bill_service_1.BillService,
        resident_service_1.ResidentService,
        room_service_1.RoomService,
        teacher_service_1.TeacherService,
        booking_service_1.BookingService,
        consts_service_1.ConstsService])
], CorpBillService);
exports.CorpBillService = CorpBillService;
//# sourceMappingURL=corpbill.service.js.map