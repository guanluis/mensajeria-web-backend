import { Injectable, type OnModuleInit } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>("SUPABASE_URL")
    const supabaseKey = this.configService.get<string>("SUPABASE_KEY")

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and Key must be provided")
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  get client(): SupabaseClient {
    return this.supabase
  }
}

