import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Booking} from './booking.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BookingService} from './booking.service';

@Controller('booking')
export class BookingController extends CrudController<Booking>{
    constructor(private readonly service: BookingService) {
        super(service);
    }
}