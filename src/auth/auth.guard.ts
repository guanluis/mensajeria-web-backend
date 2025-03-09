import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service'; // ← Importación corregida

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {} // ← Se asegura la inyección de dependencias

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    try {
      const { data, error } = await this.supabaseService.client.auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Invalid JWT token');
      }

      // Attach the user to the request
      request.user = data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
