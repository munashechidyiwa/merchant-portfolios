
export interface MerchantReportData {
  terminalId: string;
  accountCif: string;
  merchantName: string;
  supportOfficer: string;
  businessUnit: string;
  branchCode: string;
  monthToDateTotal: number;
  currency: 'USD' | 'ZWG';
  dailyTotals: Record<string, number>; // date -> amount
  lastTransactionDate: string;
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

  processMerchantReport(file: File, currency: 'USD' | 'ZWG'): Promise<MerchantReportData[]> {
    return new Promise((resolve) => {
      // Simulate processing Excel file
      // In a real implementation, you would use a library like xlsx to parse Excel files
      setTimeout(() => {
        const mockData: MerchantReportData[] = [
          {
            terminalId: 'T001',
            accountCif: 'CIF001',
            merchantName: 'Sunset Cafe',
            supportOfficer: 'Takudzwa Madyira',
            businessUnit: 'Retail',
            branchCode: 'BR001',
            monthToDateTotal: currency === 'USD' ? 15000 : 53700,
            currency,
            dailyTotals: {},
            lastTransactionDate: new Date().toISOString()
          },
          {
            terminalId: 'T002',
            accountCif: 'CIF002',
            merchantName: 'Tech Solutions Inc',
            supportOfficer: 'Olivia Usai',
            businessUnit: 'Technology',
            branchCode: 'BR002',
            monthToDateTotal: currency === 'USD' ? 23000 : 82340,
            currency,
            dailyTotals: {},
            lastTransactionDate: new Date().toISOString()
          }
        ];
        
        this.merchantReports = [...this.merchantReports, ...mockData];
        resolve(mockData);
      }, 1000);
    });
  }

  processTerminalData(file: File): Promise<TerminalData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTerminals: TerminalData[] = [
          {
            terminalId: 'T001',
            serialNumber: 'SN123456789',
            merchantName: 'Sunset Cafe',
            merchantId: 'M001',
            model: 'Ingenico iWL250',
            location: 'Corner Samora Machel Ave & Julius Nyerere Way, Harare, Zimbabwe',
            officer: 'Takudzwa Madyira',
            status: 'Active',
            lastTransaction: new Date().toISOString()
          },
          {
            terminalId: 'T002',
            serialNumber: 'SN987654321',
            merchantName: 'Tech Solutions Inc',
            merchantId: 'M002',
            model: 'Verifone V240m',
            location: 'Borrowdale Road, Borrowdale, Harare, Zimbabwe',
            officer: 'Olivia Usai',
            status: 'Active',
            lastTransaction: new Date().toISOString()
          }
        ];

        this.terminalData = mockTerminals;
        resolve(mockTerminals);
      }, 1000);
    });
  }

  calculateActivityRatio(merchantReports: MerchantReportData[]): number {
    const totalTerminals = merchantReports.length;
    const activeTerminals = merchantReports.filter(report => {
      const lastTransaction = new Date(report.lastTransactionDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastTransaction.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7; // Active if transacted within last 7 days
    }).length;

    return totalTerminals > 0 ? (activeTerminals / totalTerminals) * 100 : 0;
  }

  updateTerminalStatus(): void {
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

  getProcessedData(): ProcessedData {
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

export const dataProcessor = new DataProcessor();
