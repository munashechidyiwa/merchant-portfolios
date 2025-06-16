
-- Create merchants table
CREATE TABLE public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  terminal_id TEXT UNIQUE NOT NULL,
  account_cif TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  category TEXT,
  support_officer TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  sector TEXT,
  business_unit TEXT,
  branch_code TEXT,
  location TEXT,
  zwg_sales DECIMAL(15,2) DEFAULT 0,
  usd_sales DECIMAL(15,2) DEFAULT 0,
  consolidated_usd DECIMAL(15,2) DEFAULT 0,
  month_to_date_total DECIMAL(15,2) DEFAULT 0,
  contribution_percentage DECIMAL(5,2) DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create terminals table
CREATE TABLE public.terminals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  terminal_id TEXT UNIQUE NOT NULL,
  serial_number TEXT,
  merchant_name TEXT NOT NULL,
  merchant_id TEXT,
  location TEXT,
  status TEXT DEFAULT 'Active',
  officer TEXT NOT NULL,
  last_transaction TIMESTAMP WITH TIME ZONE,
  installation_date TIMESTAMP WITH TIME ZONE,
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communications table
CREATE TABLE public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_name TEXT NOT NULL,
  merchant_id TEXT,
  terminal_id TEXT,
  type TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  officer TEXT NOT NULL,
  officer_email TEXT,
  subject TEXT NOT NULL,
  notes TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'Pending',
  priority TEXT DEFAULT 'Medium',
  inactive_days INTEGER,
  auto_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  merchant TEXT NOT NULL,
  officer TEXT NOT NULL,
  terminal_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Unread',
  action_required TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  auto_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alert_settings table
CREATE TABLE public.alert_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  threshold_value TEXT,
  email_notification BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'Medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table for admin configurations
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'security', 'communication', 'alert'
  setting_key TEXT NOT NULL,
  setting_value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, setting_key)
);

-- Create user_sessions table for security tracking
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_time TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT,
  session_duration INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default alert settings
INSERT INTO public.alert_settings (name, description, enabled, threshold_value, email_notification, priority)
VALUES 
  ('Terminal Inactivity', 'Alert when terminals are inactive for specified duration', true, '3 days', true, 'High'),
  ('Overdue Follow-ups', 'Alert when follow-up actions are overdue', true, '1 day', true, 'Medium'),
  ('Revenue Milestones', 'Alert when merchants reach revenue thresholds', true, '10% below target', false, 'Low'),
  ('Performance Decline', 'Alert when terminal performance significantly drops', true, '50% decrease', true, 'High');

-- Insert default system settings
INSERT INTO public.system_settings (category, setting_key, setting_value, description)
VALUES 
  ('security', 'session_timeout', '{"value": 30, "unit": "minutes"}', 'User session timeout duration'),
  ('security', 'max_login_attempts', '{"value": 5}', 'Maximum failed login attempts before lockout'),
  ('security', 'password_policy', '{"min_length": 8, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_special": true}', 'Password complexity requirements'),
  ('communication', 'email_notifications', '{"enabled": true, "frequency": "immediate"}', 'Email notification settings'),
  ('communication', 'auto_communication', '{"enabled": true, "inactive_threshold": 3}', 'Auto-communication generation settings'),
  ('communication', 'cc_email', '{"value": "alternativechannels@nbs.co.zw"}', 'Default CC email for communications'),
  ('alert', 'auto_generation', '{"enabled": true, "frequency": "daily"}', 'Automatic alert generation settings'),
  ('alert', 'escalation_rules', '{"high_priority": "1 hour", "medium_priority": "4 hours", "low_priority": "24 hours"}', 'Alert escalation timeframes');

-- Enable Row Level Security (RLS)
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - you can restrict based on your auth requirements)
CREATE POLICY "Allow all operations on merchants" ON public.merchants FOR ALL USING (true);
CREATE POLICY "Allow all operations on terminals" ON public.terminals FOR ALL USING (true);
CREATE POLICY "Allow all operations on communications" ON public.communications FOR ALL USING (true);
CREATE POLICY "Allow all operations on alerts" ON public.alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations on alert_settings" ON public.alert_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on system_settings" ON public.system_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_sessions" ON public.user_sessions FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_merchants_terminal_id ON public.merchants(terminal_id);
CREATE INDEX idx_terminals_terminal_id ON public.terminals(terminal_id);
CREATE INDEX idx_communications_merchant_id ON public.communications(merchant_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_system_settings_category ON public.system_settings(category);
