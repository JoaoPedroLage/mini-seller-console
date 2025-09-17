'use client';

import { Lead } from "@/types";
import { cn } from "@/lib/utils"; // Import cn for conditional classes

interface LeadsTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onRowClick }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No leads found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile card view */}
      <div className="block lg:hidden space-y-4 p-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onRowClick(lead)}
            className="bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-xl p-5 border border-gray-200/60 dark:border-gray-700/60 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{lead.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lead.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
                  lead.status === 'New' && 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
                  lead.status === 'Contacted' && 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
                  lead.status === 'Qualified' && 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
                  lead.status === 'Unqualified' && 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
                )}>
                  {lead.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Lead Score</span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{lead.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full divide-y divide-gray-200/60 dark:divide-gray-700/60">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Lead Information</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200/60 dark:divide-gray-700/60">
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                onClick={() => onRowClick(lead)}
                className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-purple-50/30 dark:hover:from-primary-900/20 dark:hover:to-purple-900/20 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 dark:from-primary-400 dark:to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{lead.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border",
                    lead.status === 'New' && 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
                    lead.status === 'Contacted' && 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
                    lead.status === 'Qualified' && 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
                    lead.status === 'Unqualified' && 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
                  )}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{lead.score}</span>
                    <div className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500 group-hover:bg-primary-600 dark:group-hover:bg-primary-300 transition-colors"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}