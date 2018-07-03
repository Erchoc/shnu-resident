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
let MonthlyBill = class MonthlyBill {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MonthlyBill.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], MonthlyBill.prototype, "institute", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], MonthlyBill.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], MonthlyBill.prototype, "serial", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], MonthlyBill.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], MonthlyBill.prototype, "diff", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], MonthlyBill.prototype, "year", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], MonthlyBill.prototype, "month", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], MonthlyBill.prototype, "resident", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], MonthlyBill.prototype, "comment", void 0);
MonthlyBill = __decorate([
    typeorm_1.Entity()
], MonthlyBill);
exports.MonthlyBill = MonthlyBill;
//# sourceMappingURL=monthlybill.entity.js.map