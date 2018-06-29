
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class BillService extends CrudTypeOrmService<Bill>{
    constructor(
        @InjectRepository(Bill)
        private readonly repo: Repository<Bill>,
    ) {
        super(repo);
    }
}