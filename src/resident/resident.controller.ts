import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Resident} from './resident.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {ResidentService} from './resident.service';

@Controller('resident')
export class ResidentController extends CrudController<Resident>{
    constructor(private readonly service: ResidentService) {
        super(service);
    }
}