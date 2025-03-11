import { Injectable } from '@nestjs/common';  
import { SupabaseService } from '../supabase/supabase.service';  

@Injectable()  
export class AuthService {  
  constructor(private readonly supabaseService: SupabaseService) {}  

  async validateToken(token: string): Promise<any> {  
    try {  
      const { data, error } = await this.supabaseService.client.auth.getUser(token);  

      if (error || !data.user) {  
        return null; // Token inválido  
      }  

      return data.user; // Retorna la información del usuario  
    } catch (error) {  
      return null; // Error al validar el token  
    }  
  }  
}  