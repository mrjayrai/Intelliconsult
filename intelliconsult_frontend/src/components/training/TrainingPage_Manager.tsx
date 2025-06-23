'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Training {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  trainerName: string;
  noOfSeats: number;
  skillsToBeAcquired: string[];
}

export default function TrainingPage_Manager() {
  const { authData } = useAuth();
  const managerId = authData?.user?._id || '';
  const todayDate = new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    trainerName: '',
    noOfSeats: '',
    eligibilityCriteria: 'JavaScript, HTML, CSS',
    prerequisites: 'React, Node.js',
    passingAttendance: '80',
    passingMarks: '60',
    skillsToBeAcquired: 'JavaScript, ES6, Asynchronous Programming'
  });

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/trainings/manager/${managerId}`);
      const data = await res.json();
      if (res.ok) {
        setTrainings(data.data);
      }
    } catch (err) {
      console.error('Error fetching trainings:', err);
    }
  };

  useEffect(() => {
    if (managerId) fetchTrainings();
  }, [managerId]);

  const handleCreateTraining = async () => {
    const body = {
      name: formData.name,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      trainerName: formData.trainerName,
      noOfSeats: Number(formData.noOfSeats),
      eligibilityCriteria: {
        yearsOfExperience: 1,
        mustHaveSkills: formData.eligibilityCriteria.split(',').map((s) => s.trim())
      },
      prerequisites: {
        goodToKnowSkills: formData.prerequisites.split(',').map((s) => s.trim())
      },
      passingCriteria: {
        minAttendancePercentage: Number(formData.passingAttendance),
        minMarks: Number(formData.passingMarks)
      },
      skillsToBeAcquired: formData.skillsToBeAcquired.split(',').map((s) => s.trim()),
      managerId
    };

    try {
      const res = await fetch('http://localhost:4000/api/trainings/add-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          trainerName: '',
          noOfSeats: '',
          eligibilityCriteria: 'JavaScript, HTML, CSS',
          prerequisites: 'React, Node.js',
          passingAttendance: '80',
          passingMarks: '60',
          skillsToBeAcquired: 'JavaScript, ES6, Asynchronous Programming'
        });
        setShowModal(false);
        fetchTrainings();
      }
    } catch (err) {
      console.error('Error creating training:', err);
    }
  };

  return (
    <div className="pt-20 px-6 pb-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manager Training Portal</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create Training
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trainings.map((t) => (
          <div
            key={t._id}
            className="flex flex-col gap-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md dark:shadow-lg bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-medium">{t.name}</h2>
            <p className="text-sm">{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</p>
            <p className="text-sm">Trainer: {t.trainerName}</p>
            <p className="text-sm">Skills: {t.skillsToBeAcquired.join(', ')}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow-2xl w-full max-w-xl z-60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create New Training</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl font-bold text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <input
                placeholder="Training Name"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                placeholder="Trainer Name"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.trainerName}
                onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
              />
              <input
                type="datetime-local"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <input
                type="datetime-local"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <input
                placeholder="No of Seats"
                type="number"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.noOfSeats}
                onChange={(e) => setFormData({ ...formData, noOfSeats: e.target.value })}
              />
              <input
                placeholder="Eligibility Skills (comma-separated)"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.eligibilityCriteria}
                onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
              />
              <input
                placeholder="Prerequisites (comma-separated)"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              />
              <input
                placeholder="Skills to be Acquired (comma-separated)"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                value={formData.skillsToBeAcquired}
                onChange={(e) => setFormData({ ...formData, skillsToBeAcquired: e.target.value })}
              />
              <button
                onClick={handleCreateTraining}
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
