'use client';

import { Lead, LeadStatus, Opportunity } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validateEmail } from "@/lib/utils";
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLead: Lead) => void;
  onConvert: (opportunity: Opportunity) => void;
}

export default function LeadDetailPanel({ lead, isOpen, onClose, onSave, onConvert }: LeadDetailPanelProps) {
  const [editedEmail, setEditedEmail] = useState(lead?.email || '');
  const [editedStatus, setEditedStatus] = useState<LeadStatus>(lead?.status || 'New');
  const [emailError, setEmailError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setEditedEmail(lead.email);
      setEditedStatus(lead.status);
      setEmailError('');
    }
  }, [lead]);

  const handleSave = async () => {
    if (!validateEmail(editedEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (lead) {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onSave({ ...lead, email: editedEmail, status: editedStatus });
      setIsSaving(false);
      onClose();
    }
  };

  const handleConvert = async () => {
    if (lead) {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      const newOpportunity: Opportunity = {
        id: `opp-${Date.now()}`,
        name: `${lead.name}'s Opportunity`,
        stage: 'Prospecting',
        amount: Math.floor(Math.random() * 50000) + 5000,
        accountName: lead.company,
      };
      onConvert(newOpportunity);
      setIsSaving(false);
      onClose();
    }
  }

  const statusOptions: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-900/80 dark:bg-black/90 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-2xl">
                    {/* Enhanced header */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-800 dark:via-blue-900 dark:to-purple-800 px-6 py-8 sm:px-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="w-12 h-12 bg-white/20 dark:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {lead?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <Dialog.Title className="text-2xl font-bold text-white">{lead?.name}</Dialog.Title>
                              <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">{lead?.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-blue-100 dark:text-blue-200">
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              <span className="text-sm">{lead?.email}</span>
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ml-4 rounded-full bg-white/10 dark:bg-white/20 backdrop-blur-sm p-2 text-white hover:bg-white/20 dark:hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={onClose}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 px-6 py-8 sm:px-8">
                      {/* Lead score display */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{lead?.score}</div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Lead Score</div>
                          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 transition-all duration-500"
                              style={{ width: `${Math.min((lead?.score || 0) / 100 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Form section */}
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">E-mail Address</label>
                          <Input 
                            id="email" 
                            value={editedEmail} 
                            onChange={(e): void => { setEditedEmail(e.target.value); setEmailError(''); }} 
                            disabled={isSaving}
                            className="text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          />
                          {emailError && (
                            <div className="mt-2 flex items-center space-x-2 text-red-600 dark:text-red-400">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm">{emailError}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Lead Status</label>
                          <select 
                            id="status" 
                            value={editedStatus} 
                            onChange={(e) => setEditedStatus(e.target.value as LeadStatus)} 
                            className="h-12 w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 text-base text-gray-900 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSaving}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Convert to Opportunity</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">Ready to move this lead into your sales pipeline? Convert it to an opportunity to start tracking deal progress.</p>
                          <Button 
                            variant="gradient" 
                            onClick={handleConvert} 
                            className="w-full" 
                            disabled={isSaving}
                            size="lg"
                          >
                            {isSaving ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Converting...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span>🚀</span>
                                <span>Convert to Opportunity</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced action buttons */}
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-6 sm:px-8">
                      <div className="flex justify-end space-x-4">
                        <Button variant="secondary" onClick={onClose} disabled={isSaving} size="lg">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} size="lg">
                          {isSaving ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}