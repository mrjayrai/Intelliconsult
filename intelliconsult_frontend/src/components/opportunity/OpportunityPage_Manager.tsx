'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from "@/apiLink";

interface Opportunity {
  _id: string;
  name: string;
  postingDate: string;
}

export default function OpportunityPage_Manager() {
  const { authData } = useAuth();
  const managerId = authData?.user?._id || '';
  const todayDate = new Date().toISOString().split('T')[0];

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

  // Fetch existing opportunities for manager
  const fetchOpportunities = async () => {
    try {
      const res = await fetch(api+'opportunities/get-manager-opportunity', {
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

  // Create new opportunity
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
        // alert('Failed to create opportunity');
        return;
      }

      // alert('Opportunity created!');
      setFormData({
        name: '',
        keySkills: '',
        yearsOfExperience: '',
        postingDate: todayDate,
        lastDateToApply: '',
        numberOfOpenings: ''
      });
      setShowModal(false);
      fetchOpportunities(); // refresh list
    } catch (err) {
      console.error('Error:', err);
      // alert('Error creating opportunity');
    }
  };

  return (
    <div className="pt-20 px-6 pb-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manager Opportunity Portal</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create Opportunity
        </button>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {opportunities.map((opp) => (
          <div
            key={opp._id}
            className="flex items-center justify-center h-32 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md dark:shadow-lg bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition"
          >
            <p className="text-lg font-medium text-center truncate px-4">{opp.name}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow-2xl w-full max-w-xl z-60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create New Opportunity</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <input
                placeholder="Opportunity Title"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                placeholder="Key Skills (comma-separated)"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.keySkills}
                onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
              />
              <input
                placeholder="Years of Experience"
                type="number"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                value={formData.postingDate}
                readOnly
                disabled
              />
              <input
                type="date"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.lastDateToApply}
                onChange={(e) => setFormData({ ...formData, lastDateToApply: e.target.value })}
              />
              <input
                placeholder="Number of Openings"
                type="number"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.numberOfOpenings}
                onChange={(e) => setFormData({ ...formData, numberOfOpenings: e.target.value })}
              />
              <button
                onClick={handleCreateOpportunity}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
