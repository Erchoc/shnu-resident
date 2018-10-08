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
const booking_entity_1 = require("./booking.entity");
const crud_typeorm_service_1 = require("../infrastructure/nest-crud/crud-typeorm.service");
const room_service_1 = require("../room/room.service");
const resident_service_1 = require("../resident/resident.service");
const moment = require("moment");
const teacher_service_1 = require("../teacher/teacher.service");
let BookingService = class BookingService extends crud_typeorm_service_1.CrudTypeOrmService {
    constructor(repo, roomService, residentService, teacherSercive) {
        super(repo);
        this.repo = repo;
        this.roomService = roomService;
        this.residentService = residentService;
        this.teacherSercive = teacherSercive;
    }
    saveProccess(entity) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            entity = yield _super("saveProccess").call(this, entity);
            entity = yield this.updateRoom(entity);
            return entity;
        });
    }
    findBookingByRoomAndSeason(region, room, season) {
        return __awaiter(this, void 0, void 0, function* () {
            let residents = yield this.residentService.getAll({ name: new typeorm_2.FindOperator('like', '%' + region + '%') });
            if (residents.length < 1)
                return [];
            let rooms = yield this.roomService.getAll({ resident: new typeorm_2.FindOperator('in', residents.map(r => r.id)), room: room });
            if (rooms.length < 1)
                return [];
            let startedAt = moment().month((season - 1) * 3).startOf('month').toDate();
            let endsAt = moment().month((season - 1) * 3 + 2).endOf('month').toDate();
            return yield this.getAll({ room: new typeorm_2.FindOperator('in', rooms.map(r => r.id)), checkin: new typeorm_2.FindOperator('lessThan', endsAt), checkout: new typeorm_2.FindOperator('moreThan', startedAt) });
        });
    }
    findBookingByRoomBlockTeacherNameAndSeason(region, room, block, name, season) {
        return __awaiter(this, void 0, void 0, function* () {
            let residents = yield this.residentService.getAll({ name: new typeorm_2.FindOperator('like', '%' + region + '%') });
            if (residents.length < 1)
                return [];
            let rooms = yield this.roomService.getAll({ resident: new typeorm_2.FindOperator('in', residents.map(r => r.id)), room: room, block: block });
            if (rooms.length < 1)
                return [];
            let teachers = yield this.teacherSercive.getAll({ name: name });
            if (teachers.length < 1)
                return [];
            let startedAt = moment().month((season - 1) * 3).startOf('month').toDate();
            let endsAt = moment().month((season - 1) * 3 + 2).endOf('month').toDate();
            return yield this.getAll({ room: new typeorm_2.FindOperator('in', rooms.map(r => r.id)), teacher: new typeorm_2.FindOperator('in', teachers.map(r => r.id)), checkin: new typeorm_2.FindOperator('lessThan', endsAt), checkout: new typeorm_2.FindOperator('moreThan', startedAt) });
        });
    }
    updateRoom(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let newRoom = entity.room;
            delete newRoom.id;
            let [rooms, roomResult] = yield this.roomService.query(newRoom);
            if (roomResult > 0) {
                entity.room = rooms[0];
            }
            else {
                newRoom = yield this.roomService.create(newRoom);
                entity.room = newRoom;
            }
            return entity;
        });
    }
};
BookingService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        room_service_1.RoomService,
        resident_service_1.ResidentService,
        teacher_service_1.TeacherService])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map