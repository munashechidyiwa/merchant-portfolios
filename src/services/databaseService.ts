
import { supabase } from "@/integrations/supabase/client";

interface Merchant {
  id: string;
  terminal_id: string;
  account_cif: string;
  merchant_name: string;
  support_officer: string;
  category: string;
  sector: string;
  business_unit: string;
  branch_code: string;
  location: string;
  status: string;
  zwg_sales: number;
  usd_sales: number;
  consolidated_usd: number;
  contribution_percentage: number;
  last_activity: string;
}

interface Terminal {
  id: string;
  terminal_id: string;
  serial_number: string;
  merchant_name: string;
  merchant_id: string;
  location: string;
  status: string;
  officer: string;
  last_transaction: string;
  installation_date: string;
  model: string;
}

export const databaseService = {
  async getMerchants(): Promise<Merchant[]> {
    const { data: merchants, error } = await supabase
      .from('merchants')
      .select('*');

    if (error) {
      console.error("Error fetching merchants:", error);
      throw error;
    }

    return merchants || [];
  },

  async getTerminals(): Promise<Terminal[]> {
    const { data: terminals, error } = await supabase
      .from('terminals')
      .select('*');

    if (error) {
      console.error("Error fetching terminals:", error);
      throw error;
    }

    return terminals || [];
  },

  async updateMerchant(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('merchants')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async createMerchant(merchantData: any) {
    const requiredData = {
      terminal_id: merchantData.terminal_id || 'T000',
      account_cif: merchantData.account_cif || 'CIF000',
      merchant_name: merchantData.merchant_name || 'Unknown Merchant',
      support_officer: merchantData.support_officer || 'Unassigned',
      ...merchantData,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('merchants')
      .insert([requiredData])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async bulkCreateMerchants(merchantsData: any[]) {
    const merchantsWithDefaults = merchantsData.map(merchant => ({
      terminal_id: merchant.terminal_id || 'T000',
      account_cif: merchant.account_cif || 'CIF000', 
      merchant_name: merchant.merchant_name || 'Unknown Merchant',
      support_officer: merchant.support_officer || 'Unassigned',
      ...merchant,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('merchants')
      .insert(merchantsWithDefaults)
      .select();

    if (error) throw error;
    return data;
  },

  async updateTerminal(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('terminals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async createTerminal(terminalData: any) {
    const requiredData = {
      terminal_id: terminalData.terminal_id || 'T000',
      merchant_name: terminalData.merchant_name || 'Unknown Merchant',
      officer: terminalData.officer || 'Unassigned',
      ...terminalData,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('terminals')
      .insert([requiredData])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async bulkCreateTerminals(terminalsData: any[]) {
    const terminalsWithDefaults = terminalsData.map(terminal => ({
      terminal_id: terminal.terminal_id || 'T000',
      merchant_name: terminal.merchant_name || 'Unknown Merchant',
      officer: terminal.officer || 'Unassigned',
      ...terminal,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('terminals')
      .insert(terminalsWithDefaults)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteMerchant(id: string): Promise<void> {
    const { error } = await supabase
      .from('merchants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting merchant:", error);
      throw error;
    }
  },

  async deleteTerminal(id: string): Promise<void> {
    const { error } = await supabase
      .from('terminals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting terminal:", error);
      throw error;
    }
  },

  async createCommunication(communicationData: any) {
    const requiredData = {
      merchant_name: communicationData.merchant_name || 'Unknown Merchant',
      officer: communicationData.officer || 'Unassigned',
      type: communicationData.type || 'General',
      subject: communicationData.subject || 'No subject',
      ...communicationData,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('communications')
      .insert([requiredData])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async getCommunications() {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching communications:", error);
      throw error;
    }

    return data || [];
  },

  async createAlert(alertData: any) {
    const requiredData = {
      type: alertData.type || 'General',
      severity: alertData.severity || 'Medium',
      message: alertData.message || 'No message provided',
      merchant: alertData.merchant || 'Unknown',
      officer: alertData.officer || 'Unassigned',
      ...alertData,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('alerts')
      .insert([requiredData])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async getAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }

    return data || [];
  },

  async updateAlert(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('alerts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteAlert(id: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting alert:", error);
      throw error;
    }
  },

  // System Settings methods
  async getSystemSettings(category: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error("Error fetching system settings:", error);
      throw error;
    }

    return data || [];
  },

  async updateSystemSetting(category: string, key: string, value: any) {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        category,
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    return data?.[0];
  },

  // Alert Settings methods
  async getAlertSettings() {
    const { data, error } = await supabase
      .from('alert_settings')
      .select('*');

    if (error) {
      console.error("Error fetching alert settings:", error);
      throw error;
    }

    return data || [];
  },

  async updateAlertSetting(id: string, updates: any) {
    const { data, error } = await supabase
      .from('alert_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  // User Sessions methods
  async getUserSessions(limit: number = 50) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('login_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching user sessions:", error);
      throw error;
    }

    return data || [];
  }
};
