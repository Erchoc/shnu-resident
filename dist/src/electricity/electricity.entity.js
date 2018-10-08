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
const teacher_entity_1 = require("../teacher/teacher.entity");
let Electricity = class Electricity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Electricity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Electricity.prototype, "season", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Electricity.prototype, "year", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Electricity.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Electricity.prototype, "roomname", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Electricity.prototype, "teachername", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Electricity.prototype, "serial", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Electricity.prototype, "comment", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Electricity.prototype, "resident", void 0);
__decorate([
    typeorm_1.ManyToOne(type => room_entity_1.Room),
    typeorm_1.JoinColumn({ name: 'r_id' }),
    __metadata("design:type", room_entity_1.Room)
], Electricity.prototype, "room", void 0);
__decorate([
    typeorm_1.ManyToOne(type => teacher_entity_1.Teacher),
    typeorm_1.JoinColumn({ name: 't_id' }),
    __metadata("design:type", teacher_entity_1.Teacher)
], Electricity.prototype, "teacher", void 0);
Electricity = __decorate([
    typeorm_1.Entity()
], Electricity);
exports.Electricity = Electricity;
//# sourceMappingURL=electricity.entity.js.map