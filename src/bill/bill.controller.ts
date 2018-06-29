import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';

@Controller('bill')
export class BillController extends CrudController<Bill>{
    constructor(private readonly service: BillService) {
        super(service);
    }
}