
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from './resident.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class ResidentService extends CrudTypeOrmService<Resident>{
    constructor(
        @InjectRepository(Resident)
        private readonly repo: Repository<Resident>,
    ) {
        super(repo);
    }
}