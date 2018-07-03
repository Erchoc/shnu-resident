export interface CrudService<T> {
    create(entity: T): Promise<T>;
    getOne(id: any): Promise<T>;
    getAll(param: any): Promise<T[]>;
    query(param: any): Promise<[T[], number]>;
    update(id: any, entity: T): Promise<T>;
    updateBatch(entity: T[]): Promise<T>;
    delete(id: any);
}