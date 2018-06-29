import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Electricity} from './electricity.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {ElectricityService} from './electricity.service';

@Controller('electricity')
export class ElectricityController extends CrudController<Electricity>{
    constructor(private readonly service: ElectricityService) {
        super(service);
    }
}