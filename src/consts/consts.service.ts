
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consts } from './consts.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';

@Injectable()
export class ConstsService extends CrudTypeOrmService<Consts>{
    constructor(
        @InjectRepository(Consts)
        private readonly repo: Repository<Consts>,
    ) {
        super(repo);
    }

    public async getPassword(): Promise<string> {
        let e = await this.repo.findOne({field:'password'})
        return e.value
    }

    public async getSubsidy(): Promise<number> {
        try{
            let e = await this.repo.findOne({field:'rate'})
            return e.value ? parseFloat(e.value) / 100.0 : 0.5
        }catch(e){
            return 0.5
        }
    }
}