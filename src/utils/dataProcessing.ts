
import * as XLSX from 'xlsx';
import { databaseService } from '@/services/databaseService';

export interface ProcessedData {
  merchantData: any[];
  terminalData: any[];
}

export const dataProcessor = {
  async processMerchantReport(file: File, currency: 'USD' | 'ZWG'): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          console.log('Processing merchant report:', { currency, rowCount: jsonData.length });

          const processedMerchants = jsonData.map((row: any, index: number) => ({
            id: `M${String(index + 1).padStart(3, '0')}`,
            terminal_id: row['Terminal ID'] || row['TerminalID'] || `T${String(index + 1).padStart(3, '0')}`,
            account_cif: row['Account CIF'] || row['CIF'] || `CIF${String(index + 1).padStart(3, '0')}`,
            merchant_name: row['Merchant Name'] || row['MerchantName'] || row['Business Name'] || 'Unknown Merchant',
            support_officer: row['Support Officer'] || row['Officer'] || 'Unassigned',
            category: row['Category'] || row['Business Category'] || 'General',
            sector: row['Sector'] || row['Business Sector'] || 'General',
            business_unit: row['Business Unit'] || row['Unit'] || 'General',
            branch_code: row['Branch Code'] || row['Branch'] || 'BR000',
            location: row['Location'] || row['Address'] || '',
            status: row['Status'] || 'Active',
            zwg_sales: currency === 'ZWG' ? (parseFloat(row['Sales Amount']) || 0) : 0,
            usd_sales: currency === 'USD' ? (parseFloat(row['Sales Amount']) || 0) : 0,
            consolidated_usd: parseFloat(row['Consolidated USD']) || parseFloat(row['Sales Amount']) || 0,
            contribution_percentage: parseFloat(row['Contribution %']) || 0,
            last_activity: row['Last Activity'] || new Date().toISOString()
          }));

          // Save to database
          for (const merchant of processedMerchants) {
            try {
              await databaseService.createMerchant(merchant);
            } catch (error) {
              console.error('Error saving merchant:', merchant.merchant_name, error);
            }
          }

          resolve(processedMerchants);
        } catch (error) {
          console.error('Error processing merchant report:', error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  },

  async processTerminalReport(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          console.log('Processing terminal report:', { rowCount: jsonData.length });

          const processedTerminals = jsonData.map((row: any, index: number) => ({
            id: `T${String(index + 1).padStart(3, '0')}`,
            terminal_id: row['Terminal ID'] || row['TerminalID'] || `T${String(index + 1).padStart(3, '0')}`,
            serial_number: row['Serial Number'] || row['SerialNumber'] || '',
            merchant_name: row['Merchant Name'] || row['MerchantName'] || 'Unknown Merchant',
            merchant_id: row['Merchant ID'] || row['MerchantID'] || '',
            location: row['Location'] || row['Address'] || '',
            status: row['Status'] || 'Active',
            officer: row['Officer'] || row['Support Officer'] || 'Unassigned',
            last_transaction: row['Last Transaction'] || new Date().toISOString(),
            installation_date: row['Installation Date'] || new Date().toISOString(),
            model: row['Model'] || row['Terminal Model'] || 'Unknown'
          }));

          // Save to database
          for (const terminal of processedTerminals) {
            try {
              await databaseService.createTerminal(terminal);
            } catch (error) {
              console.error('Error saving terminal:', terminal.terminal_id, error);
            }
          }

          resolve(processedTerminals);
        } catch (error) {
          console.error('Error processing terminal report:', error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  },

  async getProcessedData(): Promise<ProcessedData> {
    try {
      const [merchantData, terminalData] = await Promise.all([
        databaseService.getMerchants(),
        databaseService.getTerminals()
      ]);

      return {
        merchantData,
        terminalData
      };
    } catch (error) {
      console.error('Error getting processed data:', error);
      return {
        merchantData: [],
        terminalData: []
      };
    }
  }
};
