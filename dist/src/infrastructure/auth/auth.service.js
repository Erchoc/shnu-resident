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
const jwt = require("jsonwebtoken");
const consts_service_1 = require("../../consts/consts.service");
let AuthService = class AuthService {
    constructor(constsService) {
        this.constsService = constsService;
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validateUser(user)) {
                return jwt.sign(user, 'secretKey', { expiresIn: 3600 });
            }
        });
    }
    validateUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let pass = yield this.constsService.getPassword();
            if (payload && payload.password === pass) {
                return yield { username: 'admin', password: pass };
            }
            else {
                return false;
            }
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [consts_service_1.ConstsService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map