import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Consts} from './consts.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {ConstsService} from './consts.service';

@Controller('consts')
export class ConstsController extends CrudController<Consts>{
    constructor(private readonly service: ConstsService) {
        super(service);
    }
}