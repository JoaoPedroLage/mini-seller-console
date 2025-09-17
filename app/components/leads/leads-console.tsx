'use client';

import { Lead, LeadStatus, Opportunity } from "@/types";
import { useEffect, useMemo, useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { Input } from "../ui/input";
import LeadsTable from "./leads-table";
import LeadDetailPanel from "./lead-detail-panel";
import OpportunitiesTable from "../opportunities/opportunities-table";
import FileUpload from "../ui/file-upload";
import ThemeToggle from "../ui/theme-toggle";

export default function LeadsConsole() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities, isOpportunitiesHydrated] = useLocalStorage<Opportunity[]>('opportunities', []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm, isSearchHydrated] = useLocalStorage('searchTerm', '');
  const [statusFilter, setStatusFilter, isStatusHydrated] = useLocalStorage<LeadStatus | 'All'>('statusFilter', 'All');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/leads');
        if (!res.ok) throw new Error('Failed to fetch data.');
        const data: Lead[] = await res.json();
        setAllLeads(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    if (!isSearchHydrated || !isStatusHydrated) {
      return allLeads.sort((a, b) => b.score - a.score);
    }

    return allLeads
      .filter(lead => {
        const matchesSearch =
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.score - a.score);
  }, [allLeads, searchTerm, statusFilter, isSearchHydrated, isStatusHydrated]);

  const handleSaveLead = (updatedLead: Lead) => {
    setAllLeads(prevLeads => prevLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  }

  const handleConvertToOpportunity = (opportunity: Opportunity) => {
    setOpportunities([...opportunities, opportunity]);
    setAllLeads(prevLeads => prevLeads.filter(lead => lead.id !== (selectedLead as Lead).id));
  }

  const handleFileUpload = (uploadedLeads: Lead[], mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      // Replace all existing leads
      setAllLeads(uploadedLeads.sort((a, b) => b.score - a.score));
    } else {
      // Merge with existing leads, removing duplicates
      setAllLeads(prevLeads => {
        // Create a Set to track existing leads by all their properties
        const existingLeadsSet = new Set(
          prevLeads.map(lead => 
            `${lead.id}-${lead.name}-${lead.email}-${lead.company}-${lead.source}-${lead.status}-${lead.score}`
          )
        );

        // Filter out duplicates from uploaded leads
        const newLeads = uploadedLeads.filter(lead => {
          const leadKey = `${lead.id}-${lead.name}-${lead.email}-${lead.company}-${lead.source}-${lead.status}-${lead.score}`;
          return !existingLeadsSet.has(leadKey);
        });

        // Combine and sort
        const updatedLeads = [...prevLeads, ...newLeads];
        return updatedLeads.sort((a, b) => b.score - a.score);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lead Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your sales leads</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Modern search and filter section */}
      <div className="card p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Upload Leads</label>
            <FileUpload onLeadsUpload={handleFileUpload} />
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Search Leads</label>
              <Input 
                placeholder="Search by name or company..." 
                value={isSearchHydrated ? searchTerm : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="lg:min-w-[240px]">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filter by Status</label>
              <select 
                value={isStatusHydrated ? statusFilter : 'All'}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
                className="h-12 w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 text-sm transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:outline-none text-gray-900 dark:text-gray-100"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Unqualified">Unqualified</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{filteredLeads.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{filteredLeads.filter(l => l.status === 'Qualified').length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Qualified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{filteredLeads.filter(l => l.status === 'Contacted').length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Contacted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{filteredLeads.filter(l => l.status === 'New').length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">New</div>
          </div>
        </div>
      </div>

      {/* Enhanced leads table container */}
      <div className="card overflow-hidden">
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading leads...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 dark:text-gray-400">{error}. Please try again later.</p>
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <LeadsTable leads={filteredLeads} onRowClick={setSelectedLead} />
        )}
      </div>

      {/* Opportunities section with enhanced styling */}
      {isOpportunitiesHydrated && <OpportunitiesTable opportunities={opportunities} />}

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onSave={handleSaveLead}
        onConvert={handleConvertToOpportunity}
      />
    </div>
  );
}