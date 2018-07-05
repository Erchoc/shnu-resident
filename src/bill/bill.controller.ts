import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';
import { FindOperator } from 'typeorm';

@Controller('bill')
export class BillController extends CrudController<Bill>{
    constructor(private readonly service: BillService) {
        super(service);
    }

    @Get('anomaly')
    public async anomaly(): Promise<any> {
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        let r = await this.service.generateAnomaly(month,year)
        return r
    }

    @Get('anomaly/:year/:month')
    public async anomalySpecified(@Param('month') month:string, @Param('year') year:string): Promise<any> {
        let mm = parseInt(month)
        let yy = parseInt(year)
        let r = await this.service.generateAnomaly(mm,yy)
        return r

    }

}