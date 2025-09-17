'use client';

import { Opportunity } from "@/types";
import { cn } from "@/lib/utils";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
}

export default function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  if (opportunities.length === 0) {
    return null; 
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Opportunities</h2>
            <p className="text-primary-100 mt-1">Track your sales pipeline</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{opportunities.length}</div>
            <div className="text-primary-100 text-sm">Active</div>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block lg:hidden space-y-4 p-6">
        {opportunities.map((opp, index) => (
          <div
            key={opp.id}
            className="bg-gradient-to-r from-white to-gray-50/50 rounded-xl p-5 border border-gray-200/60 hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{opp.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{opp.accountName}</p>
              </div>
              <span className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ml-3 shrink-0 border",
                opp.stage === 'Prospecting' && 'bg-purple-100 text-purple-800 border-purple-200',
                opp.stage === 'Proposal' && 'bg-indigo-100 text-indigo-800 border-indigo-200',
                opp.stage === 'Closed' && 'bg-green-100 text-green-800 border-green-200',
              )}>
                {opp.stage}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Deal Value</span>
              <span className="text-xl font-bold text-green-600">
                {opp.amount ? `$${opp.amount.toLocaleString()}` : '-'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full divide-y divide-gray-200/60">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Opportunity</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Stage</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Deal Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/60">
            {opportunities.map((opp, index) => (
              <tr
                key={opp.id}
                className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-primary-50/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      💼
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{opp.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{opp.accountName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border",
                    opp.stage === 'Prospecting' && 'bg-purple-100 text-purple-800 border-purple-200',
                    opp.stage === 'Proposal' && 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    opp.stage === 'Closed' && 'bg-green-100 text-green-800 border-green-200',
                  )}>
                    {opp.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xl font-bold text-green-600">
                      {opp.amount ? `$${opp.amount.toLocaleString()}` : '-'}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-400 group-hover:bg-green-600 transition-colors"></div>
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