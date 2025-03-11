import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ContactsModule, 
    MessagesModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
