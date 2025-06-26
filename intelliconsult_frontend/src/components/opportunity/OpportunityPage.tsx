'use client';

import React, { useState, useEffect } from 'react';
import api from '@/apiLink';
import { useAuth } from '@/context/AuthContext';

interface RawOpportunity {
  _id: string;
  name: string;
  keySkills: string[];
  yearsOfExperience: number;
  postingDate: string;
  lastDateToApply: string;
  hiringManagerName: string;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  sentBy: string;
}

const CARDS_PER_PAGE = 3;

export default function OpportunityPage() {
  const { authData } = useAuth();

  const [invited, setInvited] = useState<Opportunity[]>([]);
  const [accepted, setAccepted] = useState<Opportunity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapOpportunity = (item: RawOpportunity): Opportunity => ({
    id: item._id,
    title: item.name,
    description: `Skills: ${item.keySkills.join(', ')} | Experience: ${item.yearsOfExperience} years`,
    sentBy: item.hiringManagerName,
  });

  const fetchData = async () => {
    if (!authData?.user?._id) return;

    setLoading(true);
    setError(null);

    try {
      const [invitedRes, acceptedRes] = await Promise.all([
        fetch(api + 'opportunities/fetch-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authData.user._id }),
        }),
        fetch(api + 'opportunities/fetch-accept-opportunity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authData.user._id }),
        }),
      ]);

      const invitedData = await invitedRes.json();
      const acceptedData = await acceptedRes.json();

      setInvited(invitedData.opportunities.map(mapOpportunity));
      setAccepted(acceptedData.opportunities.map(mapOpportunity));
    } catch (err) {
      console.error(err);
      setError('Failed to load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authData]);

  const acceptOpportunity = async (id: string) => {
    try {
      const res = await fetch(api + 'opportunities/accept-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authData?.user?._id, opportunityId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        const acceptedOpp = invited.find((opp) => opp.id === id);
        if (acceptedOpp) {
          setInvited((prev) => prev.filter((opp) => opp.id !== id));
          setAccepted((prev) => [...prev, acceptedOpp]);
        }
      } else {
        console.error('Failed to accept:', data.message);
      }
    } catch (err) {
      console.error('Error while accepting opportunity:', err);
    }
  };

  const totalPages = Math.ceil(invited.length / CARDS_PER_PAGE);
  const paginated = invited.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Opportunities</h1>

      {/* Invited Opportunities */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6">Invited Opportunities</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paginated.length === 0 ? (
          <p className="text-gray-500">No invitations at the moment.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginated.map((opp) => (
                <div
                  key={opp.id}
                  className="flex flex-col justify-between h-full p-5 rounded-xl shadow bg-gray-100 dark:bg-gray-800 transition hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{opp.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{opp.description}</p>
                    <p className="text-sm mt-2 text-gray-500">Sent by: {opp.sentBy}</p>
                  </div>
                  <button
                    onClick={() => acceptOpportunity(opp.id)}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => {
                  const pg = i + 1;
                  const active = pg === page;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`px-4 py-2 rounded-full border transition ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Accepted Opportunities */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Accepted Opportunities</h2>
        {accepted.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No accepted opportunities yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {accepted.map((opp) => (
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
      </section>
    </div>
  );
}
