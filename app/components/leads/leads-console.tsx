'use client';

import { Lead, LeadStatus, Opportunity } from "@/types";
import { useEffect, useMemo, useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { Input } from "../ui/input";
import LeadsTable from "./leads-table";
import LeadDetailPanel from "./lead-detail-panel";
import OpportunitiesTable from "../opportunities/opportunities-table";

export default function LeadsConsole() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useLocalStorage<Opportunity[]>('opportunities', []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [statusFilter, setStatusFilter] = useLocalStorage<LeadStatus | 'All'>('statusFilter', 'All');
  
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
    return allLeads
      .filter(lead => {
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.score - a.score);
  }, [allLeads, searchTerm, statusFilter]);
  
  const handleSaveLead = (updatedLead: Lead) => {
    setAllLeads(prevLeads => prevLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  }

  const handleConvertToOpportunity = (opportunity: Opportunity) => {
    setOpportunities([...opportunities, opportunity]);
    setAllLeads(prevLeads => prevLeads.filter(lead => lead.name !== opportunity.name.replace("'s Opportunity", "")));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search by name or company..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
          className="w-full sm:w-48 rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Unqualified">Unqualified</option>
        </select>
      </div>

      <div className="rounded-lg border border-slate-200 shadow-sm">
        {isLoading && <p className="text-center p-8">Loading leads...</p>}
        {error && <p className="text-center p-8 text-red-600">Error: {error}</p>}
        {!isLoading && !error && (
          <LeadsTable leads={filteredLeads} onRowClick={setSelectedLead} />
        )}
      </div>

      <OpportunitiesTable opportunities={opportunities} />

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