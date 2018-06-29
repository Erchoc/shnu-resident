
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class TeacherService extends CrudTypeOrmService<Teacher>{
    constructor(
        @InjectRepository(Teacher)
        private readonly repo: Repository<Teacher>,
    ) {
        super(repo);
    }
}