import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';
import * as moment from 'moment'

@Entity()
export class Bill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    month: number;

    @Column('int')
    year: number;

    @Column('double')
    amount: number;

    @Column('text')
    comment: string;

    @Column('tinytext')
    type: string;

    @ManyToOne(type => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    public deductAmountByActualDate(start:string,end:string):Bill{
        let checkinStartDate = moment(this.booking.checkin)
        let checkinEndDate =  moment(this.booking.checkout)
        let startM = moment(start)
        let endM = moment(end)
        let days
        if(endM.month() === startM.month()  && endM.year() === startM.year()){
            days = endM.diff(startM,'days')
        }else{
            days = moment(start).endOf('month').diff(startM,'days')
        }
        let startConcerned = this.month-1 === startM.month() && this.year === startM.year()
        let checkinConcerned = checkinStartDate.month() === startM.month() && checkinStartDate.year() === startM.year()
        let endConcerned = this.month-1 === endM.month() && this.year === endM.year()
        let chekcoutConcerned = checkinEndDate.month() === endM.month() && checkinEndDate.year() === endM.year()

        let daysToDeduct = 0
        if(startConcerned){
            // 计算的开始日期更晚
            let daysDiff
            if(checkinConcerned){
                daysDiff = startM.diff(checkinStartDate,'days')
            }else{
                let startOfMonth = moment().year(this.year).month(this.month-1).startOf('month');
                daysDiff = startM.diff(startOfMonth,'days')
            }
            if(daysDiff> 0){
                daysToDeduct += daysDiff
            }
        }
        if(endConcerned){
            // 计算的结束日期更早
            let daysDiff
            if(chekcoutConcerned){
                daysDiff = checkinEndDate.diff(endM,'days')
            }else{
                let endOfMonth = moment().year(this.year).month(this.month-1).endOf('month');
                daysDiff = endOfMonth.diff(endM,'days')
            }
            if(daysDiff> 0){
                daysToDeduct += daysDiff
            }
        }
        let rate = (days - daysToDeduct) / (days+0.0)
        this.amount = Math.ceil(this.amount * rate)
        return this
    }
}