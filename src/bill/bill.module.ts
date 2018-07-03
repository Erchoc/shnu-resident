
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PhotoController } from './photo.controller';
import { Bill } from './bill.entity';
import {BillService} from './bill.service';
import { BillController } from './bill.controller';
import { MonthlyBillController } from './monthlybill.controller';
import { MonthlyBillService } from './monthlybill.service';
import { MonthlyBill } from './monthlybill.entity';
import { SeasonBillService } from './seasonbill.service';
import { SeasonBillController } from './seasonbill.controller';
import { SeasonBill } from './seasonbill.entity';
import { AnnualBillController } from './annualbill.controller';
import { AnnualBill } from './annualbill.entity';
import { AnnualBillService } from './annualbill.service';
import { ConstsModule } from '../consts/consts.module';

@Module({
    imports: [TypeOrmModule.forFeature([Bill,MonthlyBill,SeasonBill,AnnualBill]),ConstsModule],
    providers: [BillService,MonthlyBillService,SeasonBillService,AnnualBillService],
    controllers: [BillController,MonthlyBillController,SeasonBillController,AnnualBillController],
    exports: [BillService,MonthlyBillService,SeasonBillService,AnnualBillService],

})
export class BillModule {}