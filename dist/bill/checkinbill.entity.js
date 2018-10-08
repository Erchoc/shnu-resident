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
let CheckinBill = class CheckinBill {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CheckinBill.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], CheckinBill.prototype, "institute", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], CheckinBill.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], CheckinBill.prototype, "serial", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], CheckinBill.prototype, "gender", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], CheckinBill.prototype, "room", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], CheckinBill.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], CheckinBill.prototype, "amountbase", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], CheckinBill.prototype, "check", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], CheckinBill.prototype, "checkbase", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], CheckinBill.prototype, "year", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], CheckinBill.prototype, "month", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Boolean)
], CheckinBill.prototype, "vacation", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], CheckinBill.prototype, "comment", void 0);
CheckinBill = __decorate([
    typeorm_1.Entity()
], CheckinBill);
exports.CheckinBill = CheckinBill;
//# sourceMappingURL=checkinbill.entity.js.map