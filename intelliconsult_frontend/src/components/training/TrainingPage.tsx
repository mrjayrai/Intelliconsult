'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import api from '@/apiLink';

interface TrainingData {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  trainerName: string;
  skillsToBeAcquired: string[];
}

interface AssignedTraining {
  _id: string;
  assignedDate: string;
  trainingId: TrainingData;
}

interface CompletedTraining {
  _id: string;
  trainingId: TrainingData;
  completedDate: string;
  score: number;
  certificateUrl: string;
  feedback: string;
}

const CARDS_PER_PAGE = 3;

export default function TrainingPage() {
  const { authData } = useAuth();
  const userId = authData?.user?._id;

  const [assignedTrainings, setAssignedTrainings] = useState<AssignedTraining[]>([]);
  const [completedTrainings, setCompletedTrainings] = useState<CompletedTraining[]>([]);
  const [loadingAssigned, setLoadingAssigned] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [assignedPage, setAssignedPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  useEffect(() => {
    if (!userId) return;

    const fetchAssignedTrainings = async () => {
      try {
        const response = await fetch(api + 'trainings/assigned', {
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
        const response = await fetch(api + 'trainings/get-completed-training', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
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

  const paginate = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  const renderPagination = (
    total: number,
    currentPage: number,
    setPage: (page: number) => void
  ) => {
    const totalPages = Math.ceil(total / CARDS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  if (!userId) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please log in to view your training dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-10 text-center">My Trainings</h1>

      {/* Assigned Trainings Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-400">
          Assigned Trainings
        </h2>
        {loadingAssigned ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : assignedTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No assigned trainings found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginate(assignedTrainings, assignedPage).map((training) => (
                <div
                  key={training._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg overflow-hidden"
                >
                  <Image
                    width={200}
                    height={40}
                    src="/images/logo/int_logo.png"
                    alt="Training Banner"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      {training.trainingId.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trainer: <span className="font-medium">{training.trainingId.trainerName}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Duration: {new Date(training.trainingId.startDate).toLocaleDateString()} -{' '}
                      {new Date(training.trainingId.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Skills: <span className="italic">{training.trainingId.skillsToBeAcquired.join(', ')}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Assigned on: {new Date(training.assignedDate).toDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination(assignedTrainings.length, assignedPage, setAssignedPage)}
          </>
        )}
      </section>

      {/* Completed Trainings Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-400">
          Completed Trainings
        </h2>
        {loadingCompleted ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : completedTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">You haven’t completed any trainings yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginate(completedTrainings, completedPage).map((training) => (
                <div
                  key={training._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg overflow-hidden"
                >
                  <Image
                    width={200}
                    height={40}
                    src="/images/logo/int_logo.png"
                    alt="Certificate Banner"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                      {training.trainingId.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trainer: <span className="font-medium">{training.trainingId.trainerName}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Duration: {new Date(training.trainingId.startDate).toLocaleDateString()} -{' '}
                      {new Date(training.trainingId.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Score: <span className="font-semibold">{training.score}%</span>
                    </p>
                    <p className="text-sm italic text-gray-500 dark:text-gray-300">
                      {training.feedback}
                    </p>
                    <Link
                      href={training.certificateUrl}
                      target="_blank"
                      className="block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination(completedTrainings.length, completedPage, setCompletedPage)}
          </>
        )}
      </section>
    </div>
  );
}
