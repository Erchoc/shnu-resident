
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Electricity } from './electricity.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class ElectricityService extends CrudTypeOrmService<Electricity>{
    constructor(
        @InjectRepository(Electricity)
        private readonly repo: Repository<Electricity>,
    ) {
        super(repo);
    }
}