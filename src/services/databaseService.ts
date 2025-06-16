
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseMerchant {
  id: string;
  terminal_id: string;
  account_cif: string;
  merchant_name: string;
  category?: string;
  support_officer: string;
  status: string;
  sector?: string;
  business_unit?: string;
  branch_code?: string;
  location?: string;
  zwg_sales: number;
  usd_sales: number;
  consolidated_usd: number;
  month_to_date_total: number;
  contribution_percentage: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTerminal {
  id: string;
  terminal_id: string;
  serial_number?: string;
  merchant_name: string;
  merchant_id?: string;
  location?: string;
  status: string;
  officer: string;
  last_transaction?: string;
  installation_date?: string;
  model?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCommunication {
  id: string;
  merchant_name: string;
  merchant_id?: string;
  terminal_id?: string;
  type: string;
  date: string;
  officer: string;
  officer_email?: string;
  subject: string;
  notes?: string;
  follow_up_date?: string;
  status: string;
  priority: string;
  inactive_days?: number;
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  merchant: string;
  officer: string;
  terminal_id?: string;
  timestamp: string;
  status: string;
  action_required?: string;
  due_date?: string;
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  // Merchant operations
  async getMerchants(): Promise<DatabaseMerchant[]> {
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createMerchant(merchant: Partial<DatabaseMerchant>): Promise<DatabaseMerchant> {
    const { data, error } = await supabase
      .from('merchants')
      .insert({
        ...merchant,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMerchant(id: string, updates: Partial<DatabaseMerchant>): Promise<DatabaseMerchant> {
    const { data, error } = await supabase
      .from('merchants')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMerchant(id: string): Promise<void> {
    const { error } = await supabase
      .from('merchants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async bulkInsertMerchants(merchants: Partial<DatabaseMerchant>[]): Promise<DatabaseMerchant[]> {
    const { data, error } = await supabase
      .from('merchants')
      .insert(merchants.map(m => ({
        ...m,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();
    
    if (error) throw error;
    return data || [];
  }

  // Terminal operations
  async getTerminals(): Promise<DatabaseTerminal[]> {
    const { data, error } = await supabase
      .from('terminals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createTerminal(terminal: Partial<DatabaseTerminal>): Promise<DatabaseTerminal> {
    const { data, error } = await supabase
      .from('terminals')
      .insert({
        ...terminal,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async bulkInsertTerminals(terminals: Partial<DatabaseTerminal>[]): Promise<DatabaseTerminal[]> {
    const { data, error } = await supabase
      .from('terminals')
      .insert(terminals.map(t => ({
        ...t,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();
    
    if (error) throw error;
    return data || [];
  }

  // Communication operations
  async getCommunications(): Promise<DatabaseCommunication[]> {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createCommunication(communication: Partial<DatabaseCommunication>): Promise<DatabaseCommunication> {
    const { data, error } = await supabase
      .from('communications')
      .insert({
        ...communication,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Alert operations
  async getAlerts(): Promise<DatabaseAlert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createAlert(alert: Partial<DatabaseAlert>): Promise<DatabaseAlert> {
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        ...alert,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAlertStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }

  // System settings operations
  async getSystemSettings(category?: string): Promise<any[]> {
    let query = supabase.from('system_settings').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('setting_key');
    
    if (error) throw error;
    return data || [];
  }

  async updateSystemSetting(category: string, key: string, value: any): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        category,
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  }

  // Alert settings operations
  async getAlertSettings(): Promise<any[]> {
    const { data, error } = await supabase
      .from('alert_settings')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async updateAlertSetting(id: string, updates: any): Promise<void> {
    const { error } = await supabase
      .from('alert_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }

  // User session tracking
  async logUserSession(userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const { error } = await supabase
      .from('user_sessions')
      .insert({
        user_email: userEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        login_time: new Date().toISOString()
      });
    
    if (error) throw error;
  }

  async getUserSessions(limit = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('login_time', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
}

export const databaseService = new DatabaseService();
