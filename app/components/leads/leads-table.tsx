'use client';

import { Lead } from "@/types";

interface LeadsTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onRowClick }: LeadsTableProps) {
  if (leads.length === 0) {
    return <p className="text-center text-slate-500 py-8">No leads found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {leads.map((lead) => (
            <tr key={lead.id} onClick={() => onRowClick(lead)} className="hover:bg-slate-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                <div className="text-sm text-slate-500 sm:hidden">{lead.company}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">{lead.company}</td>
              <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{lead.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}