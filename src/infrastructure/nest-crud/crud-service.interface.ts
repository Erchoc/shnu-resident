export interface CrudService<T> {
    create(entity: T): Promise<T>;
    getOne(id: any): Promise<T>;
    getAll(): Promise<T[]>;
    query(param: any): Promise<T[]>;
    update(id: any, entity: T): Promise<T>;
    delete(id: any);
}