'use client';

import { Opportunity } from "@/types";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
}

export default function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  if (opportunities.length === 0) {
    return null; // Don't render anything if there are no opportunities
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Opportunities</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Opportunity Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {opportunities.map((opp) => (
              <tr key={opp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{opp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{opp.accountName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {opp.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}