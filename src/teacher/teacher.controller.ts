import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Teacher} from './teacher.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {TeacherService} from './teacher.service';

@Controller('teacher')
export class TeacherController extends CrudController<Teacher>{
    constructor(private readonly service: TeacherService) {
        super(service);
    }
}