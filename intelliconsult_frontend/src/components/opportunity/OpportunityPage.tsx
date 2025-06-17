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
  {
    id: 3,
    title: 'DevOps Role',
    description: 'Infrastructure automation and CI/CD pipelines.',
    sentBy: 'Manager Lee',
    accepted: false,
  },
  {
    id: 4,
    title: 'QA Engineer',
    description: 'Manual and automation testing responsibilities.',
    sentBy: 'Manager Amy',
    accepted: false,
  },
  {
    id: 5,
    title: 'Product Manager',
    description: 'Responsible for product planning and strategy.',
    sentBy: 'Manager Max',
    accepted: false,
  },
  {
    id: 6,
    title: 'Fullstack Developer',
    description: 'Working with both frontend and backend systems.',
    sentBy: 'Manager Nina',
    accepted: false,
  },
];

const CARDS_PER_PAGE = 3;

export default function OpportunityPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(dummyOpportunities);
  const [page, setPage] = useState(1);

  const acceptOpportunity = (id: number) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, accepted: true } : opp))
    );
  };

  const invitedOpportunities = opportunities.filter((opp) => !opp.accepted);
  const acceptedOpportunities = opportunities.filter((opp) => opp.accepted);

  const totalPages = Math.ceil(invitedOpportunities.length / CARDS_PER_PAGE);

  const paginatedData = invitedOpportunities.slice(
    (page - 1) * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Opportunities</h1>

      {/* Invited Opportunities */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-6">Invited Opportunities</h2>
        {invitedOpportunities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No invitations at the moment.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-xl shadow bg-gray-100 dark:bg-gray-800 transition hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-2">{opp.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{opp.description}</p>
                  <p className="text-sm mt-2 text-gray-500">Sent by: {opp.sentBy}</p>
                  <button
                    onClick={() => acceptOpportunity(opp.id)}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>

            {/* Stylish Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                const pg = index + 1;
                const isActive = page === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`px-4 py-2 rounded-full border transition ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Accepted Opportunities */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Accepted Opportunities</h2>
        {acceptedOpportunities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No accepted opportunities yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-xl shadow bg-green-100 dark:bg-green-800 transition hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-2">{opp.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-200">{opp.description}</p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">Sent by: {opp.sentBy}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
