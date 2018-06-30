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
const booking_entity_1 = require("../booking/booking.entity");
let Bill = class Bill {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Bill.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Bill.prototype, "month", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Bill.prototype, "year", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Bill.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Bill.prototype, "comment", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], Bill.prototype, "diff", void 0);
__decorate([
    typeorm_1.ManyToOne(type => booking_entity_1.Booking),
    typeorm_1.JoinColumn({ name: 'booking_id' }),
    __metadata("design:type", booking_entity_1.Booking)
], Bill.prototype, "room", void 0);
Bill = __decorate([
    typeorm_1.Entity()
], Bill);
exports.Bill = Bill;
//# sourceMappingURL=bill.entity.js.map