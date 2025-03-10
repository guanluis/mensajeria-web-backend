import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService], 
})
export class ContactsModule {}
