/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MailIcon, UserIcon } from 'lucide-react';
import api from '@/apiLink';

interface Opportunity {
  text: string;
}

interface MatchedOpportunity {
  date: string;
  score: number;
  text: string;
}

interface ConsultantMatch {
  userId: string;
  name: string;
  email: string;
  matched_opportunities: MatchedOpportunity[];
}

export default function MatchedConsultantsPage() {
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('id');

  const [opportunityData, setOpportunityData] = useState<Opportunity | null>(null);
  const [matchedConsultants, setMatchedConsultants] = useState<ConsultantMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('matched_consultants');
      if (!stored) throw new Error('No matching data found in localStorage');

      const parsed = JSON.parse(stored);
      setOpportunityData(parsed.clustered_opportunities?.["Cluster 1"]?.[0]);
      const matches = parsed.consultant_matches;

      const filtered = matches.filter(
        (consultant: ConsultantMatch) => consultant.matched_opportunities.length > 0
      );

      setMatchedConsultants(filtered);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message || 'Failed to load matched consultants');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInvite = async (userId: string) => {
    try {
      const res = await fetch(api+'opportunities/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, opportunityId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(`Invite sent Successfully`);
    } catch (err: any) {
      alert(`Failed to send invite: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-600 dark:text-gray-300">⏳ Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen p-10 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Matched Consultants</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Opportunity: <strong>{opportunityData?.text || 'Unknown Opportunity'}</strong>
      </p>

      {matchedConsultants.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No consultants matched this opportunity.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {matchedConsultants.map((consultant) => {
            const topMatch = consultant.matched_opportunities[0];
            return (
              <div
                key={consultant.userId}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800 transition hover:shadow-md hover:scale-[1.02]"
              >
                <div className="mb-3 flex flex-col gap-1">
                  <div className="flex items-center text-lg font-medium">
                    <UserIcon className="w-5 h-5 text-blue-500 mr-2" />
                    {consultant.name || 'Unnamed Consultant'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MailIcon className="w-4 h-4 mr-2" />
                    {consultant.email || 'No Email'}
                  </div>
                </div>

                <div className="text-sm mt-3 text-gray-800 dark:text-gray-200">
                  <p className="mb-1 font-medium">{topMatch.text}</p>
                  <p className="text-sm mb-2 text-gray-500">📅 {topMatch.date}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                      topMatch.score >= 0.75
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : topMatch.score >= 0.5
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    Score: {topMatch.score.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleInvite(consultant.userId)}
                  className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                >
                  Send Invite
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
