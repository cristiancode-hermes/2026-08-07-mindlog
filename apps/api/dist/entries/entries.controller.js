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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const entries_service_1 = require("./entries.service");
const entry_dto_1 = require("./entry.dto");
let EntriesController = class EntriesController {
    entries;
    constructor(entries) {
        this.entries = entries;
    }
    findAll(req, page, limit, tag, mood, search) {
        return this.entries.findByUser(req.user.id, page || 1, limit || 20, tag, mood ? +mood : undefined, search);
    }
    findByDate(req, date) {
        return this.entries.findByDate(req.user.id, date);
    }
    findOne(req, id) {
        return this.entries.findById(req.user.id, id);
    }
    create(req, dto) {
        return this.entries.create(req.user.id, dto);
    }
    update(req, id, dto) {
        return this.entries.update(req.user.id, id, dto);
    }
    remove(req, id) {
        return this.entries.delete(req.user.id, id);
    }
};
exports.EntriesController = EntriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tag', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'mood', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('tag')),
    __param(4, (0, common_1.Query)('mood')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, Number, String]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('date/:date'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, entry_dto_1.CreateEntryDto]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, entry_dto_1.UpdateEntryDto]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "remove", null);
exports.EntriesController = EntriesController = __decorate([
    (0, swagger_1.ApiTags)('Entries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('entries'),
    __metadata("design:paramtypes", [entries_service_1.EntriesService])
], EntriesController);
//# sourceMappingURL=entries.controller.js.map