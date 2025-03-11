import { Module } from '@nestjs/common';  
import { ContactsController } from './contacts.controller';  
import { ContactsService } from './contacts.service';  
import { SupabaseModule } from '../supabase/supabase.module'; // Importa SupabaseModule  
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule  

@Module({  
  imports: [SupabaseModule, AuthModule], // Agrega SupabaseModule a la lista de imports  
  controllers: [ContactsController],  
  providers: [ContactsService],  
  exports: [ContactsService], //opcional, dependiendo si lo usas en otro modulo  
})  
export class ContactsModule {}  