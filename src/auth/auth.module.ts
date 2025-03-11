import { Module } from '@nestjs/common';  
import { AuthGuard } from './auth.guard';  
import { SupabaseModule } from '../supabase/supabase.module';  
import { AuthService } from './auth.service';  

@Module({  
  imports: [SupabaseModule],  
  providers: [AuthGuard, AuthService],  
  exports: [AuthGuard, AuthService], // Asegúrate de que AuthService esté exportado  
})  
export class AuthModule {}  