import { Request, Response} from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/converHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(req: Request, res: Response) {
    const filters = req.query;
    
    const week_day = filters.week_day as string
    const subject = filters.subject as string
    const time = filters.time as string

    if(!filters.week_day || !filters.subject || !filters.time) {
      return res.status(400).json({
        error: 'Missing filters to search class'
      })
    }

    const timeInMinutes = convertHourToMinutes(time);
    
    const classes = await db('classes')
      .whereExists(function() {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return res.json(classes)
  }


  async create (req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = req.body;
  
    const trx = await db.transaction()
  
    try {
      const insertedUserIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });
    
      const user_id = insertedUserIds[0];
    
      const insertedClassIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
    
      const class_id = insertedClassIds[0];
    
      const classSchedule = schedule.map((schedule_item: ScheduleItem) => {
        return {
          class_id,
          week_day: schedule_item.week_day,
          from: convertHourToMinutes(schedule_item.from),
          to: convertHourToMinutes(schedule_item.to),
        };
      });
    
      await trx('class_schedule').insert(classSchedule);
    
      await trx.commit();
    
      return res.status(201).send();
    }catch {
      await trx.rollback();
  
      return res.status(400).json({error: 'Unexpected error while creating new class'})
    }
  }
}