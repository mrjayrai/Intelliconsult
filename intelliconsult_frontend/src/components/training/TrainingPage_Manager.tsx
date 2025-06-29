'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/apiLink';

interface Training {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  trainerName: string;
}

interface Consultant {
  _id: string;
  name: string;
  email: string;
}

export default function TrainingPage_Manager() {
  const { authData } = useAuth();
  const managerId = authData?.user?._id || '';
  const todayDate = new Date().toISOString().split('T')[0];

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [markCompleted, setMarkCompleted] = useState(false);
  const [completionDetails, setCompletionDetails] = useState({
    completedDate: todayDate,
    score: '',
    certificateUrl: '',
    feedback: ''
  });

  const fetchTrainings = async () => {
    try {
      const res = await fetch(api + 'trainings/get-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) setTrainings(data.data);
    } catch (err) {
      console.error('Error fetching trainings:', err);
    }
  };

  const fetchConsultants = async () => {
    try {
      const res = await fetch(api + 'users/get-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) setConsultants(data.consultants);
    } catch (err) {
      console.error('Error fetching consultants:', err);
    }
  };

  const assignTrainingToConsultant = async () => {
    if (!selectedTrainingId || !selectedConsultant) return;

    const payload = markCompleted
      ? {
          userId: selectedConsultant,
          trainingId: selectedTrainingId,
          completedDate: new Date(completionDetails.completedDate).toISOString(),
          score: Number(completionDetails.score),
          certificateUrl: completionDetails.certificateUrl,
          feedback: completionDetails.feedback
        }
      : {
          userId: selectedConsultant,
          trainingId: selectedTrainingId,
          assignedDate: new Date().toISOString()
        };

    const endpoint = markCompleted
      ? api + 'trainings/add-completed-training'
      : api + 'trainings/assign-training';

    setLoadingAssign(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAssignModal(false);
        setSelectedConsultant('');
        setSelectedTrainingId('');
        setMarkCompleted(false);
        setCompletionDetails({
          completedDate: todayDate,
          score: '',
          certificateUrl: '',
          feedback: ''
        });
      }
    } catch (err) {
      console.error('Assignment failed:', err);
    } finally {
      setLoadingAssign(false);
    }
  };

  const openAssignModal = (trainingId: string) => {
    setSelectedTrainingId(trainingId);
    fetchConsultants();
    setShowAssignModal(true);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Manage Trainings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainings.map((training) => (
          <div
            key={training._id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition duration-300"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-center truncate">{training.name}</h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mb-1">
                <span className="font-medium">Trainer:</span> {training.trainerName}
              </p>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                {new Date(training.startDate).toLocaleDateString()} → {new Date(training.endDate).toLocaleDateString()}
              </p>
            </div>
            <button
              className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
              onClick={() => openAssignModal(training._id)}
            >
              Assign Consultant
            </button>
          </div>
        ))}
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl p-6 shadow-2xl w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Assign Training</h2>

            <label className="block font-medium mb-1">Select Consultant:</label>
            <select
              className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
              value={selectedConsultant}
              onChange={(e) => setSelectedConsultant(e.target.value)}
            >
              <option value="">-- Select Consultant --</option>
              {consultants.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="completed"
                checked={markCompleted}
                onChange={(e) => setMarkCompleted(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="completed">Mark as Completed</label>
            </div>

            {markCompleted && (
              <div className="space-y-3">
                <input
                  type="date"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={completionDetails.completedDate}
                  onChange={(e) => setCompletionDetails({ ...completionDetails, completedDate: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Score"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={completionDetails.score}
                  onChange={(e) => setCompletionDetails({ ...completionDetails, score: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Certificate URL"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={completionDetails.certificateUrl}
                  onChange={(e) => setCompletionDetails({ ...completionDetails, certificateUrl: e.target.value })}
                />
                <textarea
                  placeholder="Feedback"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={completionDetails.feedback}
                  onChange={(e) => setCompletionDetails({ ...completionDetails, feedback: e.target.value })}
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedConsultant('');
                  setSelectedTrainingId('');
                  setMarkCompleted(false);
                  setCompletionDetails({
                    completedDate: todayDate,
                    score: '',
                    certificateUrl: '',
                    feedback: ''
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                onClick={assignTrainingToConsultant}
                disabled={!selectedConsultant || loadingAssign}
              >
                {loadingAssign ? 'Submitting...' : markCompleted ? 'Submit Completion' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
