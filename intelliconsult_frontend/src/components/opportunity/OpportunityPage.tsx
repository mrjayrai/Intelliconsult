'use client';

import React, { useState } from 'react';

interface Opportunity {
  id: number;
  title: string;
  description: string;
  sentBy: string;
  accepted: boolean;
}

const dummyOpportunities: Opportunity[] = [
  {
    id: 1,
    title: 'React Developer Position',
    description: 'A role focused on frontend development using React.',
    sentBy: 'Manager John',
    accepted: false,
  },
  {
    id: 2,
    title: 'Backend Engineer',
    description: 'Looking for an expert in Node.js and databases.',
    sentBy: 'Manager Sarah',
    accepted: false,
  },
];

export default function OpportunityPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(dummyOpportunities);

  const acceptOpportunity = (id: number) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, accepted: true } : opp))
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Opportunities</h1>

      {/* Invited Opportunities */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Invited Opportunities</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {opportunities.filter(o => !o.accepted).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No invitations at the moment.</p>
          ) : (
            opportunities
              .filter((opp) => !opp.accepted)
              .map((opp) => (
                <div key={opp.id} className="p-4 rounded-lg shadow bg-gray-100 dark:bg-gray-800">
                  <h3 className="text-lg font-medium">{opp.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{opp.description}</p>
                  <p className="text-sm mt-1 text-gray-500">Sent by: {opp.sentBy}</p>
                  <button
                    onClick={() => acceptOpportunity(opp.id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Accept
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Accepted Opportunities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accepted Opportunities</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {opportunities.filter(o => o.accepted).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No accepted opportunities yet.</p>
          ) : (
            opportunities
              .filter((opp) => opp.accepted)
              .map((opp) => (
                <div key={opp.id} className="p-4 rounded-lg shadow bg-green-100 dark:bg-green-800">
                  <h3 className="text-lg font-medium">{opp.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{opp.description}</p>
                  <p className="text-sm mt-1 text-gray-500">Sent by: {opp.sentBy}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
