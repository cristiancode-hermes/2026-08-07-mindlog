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
exports.Entry = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const tag_entity_1 = require("../tags/tag.entity");
let Entry = class Entry {
    id;
    userId;
    user;
    date;
    content;
    mood;
    title;
    createdAt;
    updatedAt;
    tags;
};
exports.Entry = Entry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Entry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Entry.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, u => u.entries),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Entry.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Entry.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Entry.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 3 }),
    __metadata("design:type", Number)
], Entry.prototype, "mood", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Entry.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Entry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Entry.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.Tag, t => t.entries),
    (0, typeorm_1.JoinTable)({ name: 'entry_tags', joinColumn: { name: 'entryId' }, inverseJoinColumn: { name: 'tagId' } }),
    __metadata("design:type", Array)
], Entry.prototype, "tags", void 0);
exports.Entry = Entry = __decorate([
    (0, typeorm_1.Entity)()
], Entry);
//# sourceMappingURL=entry.entity.js.map