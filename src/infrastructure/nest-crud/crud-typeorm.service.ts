import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Repository, FindOperator} from 'typeorm';
import { CrudService } from './crud-service.interface';

@Injectable()
export class CrudTypeOrmService<T> implements CrudService<T> {
    constructor(protected readonly repository: Repository<T>) {}

    protected async save(entity: T): Promise<T> {
        if (!entity || typeof entity !== 'object') {
            throw new BadRequestException();
        }
        entity = await this.saveProccess(entity)
        try {
            // https://github.com/typeorm/typeorm/issues/1544 is a known bug
            // so need to use `entity as any` for now
            // TODO: track that issue
            return await this.repository.save(entity as any);
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    public async saveProccess(entity: T): Promise<T> {
        return entity;
    }

    protected getId(paramId: any): number {
        const id = parseInt(paramId, 10);

        if (isNaN(id) || typeof id !== 'number') {
            throw new BadRequestException();
        }

        return id;
    }

    public async create(entity: T): Promise<T> {
        return await this.save(entity);
    }

    public async getOne(paramId: any): Promise<T> {
        const id = this.getId(paramId);
        const entity = await this.repository.findOne(id);

        if (!entity) {
            throw new NotFoundException();
        }

        return entity;
    }

    public async getAll(params: any): Promise<T[]> {
        return await this.repository.find(params);
    }

    public path2obj(p: String,val:any):any{
        let dotArr = p.split('.')
        let inner = {}
        if(dotArr.length ==0){
            return null
        } else if(dotArr.length ==1){
            inner[dotArr[0]] = val
            return inner
        }
        else if(dotArr.length == 2) {
            let key1 = dotArr[0] 
            let key2 = dotArr[1]
            let i = {}
            i[key2]=val
            inner[key1] = i
            return i
        }else{
            for(let i = dotArr.length -1; i >=1; i--){
                if (dotArr[i+1]) delete inner[dotArr[i+1]]
                inner[dotArr[i]] = val
                val = JSON.parse(JSON.stringify(inner))
            }
            return inner
        }
    }
    public async query(params: any): Promise<[T[], number]> {
        // let relations = this.repository.metadata.eagerRelations.map(i=>i.propertyName)
        let relations = []

        let where = {...params}
        // let relations = []
        let order = {}

        delete where.skip
        delete where.take
        delete where.order

        for (let key in where) {
            let val:any = unescape(where[key]).split('?').join('%').split('*').join('%')
            if(val.indexOf('_')>-1 || val.indexOf('%')>-1){
                val = new FindOperator('like',val)
                where[key] = val
            }
            // if(key.indexOf(".")>-1){
                
            //     where[key.split(".")[0]] = this.path2obj(key,val)
            // }
            // if(key){
            //     let arrK=key.split('.')
            //     if(arrK.length>1){
            //         let kStr = ''
            //         for(let i = 0;i<arrK.length-1;i++){
            //             kStr += arrK[i]
            //         }
            //         relations.push(kStr)
            //     }
            // }
        }
        if(params.order){
            params.order = params.order.split(',')
            for(let i = 0 ; i < params.order.length; i+=2){
                order[params.order[i]]=params.order[i+1].toUpperCase()
            }
        }


        return await this.repository.findAndCount({relations:relations,where:where,skip:params.skip,take:params.take,order:order});
    }

    public async update(paramId: any, entity: T): Promise<T> {
        const exists = await this.getOne(paramId);

        return await this.save(entity);
    }

    public async updateBatch(entities: any): Promise<T> {
        return await this.repository.save(entities);
    }


    public async deleteBatch(entities: any): Promise<T> {
        if(entities.length){
            return await this.repository.delete(entities);
        }
        return null;
    }

    public async delete(paramId: any): Promise<void> {
        const id = this.getId(paramId);

        try {
            await this.repository.delete(id);
        } catch (err) {
            throw new NotFoundException();
        }
    }

    public async deleteAll(param: any): Promise<void> {

        try {
            await this.repository.delete(param);
        } catch (err) {
            throw new NotFoundException();
        }
    }
} /* istanbul ignore next */