
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  title: string;
  description: string;
  onFileUpload: (file: File) => void;
  uploadType: 'merchants' | 'terminals' | 'merchant-data';
}

const requiredColumns = {
  merchants: [
    'Terminal ID',
    'Account CIF',
    'Merchant Name',
    'Support Officer',
    'Business Unit',
    'Branch Code',
    'Sector',
    'Month to Date Total'
  ],
  terminals: [
    'Terminal ID',
    'Serial Number',
    'Merchant Name',
    'Merchant ID',
    'Model',
    'Location',
    'Officer'
  ],
  'merchant-data': [
    'Terminal ID',
    'Account CIF',
    'Merchant Name',
    'Support Officer',
    'Business Unit',
    'Branch Code',
    'Sector',
    'Month to Date Total'
  ]
};

export function FileUpload({ title, description, onFileUpload, uploadType }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error' | 'validation-error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const validateExcelColumns = async (file: File): Promise<{ isValid: boolean; missingColumns: string[] }> => {
    // Simulate Excel file validation
    // In a real implementation, you would use a library like xlsx to parse and validate Excel files
    return new Promise((resolve) => {
      setTimeout(() => {
        const required = requiredColumns[uploadType];
        // Simulate some missing columns for demonstration
        const missingColumns: string[] = [];
        
        // For demo purposes, randomly validate - in real implementation, parse Excel file
        if (Math.random() > 0.7) {
          missingColumns.push('Sector'); // Simulate missing Sector column sometimes
        }
        
        resolve({
          isValid: missingColumns.length === 0,
          missingColumns
        });
      }, 1000);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is Excel format
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      setValidationErrors(['Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.']);
      return;
    }

    setFileName(file.name);
    setUploadStatus('uploading');
    setValidationErrors([]);

    try {
      // Validate Excel columns
      const validation = await validateExcelColumns(file);
      
      if (!validation.isValid) {
        setUploadStatus('validation-error');
        setValidationErrors([
          'Missing required columns:',
          ...validation.missingColumns
        ]);
        setUploadedFile(null);
        return;
      }

      setUploadedFile(file);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      setValidationErrors(['Error validating file. Please try again.']);
      setUploadedFile(null);
    }
  };

  const handleProcessFile = () => {
    if (uploadedFile) {
      onFileUpload(uploadedFile);
      console.log(`Processing ${uploadType} file:`, uploadedFile.name);
    }
  };

  const getStatusBadge = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Validating...</Badge>;
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Validated</Badge>;
      case 'validation-error':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Validation Error</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`file-upload-${uploadType}`}>Select Excel File</Label>
          <Input
            id={`file-upload-${uploadType}`}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={uploadStatus === 'uploading'}
          />
        </div>

        {fileName && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium flex-1">{fileName}</span>
            {uploadStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {(uploadStatus === 'error' || uploadStatus === 'validation-error') && <AlertCircle className="h-4 w-4 text-red-600" />}
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <X className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                {validationErrors.map((error, index) => (
                  <div key={index} className={index === 0 ? 'font-medium' : 'ml-2'}>
                    {index === 0 ? error : `• ${error}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && uploadedFile && (
          <Button onClick={handleProcessFile} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Process Data
          </Button>
        )}

        <div className="text-xs text-gray-500">
          <div className="font-medium mb-1">Required columns:</div>
          <div className="space-y-1">
            {requiredColumns[uploadType].map((column, index) => (
              <div key={index}>• {column}</div>
            ))}
          </div>
          <div className="mt-2">Supported formats: .xlsx, .xls, .csv</div>
        </div>
      </CardContent>
    </Card>
  );
}
