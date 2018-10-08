
import { Module,forwardRef } from '@nestjs/common';
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
import { CorpBillService } from './corpbill.service';
import { CorpBillController } from './corpbill.controller';
import { CorpBill } from './corpbill.entity';
import { TeacherModule } from '../teacher/teacher.module';
import { RoomModule } from '../room/room.module';
import { ResidentModule } from '../resident/resident.module';
import { BookingModule } from '../booking/booking.module';
import { CheckinBillService } from './checkinbill.service';
import { CheckinBillController } from './checkinbill.controller';
import { CheckinBill } from './checkinbill.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bill,MonthlyBill,SeasonBill,AnnualBill,CorpBill,CheckinBill]),ConstsModule,TeacherModule,RoomModule,ResidentModule,forwardRef(() => BookingModule)],
    providers: [BillService,MonthlyBillService,SeasonBillService,AnnualBillService,CorpBillService,CheckinBillService],
    controllers: [BillController,MonthlyBillController,SeasonBillController,AnnualBillController,CorpBillController,CheckinBillController],
    exports: [BillService,MonthlyBillService,SeasonBillService,AnnualBillService,CorpBillService,CheckinBillService],

})
export class BillModule {}