
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileUploadProps {
  title: string;
  description: string;
  onFileUpload: (file: File) => void;
  uploadType: 'merchants' | 'terminals';
}

export function FileUpload({ title, description, onFileUpload, uploadType }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

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
      return;
    }

    setFileName(file.name);
    setUploadStatus('uploading');

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onFileUpload(file);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const getStatusBadge = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing...</Badge>;
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Success</Badge>;
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
            <span className="text-sm font-medium">{fileName}</span>
            {uploadStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {uploadStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Supported formats: .xlsx, .xls, .csv
        </div>
      </CardContent>
    </Card>
  );
}
