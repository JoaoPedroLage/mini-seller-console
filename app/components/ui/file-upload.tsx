'use client';

import { useRef, useState } from 'react';
import { Button } from './button';
import { Lead } from '@/types';

interface RawLeadData {
  id: string | number;
  name: string;
  email: string;
  company: string;
  source: string;
  status: string;
  score: number;
}

interface FileUploadProps {
  onLeadsUpload: (leads: Lead[], mode: 'replace' | 'merge') => void;
}

export default function FileUpload({ onLeadsUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState<'replace' | 'merge'>('merge');
  const [parsedLeads, setParsedLeads] = useState<Lead[] | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please select a valid JSON file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('JSON must contain an array of leads');
      }

      if (data.length === 0) {
        throw new Error('JSON array cannot be empty');
      }

      const validatedLeads: Lead[] = data.map((item: RawLeadData, index: number) => {
        if (!item.id || !item.name || !item.email || !item.company || !item.status || !item.source || typeof item.score !== 'number') {
          throw new Error(`Invalid lead structure at index ${index}. Required fields: id, name, email, company, status, source, score`);
        }

        if (!['New', 'Contacted', 'Qualified', 'Unqualified'].includes(item.status)) {
          throw new Error(`Invalid status "${item.status}" at index ${index}. Must be one of: New, Contacted, Qualified, Unqualified`);
        }

        return {
          id: String(item.id),
          name: String(item.name),
          email: String(item.email),
          company: String(item.company),
          source: String(item.source),
          status: item.status as 'New' | 'Contacted' | 'Qualified' | 'Unqualified',
          score: Number(item.score)
        };
      });

      setParsedLeads(validatedLeads);
      setShowConfirmation(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON file');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmUpload = () => {
    if (parsedLeads) {
      onLeadsUpload(parsedLeads, uploadMode);
      setSuccess(`Successfully ${uploadMode === 'replace' ? 'replaced all leads with' : 'added'} ${parsedLeads.length} leads!`);
      setParsedLeads(null);
      setShowConfirmation(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const cancelUpload = () => {
    setParsedLeads(null);
    setShowConfirmation(false);
    setError(null);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Mode Selection */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center min-w-fit">
          Upload Mode:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="uploadMode"
              value="merge"
              checked={uploadMode === 'merge'}
              onChange={(e) => setUploadMode(e.target.value as 'merge')}
              className="mr-2 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Add to existing (remove duplicates)
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="uploadMode"
              value="replace"
              checked={uploadMode === 'replace'}
              onChange={(e) => setUploadMode(e.target.value as 'replace')}
              className="mr-2 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Replace all leads
            </span>
          </label>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone and JSON Format Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Drop Zone - Left Side */}
        <div className="flex-1">
          <div
            ref={dropZoneRef}
            className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 text-center h-full min-h-[200px] flex items-center justify-center ${isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
              }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`p-3 rounded-full ${isDragActive
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? 'Drop your JSON file here' : 'Drag & drop your JSON file here'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">or</p>
              </div>
              <Button
                variant="secondary"
                onClick={triggerFileSelect}
                disabled={isUploading}
                size="sm"
                className="mt-2"
              >
                {isUploading ? 'Processing...' : 'Browse Files'}
              </Button>
            </div>
          </div>
        </div>

        {/* JSON Format Example - Right Side */}
        <div className="lg:w-80 xl:w-96">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 h-full">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Expected JSON format:</p>
            <pre className="bg-white dark:bg-gray-900 rounded-lg p-3 text-xs overflow-x-auto border border-gray-200 dark:border-gray-700 mb-3">
{`[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "source": "Website",
    "status": "New",
    "score": 85
  }
]`}
            </pre>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Replace mode:</strong> Clears existing leads and adds new ones
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Merge mode:</strong> Adds new leads, removes exact duplicates
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Status:</strong> New, Contacted, Qualified, or Unqualified
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Score:</strong> Number between 0-100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && parsedLeads && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Confirm Upload
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                {uploadMode === 'replace' 
                  ? `This will replace all existing leads with ${parsedLeads.length} new leads from your file.`
                  : `This will add ${parsedLeads.length} new leads to your existing data. Duplicates will be removed based on matching all fields.`
                }
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={confirmUpload}
                >
                  {uploadMode === 'replace' ? 'Replace All' : 'Add Leads'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={cancelUpload}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Upload Error</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Success!</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
