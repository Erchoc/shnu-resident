import { Controller, Get, Post, Body, Put, Param, Delete,Query } from '@nestjs/common';
import {Booking} from './booking.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BookingService} from './booking.service';
import { BillService } from '../bill/bill.service';

@Controller('booking')
export class BookingController extends CrudController<Booking>{
    constructor(
        private readonly service: BookingService) {
        super(service);
    }


    @Get('queryNested')
    public async queryNested(@Query() q:any): Promise<any> {
        return this.service.queryNested(q)
    }

}