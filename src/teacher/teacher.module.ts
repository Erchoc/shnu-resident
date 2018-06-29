
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherService } from './teacher.service';
// import { PhotoController } from './photo.controller';
import { Teacher } from './teacher.entity';
import {TeacherController} from './teacher.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher])],
    providers: [TeacherService],
    controllers: [TeacherController],
    exports: [TeacherService],

})
export class TeacherModule {}