import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private supabaseService: SupabaseService) {}

  // Run every 5 minutes to keep the service alive on Render
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleKeepAlive() {
    this.logger.debug('Running keep-alive task...');

    // Simple query to keep the connection alive
    const { data, error } = await this.supabaseService.client
      .from('keep_alive')
      .select('*')
      .limit(1);

    if (error) {
      this.logger.error(`Keep-alive task failed: ${error.message}`);
    } else {
      this.logger.debug('Keep-alive task completed successfully');
    }
  }
}
