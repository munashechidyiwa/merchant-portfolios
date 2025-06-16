
import { databaseService } from '@/services/databaseService';

export interface MerchantReportData {
  terminalId: string;
  accountCif: string;
  merchantName: string;
  supportOfficer: string;
  businessUnit: string;
  branchCode: string;
  monthToDateTotal: number;
  currency: 'USD' | 'ZWG';
  dailyTotals: Record<string, number>;
  lastTransactionDate: string;
  sector?: string;
  location?: string;
}

export interface TerminalData {
  terminalId: string;
  serialNumber: string;
  merchantName: string;
  merchantId: string;
  model: string;
  location: string;
  officer: string;
  status: 'Active' | 'Inactive';
  lastTransaction: string;
}

export interface ProcessedData {
  totalUsdRevenue: number;
  totalZwgRevenue: number;
  consolidatedUsdRevenue: number;
  activeTerminals: number;
  totalTerminals: number;
  activityRatio: number;
  merchantData: MerchantReportData[];
  terminalData: TerminalData[];
}

const ZWG_TO_USD_RATE = 3.58;

export class DataProcessor {
  private merchantReports: MerchantReportData[] = [];
  private terminalData: TerminalData[] = [];

  async processMerchantReport(file: File, currency: 'USD' | 'ZWG'): Promise<MerchantReportData[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Simulate processing Excel file - in real implementation, use xlsx library
        setTimeout(async () => {
          const mockData: MerchantReportData[] = [
            {
              terminalId: `T${Date.now()}001`,
              accountCif: `CIF${Date.now()}001`,
              merchantName: `Imported Merchant ${Date.now()}`,
              supportOfficer: 'Takudzwa Madyira',
              businessUnit: 'Retail Banking',
              branchCode: 'BR001',
              monthToDateTotal: currency === 'USD' ? 15000 : 53700,
              currency,
              dail

yTotals: {},
              lastTransactionDate: new Date().toISOString(),
              sector: 'Retail',
              location: 'Harare, Zimbabwe'
            }
          ];
          
          // Save to database
          try {
            const merchantsToInsert = mockData.map(data => ({
              terminal_id: data.terminalId,
              account_cif: data.accountCif,
              merchant_name: data.merchantName,
              support_officer: data.supportOfficer,
              business_unit: data.businessUnit,
              branch_code: data.branchCode,
              month_to_date_total: data.monthToDateTotal,
              sector: data.sector,
              location: data.location,
              zwg_sales: currency === 'ZWG' ? data.monthToDateTotal : 0,
              usd_sales: currency === 'USD' ? data.monthToDateTotal : 0,
              consolidated_usd: currency === 'USD' ? data.monthToDateTotal : data.monthToDateTotal / ZWG_TO_USD_RATE,
              last_activity: data.lastTransactionDate
            }));

            await databaseService.bulkInsertMerchants(merchantsToInsert);
            console.log(`Successfully saved ${mockData.length} merchants to database`);
          } catch (error) {
            console.error('Error saving merchants to database:', error);
          }
          
          this.merchantReports = [...this.merchantReports, ...mockData];
          resolve(mockData);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  async processTerminalData(file: File): Promise<TerminalData[]> {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(async () => {
          const mockTerminals: TerminalData[] = [
            {
              terminalId: `T${Date.now()}001`,
              serialNumber: `SN${Date.now()}`,
              merchantName: `Imported Terminal Merchant ${Date.now()}`,
              merchantId: `M${Date.now()}`,
              model: 'Ingenico iWL250',
              location: 'Harare, Zimbabwe',
              officer: 'Takudzwa Madyira',
              status: 'Active',
              lastTransaction: new Date().toISOString()
            }
          ];

          // Save to database
          try {
            const terminalsToInsert = mockTerminals.map(terminal => ({
              terminal_id: terminal.terminalId,
              serial_number: terminal.serialNumber,
              merchant_name: terminal.merchantName,
              merchant_id: terminal.merchantId,
              model: terminal.model,
              location: terminal.location,
              officer: terminal.officer,
              status: terminal.status,
              last_transaction: terminal.lastTransaction
            }));

            await databaseService.bulkInsertTerminals(terminalsToInsert);
            console.log(`Successfully saved ${mockTerminals.length} terminals to database`);
          } catch (error) {
            console.error('Error saving terminals to database:', error);
          }

          this.terminalData = mockTerminals;
          resolve(mockTerminals);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  calculateActivityRatio(merchantReports: MerchantReportData[]): number {
    const totalTerminals = merchantReports.length;
    const activeTerminals = merchantReports.filter(report => {
      const lastTransaction = new Date(report.lastTransactionDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastTransaction.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length;

    return totalTerminals > 0 ? (activeTerminals / totalTerminals) * 100 : 0;
  }

  async updateTerminalStatus(): Promise<void> {
    // Update terminal status based on recent transactions
    this.terminalData.forEach(terminal => {
      const recentReport = this.merchantReports.find(report => 
        report.terminalId === terminal.terminalId
      );
      
      if (recentReport) {
        const lastTransaction = new Date(recentReport.lastTransactionDate);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastTransaction.getTime()) / (1000 * 60 * 60 * 24));
        terminal.status = daysDiff <= 7 ? 'Active' : 'Inactive';
        terminal.lastTransaction = recentReport.lastTransactionDate;
      }
    });
  }

  async getProcessedData(): Promise<ProcessedData> {
    // Load data from database
    try {
      const merchants = await databaseService.getMerchants();
      const terminals = await databaseService.getTerminals();

      const usdRevenue = merchants.reduce((sum, m) => sum + m.usd_sales, 0);
      const zwgRevenue = merchants.reduce((sum, m) => sum + m.zwg_sales, 0);
      const consolidatedUsdRevenue = usdRevenue + (zwgRevenue / ZWG_TO_USD_RATE);
      
      const activeTerminals = terminals.filter(t => t.status === 'Active').length;
      const totalTerminals = terminals.length;
      const activityRatio = totalTerminals > 0 ? (activeTerminals / totalTerminals) * 100 : 0;

      // Convert database format to interface format
      const merchantData: MerchantReportData[] = merchants.map(m => ({
        terminalId: m.terminal_id,
        accountCif: m.account_cif,
        merchantName: m.merchant_name,
        supportOfficer: m.support_officer,
        businessUnit: m.business_unit || '',
        branchCode: m.branch_code || '',
        monthToDateTotal: m.month_to_date_total,
        currency: 'USD' as 'USD' | 'ZWG',
        dailyTotals: {},
        lastTransactionDate: m.last_activity,
        sector: m.sector || '',
        location: m.location || ''
      }));

      const terminalData: TerminalData[] = terminals.map(t => ({
        terminalId: t.terminal_id,
        serialNumber: t.serial_number || '',
        merchantName: t.merchant_name,
        merchantId: t.merchant_id || '',
        model: t.model || '',
        location: t.location || '',
        officer: t.officer,
        status: t.status as 'Active' | 'Inactive',
        lastTransaction: t.last_transaction || new Date().toISOString()
      }));

      return {
        totalUsdRevenue: usdRevenue,
        totalZwgRevenue: zwgRevenue,
        consolidatedUsdRevenue,
        activeTerminals,
        totalTerminals,
        activityRatio,
        merchantData,
        terminalData
      };
    } catch (error) {
      console.error('Error loading processed data from database:', error);
      // Fallback to in-memory data
      const usdReports = this.merchantReports.filter(r => r.currency === 'USD');
      const zwgReports = this.merchantReports.filter(r => r.currency === 'ZWG');
      
      const totalUsdRevenue = usdReports.reduce((sum, report) => sum + report.monthToDateTotal, 0);
      const totalZwgRevenue = zwgReports.reduce((sum, report) => sum + report.monthToDateTotal, 0);
      const consolidatedUsdRevenue = totalUsdRevenue + (totalZwgRevenue / ZWG_TO_USD_RATE);
      
      const activeTerminals = this.terminalData.filter(t => t.status === 'Active').length;
      const activityRatio = this.calculateActivityRatio(this.merchantReports);

      return {
        totalUsdRevenue,
        totalZwgRevenue,
        consolidatedUsdRevenue,
        activeTerminals,
        totalTerminals: this.terminalData.length,
        activityRatio,
        merchantData: this.merchantReports,
        terminalData: this.terminalData
      };
    }
  }
}

export const dataProcessor = new DataProcessor();
