import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { TeacherModule } from './teacher/teacher.module';
import { RoomModule } from './room/room.module';
import { ResidentModule } from './resident/resident.module';
import { ElectricityModule } from './electricity/electricity.module';
import { ConstsModule } from './consts/consts.module';
import { BookingModule } from './booking/booking.module';
import { BillModule } from './bill/bill.module';
import {AuthModule} from './infrastructure/auth/auth.module';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { HelmetMiddleware } from '@nest-middlewares/helmet';

@Module({
  imports: [
      TypeOrmModule.forRoot(),
      TeacherModule,
      RoomModule,
      ResidentModule,
      ElectricityModule,
      ConstsModule,
      BookingModule,
      BillModule,
      AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // IMPORTANT! Call Middleware.configure BEFORE using it for routes
        HelmetMiddleware.configure( {} )
        // CorsMiddleware.configure( {} )
        consumer.apply(HelmetMiddleware).forRoutes(AppController);
        // consumer.apply(CorsMiddleware).forRoutes(AppController);

    }
    constructor(private readonly connection: Connection) {}
}
