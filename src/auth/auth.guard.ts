import {  
  Injectable,  
  CanActivate,  
  ExecutionContext,  
  UnauthorizedException,  
} from '@nestjs/common';  
import { AuthService } from './auth.service';  

@Injectable()  
export class AuthGuard implements CanActivate {  
  constructor(private readonly authService: AuthService) {}  

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

    const user = await this.authService.validateToken(token);  

    if (!user) {  
      throw new UnauthorizedException('Invalid JWT token');  
    }  

    request.user = user; // Attach the user to the request  
    return true;  
  }  
}  