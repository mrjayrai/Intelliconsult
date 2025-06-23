'use client';

import { useState } from 'react';
import Image from 'next/image';

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

// Static dummy data
const staticAssignedTrainings: AssignedTraining[] = [
  {
    _id: '1',
    assignedDate: '2025-06-01',
    trainingId: {
      _id: '101',
      name: 'React Basics',
      startDate: '2025-06-01',
      endDate: '2025-06-10',
      trainerName: 'John Doe',
      skillsToBeAcquired: ['React', 'JSX', 'Hooks']
    }
  },
  {
    _id: '2',
    assignedDate: '2025-06-05',
    trainingId: {
      _id: '102',
      name: 'Next.js Fundamentals',
      startDate: '2025-06-10',
      endDate: '2025-06-20',
      trainerName: 'Jane Smith',
      skillsToBeAcquired: ['Routing', 'SSR', 'API Routes']
    }
  },
  {
    _id: '3',
    assignedDate: '2025-06-10',
    trainingId: {
      _id: '103',
      name: 'Tailwind CSS',
      startDate: '2025-06-15',
      endDate: '2025-06-25',
      trainerName: 'Michael Lee',
      skillsToBeAcquired: ['Utility classes', 'Responsive design']
    }
  }
];

const staticCompletedTrainings: CompletedTraining[] = [
  {
    _id: '201',
    completedDate: '2025-05-30',
    score: 90,
    feedback: 'Great content, learned a lot!',
    certificateUrl: 'https://example.com/certificate-201.pdf',
    trainingId: {
      _id: '301',
      name: 'JavaScript Mastery',
      startDate: '2025-05-01',
      endDate: '2025-05-20',
      trainerName: 'Alice Brown',
      skillsToBeAcquired: ['ES6+', 'Async/Await', 'DOM Manipulation']
    }
  }
];

export default function TrainingPage() {
  const [assignedPage, setAssignedPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-10 text-center">My Trainings</h1>

      {/* Assigned Trainings */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-400">
          Assigned Trainings
        </h2>
        {staticAssignedTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No assigned trainings found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginate(staticAssignedTrainings, assignedPage).map((training) => (
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
            {renderPagination(staticAssignedTrainings.length, assignedPage, setAssignedPage)}
          </>
        )}
      </section>

      {/* Completed Trainings */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-400">
          Completed Trainings
        </h2>
        {staticCompletedTrainings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">You haven’t completed any trainings yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginate(staticCompletedTrainings, completedPage).map((training) => (
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
                    <a
                      href={training.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Certificate
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination(staticCompletedTrainings.length, completedPage, setCompletedPage)}
          </>
        )}
      </section>
    </div>
  );
}
