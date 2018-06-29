
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class BookingService extends CrudTypeOrmService<Booking>{
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
    ) {
        super(repo);
    }
}