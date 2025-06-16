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
        terminal_id: merchant.terminal_id!,
        account_cif: merchant.account_cif!,
        merchant_name: merchant.merchant_name!,
        support_officer: merchant.support_officer!,
        category: merchant.category,
        status: merchant.status || 'Active',
        sector: merchant.sector,
        business_unit: merchant.business_unit,
        branch_code: merchant.branch_code,
        location: merchant.location,
        zwg_sales: merchant.zwg_sales || 0,
        usd_sales: merchant.usd_sales || 0,
        consolidated_usd: merchant.consolidated_usd || 0,
        month_to_date_total: merchant.month_to_date_total || 0,
        contribution_percentage: merchant.contribution_percentage || 0,
        last_activity: merchant.last_activity || new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMerchant(id: string, updates: Partial<DatabaseMerchant>): Promise<DatabaseMerchant> {
    const updateData: any = {};
    
    // Only include fields that exist in the updates object
    if (updates.merchant_name !== undefined) updateData.merchant_name = updates.merchant_name;
    if (updates.support_officer !== undefined) updateData.support_officer = updates.support_officer;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.sector !== undefined) updateData.sector = updates.sector;
    if (updates.business_unit !== undefined) updateData.business_unit = updates.business_unit;
    if (updates.branch_code !== undefined) updateData.branch_code = updates.branch_code;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.zwg_sales !== undefined) updateData.zwg_sales = updates.zwg_sales;
    if (updates.usd_sales !== undefined) updateData.usd_sales = updates.usd_sales;
    if (updates.consolidated_usd !== undefined) updateData.consolidated_usd = updates.consolidated_usd;
    if (updates.contribution_percentage !== undefined) updateData.contribution_percentage = updates.contribution_percentage;
    
    const { data, error } = await supabase
      .from('merchants')
      .update(updateData)
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
    const merchantsToInsert = merchants.map(m => ({
      terminal_id: m.terminal_id!,
      account_cif: m.account_cif!,
      merchant_name: m.merchant_name!,
      support_officer: m.support_officer!,
      category: m.category,
      status: m.status || 'Active',
      sector: m.sector,
      business_unit: m.business_unit,
      branch_code: m.branch_code,
      location: m.location,
      zwg_sales: m.zwg_sales || 0,
      usd_sales: m.usd_sales || 0,
      consolidated_usd: m.consolidated_usd || 0,
      month_to_date_total: m.month_to_date_total || 0,
      contribution_percentage: m.contribution_percentage || 0,
      last_activity: m.last_activity || new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('merchants')
      .insert(merchantsToInsert)
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
        terminal_id: terminal.terminal_id!,
        merchant_name: terminal.merchant_name!,
        officer: terminal.officer!,
        serial_number: terminal.serial_number,
        merchant_id: terminal.merchant_id,
        location: terminal.location,
        status: terminal.status || 'Active',
        last_transaction: terminal.last_transaction,
        installation_date: terminal.installation_date,
        model: terminal.model
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async bulkInsertTerminals(terminals: Partial<DatabaseTerminal>[]): Promise<DatabaseTerminal[]> {
    const terminalsToInsert = terminals.map(t => ({
      terminal_id: t.terminal_id!,
      merchant_name: t.merchant_name!,
      officer: t.officer!,
      serial_number: t.serial_number,
      merchant_id: t.merchant_id,
      location: t.location,
      status: t.status || 'Active',
      last_transaction: t.last_transaction,
      installation_date: t.installation_date,
      model: t.model
    }));

    const { data, error } = await supabase
      .from('terminals')
      .insert(terminalsToInsert)
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
