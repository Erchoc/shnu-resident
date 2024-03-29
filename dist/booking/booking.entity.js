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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const room_entity_1 = require("../room/room.entity");
const bill_entity_1 = require("../bill/bill.entity");
const teacher_entity_1 = require("../teacher/teacher.entity");
let Booking = class Booking {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Booking.prototype, "checkin", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Booking.prototype, "checkout", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Booking.prototype, "start", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Booking.prototype, "end", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Booking.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Booking.prototype, "rent", void 0);
__decorate([
    typeorm_1.ManyToOne(type => room_entity_1.Room, { eager: true }),
    typeorm_1.JoinColumn({ name: 'r_id' }),
    __metadata("design:type", room_entity_1.Room)
], Booking.prototype, "room", void 0);
__decorate([
    typeorm_1.ManyToOne(type => teacher_entity_1.Teacher, { eager: true }),
    typeorm_1.JoinColumn({ name: 't_id' }),
    __metadata("design:type", teacher_entity_1.Teacher)
], Booking.prototype, "teacher", void 0);
__decorate([
    typeorm_1.OneToMany(type => bill_entity_1.Bill, bill => bill.booking, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], Booking.prototype, "bill", void 0);
Booking = __decorate([
    typeorm_1.Entity()
], Booking);
exports.Booking = Booking;
//# sourceMappingURL=booking.entity.js.map