import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SupabaseModule } from '../supabase/supabase.module'; 
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [SupabaseModule, ScheduleModule.forRoot()],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
