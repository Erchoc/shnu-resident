
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PhotoController } from './photo.controller';
import { Bill } from './bill.entity';
import {BillService} from './bill.service';

@Module({
    imports: [TypeOrmModule.forFeature([Bill])],
    providers: [BillService],
    // controllers: [PhotoController],
    exports: [BillService],

})
export class BillModule {}