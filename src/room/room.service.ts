
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class RoomService extends CrudTypeOrmService<Room>{
    constructor(
        @InjectRepository(Room)
        private readonly repo: Repository<Room>,
    ) {
        super(repo);
    }
}