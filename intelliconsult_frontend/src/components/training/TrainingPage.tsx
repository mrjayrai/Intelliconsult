// "use client";
// import React from "react";

// export default function TrainingPage() {
  
  
  
//   return (
//     <>
//     {/* Skills Page to be designed here */}
//     </>
//   );
// }

// app/training.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AssignedTraining {
  _id: string;
  assignedDate: string;
  trainingId: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    trainerName: string;
    skillsToBeAcquired: string[];
  };
}

interface CompletedTraining {
  trainingId: string;
  completedDate: string;
  score: number;
  certificateUrl: string;
  feedback: string;
  _id: string;
}

export default function TrainingPage() {
  const { authData } = useAuth();
  const userId = authData?.user?._id;

  const [assignedTrainings, setAssignedTrainings] = useState<AssignedTraining[]>([]);
  const [completedTrainings, setCompletedTrainings] = useState<CompletedTraining[]>([]);
  const [loadingAssigned, setLoadingAssigned] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchAssignedTrainings = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/trainings/assigned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const result = await response.json();
        setAssignedTrainings(result.data.trainings);
      } catch (error) {
        console.error('Error fetching assigned trainings:', error);
      } finally {
        setLoadingAssigned(false);
      }
    };

    const fetchCompletedTrainings = async () => {
      try {
        const response = await fetch(`/api/completed-training?userId=${userId}`);
        const result = await response.json();
        setCompletedTrainings(result.data.trainingsCompleted);
      } catch (error) {
        console.error('Error fetching completed trainings:', error);
      } finally {
        setLoadingCompleted(false);
      }
    };

    fetchAssignedTrainings();
    fetchCompletedTrainings();
  }, [userId]);

  if (!userId) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please log in to view your training dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-center">📚 My Trainings</h1>

      {/* Assigned Trainings Box */}
      <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6 max-h-[400px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">📌 Assigned Trainings</h2>
        {loadingAssigned ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : assignedTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No assigned trainings found.</p>
        ) : (
          <div className="space-y-4">
            {assignedTrainings.map((training) => (
              <div key={training._id} className="bg-white dark:bg-gray-700 p-3 rounded shadow">
                <p className="font-medium">{training.trainingId.name}</p>
                <p className="text-sm">Trainer: {training.trainingId.trainerName}</p>
                <p className="text-sm">
                  Duration: {new Date(training.trainingId.startDate).toLocaleDateString()} -{' '}
                  {new Date(training.trainingId.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm">Skills: {training.trainingId.skillsToBeAcquired.join(', ')}</p>
                <p className="text-xs italic mt-1 text-gray-500 dark:text-gray-400">
                  Assigned on: {new Date(training.assignedDate).toDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Trainings Box */}
      <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-4 max-h-[500px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">✅ Completed Trainings</h2>
        {loadingCompleted ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : completedTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">You haven’t completed any trainings yet.</p>
        ) : (
          <div className="space-y-4">
            {completedTrainings.map((training) => (
              <div key={training._id} className="bg-white dark:bg-gray-700 p-3 rounded shadow">
                <p className="font-medium text-gray-800 dark:text-gray-100">Training ID: {training.trainingId}</p>
                <p className="text-xs">Completed on: {new Date(training.completedDate).toDateString()}</p>
                <p className="text-sm">Score: {training.score}%</p>
                <p className="text-xs italic mt-1">“{training.feedback}”</p>
                <Link
                  href={training.certificateUrl}
                  target="_blank"
                  className="block mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  🎓 View Certificate
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
