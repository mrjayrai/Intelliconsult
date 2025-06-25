'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/apiLink';
import { useRouter } from 'next/navigation';

interface Opportunity {
  _id: string;
  name: string;
  keySkills: string[];
  postingDate: string;
}

export default function OpportunityPage_Manager() {
  const { authData } = useAuth();
  const managerId = authData?.user?._id || '';
  const todayDate = new Date().toISOString().split('T')[0];
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    keySkills: '',
    yearsOfExperience: '',
    postingDate: todayDate,
    lastDateToApply: '',
    numberOfOpenings: ''
  });

  const fetchOpportunities = async () => {
    try {
      const res = await fetch(api + 'opportunities/get-manager-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ managerId })
      });

      const data = await res.json();
      if (res.ok) {
        setOpportunities(data.opportunities);
      } else {
        console.error('Fetch error:', data.message);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchOpportunities();
    }
  }, [managerId]);

  const handleCreateOpportunity = async () => {
    const body = {
      name: formData.name,
      keySkills: formData.keySkills.split(',').map((skill) => skill.trim()),
      yearsOfExperience: Number(formData.yearsOfExperience),
      postingDate: new Date(formData.postingDate).toISOString(),
      lastDateToApply: new Date(formData.lastDateToApply).toISOString(),
      numberOfOpenings: Number(formData.numberOfOpenings),
      hiringManagerId: managerId
    };

    try {
      const res = await fetch(api + 'opportunities/add-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Error:', error);
        return;
      }

      setFormData({
        name: '',
        keySkills: '',
        yearsOfExperience: '',
        postingDate: todayDate,
        lastDateToApply: '',
        numberOfOpenings: ''
      });
      setShowModal(false);
      fetchOpportunities();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleMatchOpportunity = async (opp: Opportunity) => {
    try {
      const res = await fetch(api + 'opportunities/get-matched-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: opp.name,
          keySkills: opp.keySkills,
          postingDate: opp.postingDate
        })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(
  'matched_consultants',
  JSON.stringify({
    opportunity: opp, 
    consultant_matches: data.consultant_matches
  })
);
        router.push(`/manager/matched-consultants?id=${opp._id}`);
      } else {
        console.error('Matching failed:', data.message);
      }
    } catch (error) {
      console.error('Error matching opportunity:', error);
    }
  };

  return (
    <div className="pt-20 px-6 pb-12 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Manager Opportunity Portal</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          + Create Opportunity
        </button>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp._id}
            onClick={() => handleMatchOpportunity(opp)}
            className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg rounded-2xl p-4 flex flex-col justify-center items-center transition"
          >
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white truncate">{opp.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Posted: {opp.postingDate.split('T')[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Opportunity</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-3xl font-bold text-gray-500 hover:text-red-500 transition"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Opportunity Title</label>
                <input
                  placeholder="e.g. Frontend Developer"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Key Skills */}
              <div>
                <label className="block text-sm font-medium mb-1">Key Skills (comma-separated)</label>
                <input
                  placeholder="React, TypeScript, UI/UX"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.keySkills}
                  onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
                />
              </div>

              {/* Experience and Openings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Required Experience (Years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Openings</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.numberOfOpenings}
                    onChange={(e) => setFormData({ ...formData, numberOfOpenings: e.target.value })}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Posting Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    value={formData.postingDate}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Application End Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.lastDateToApply}
                    onChange={(e) => setFormData({ ...formData, lastDateToApply: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCreateOpportunity}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-xl transition"
              >
                Submit Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
