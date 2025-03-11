import { Module } from '@nestjs/common';  
import { MessagesService } from './messages.service';  
import { MessagesController } from './messages.controller';  
import { SupabaseModule } from '../supabase/supabase.module';  
import { AuthModule } from '../auth/auth.module';  

@Module({  
  imports: [SupabaseModule, AuthModule],  
  controllers: [MessagesController],  
  providers: [MessagesService], 
})  
export class MessagesModule {}  