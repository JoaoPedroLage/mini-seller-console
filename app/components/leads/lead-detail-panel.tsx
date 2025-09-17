'use client';

import { Lead, LeadStatus, Opportunity } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validateEmail } from "@/lib/utils";

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

  useEffect(() => {
    if (lead) {
      setEditedEmail(lead.email);
      setEditedStatus(lead.status);
      setEmailError('');
    }
  }, [lead]);

  const handleSave = () => {
    if (!validateEmail(editedEmail)) {
      setEmailError('Invalid email format.');
      return;
    }
    if (lead) {
      onSave({ ...lead, email: editedEmail, status: editedStatus });
      onClose();
    }
  };

  const handleConvert = () => {
    if (lead) {
      const newOpportunity: Opportunity = {
        id: `opp-${Date.now()}`,
        name: `${lead.name}'s Opportunity`,
        stage: 'Prospecting',
        accountName: lead.company,
      };
      onConvert(newOpportunity);
      onClose();
    }
  }

  const statusOptions: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Unqualified'];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-700" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="bg-blue-600 px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">{lead?.name}</Dialog.Title>
                      </div>
                      <p className="text-sm text-blue-200 mt-1">{lead?.company}</p>
                    </div>

                    <div className="relative flex-1 px-4 sm:px-6 py-6">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                          <Input id="email" value={editedEmail} onChange={(e) => { setEditedEmail(e.target.value); setEmailError(''); }} className="mt-1" />
                          {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                        </div>
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                          <select id="status" value={editedStatus} onChange={(e) => setEditedStatus(e.target.value as LeadStatus)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <hr />
                        <div>
                          <Button onClick={handleConvert} className="w-full">Convert to Opportunity</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-shrink-0 justify-end space-x-4 border-t border-gray-200 px-4 py-4">
                      <Button variant="secondary" onClick={onClose}>Cancel</Button>
                      <Button onClick={handleSave}>Save</Button>
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