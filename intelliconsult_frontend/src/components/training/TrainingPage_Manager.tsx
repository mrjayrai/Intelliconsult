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

interface CompletionDetails {
  completedDate: string;
  score: string;
  certificateUrl: string;
  feedback: string;
}

interface CreateFormData {
  name: string;
  startDate: string;
  endDate: string;
  trainerName: string;
  noOfSeats: number;
  eligibilityCriteria: {
    yearsOfExperience: number;
    mustHaveSkills: string;
  };
  prerequisites: {
    goodToKnowSkills: string;
  };
  passingCriteria: {
    minAttendancePercentage: number;
    minMarks: number;
  };
  skillsToBeAcquired: string;
}

export default function TrainingPage_Manager() {
  const { authData } = useAuth();
  const managerId = authData?.user?._id ?? '';
  const todayDate: string = new Date().toISOString().split('T')[0];

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');
  const [selectedConsultant, setSelectedConsultant] = useState<string>('');
  const [loadingAssign, setLoadingAssign] = useState<boolean>(false);
  const [markCompleted, setMarkCompleted] = useState<boolean>(false);

  const [completionDetails, setCompletionDetails] = useState<CompletionDetails>({
    completedDate: todayDate,
    score: '',
    certificateUrl: '',
    feedback: ''
  });

  const [formData, setFormData] = useState<CreateFormData>({
    name: '',
    startDate: todayDate,
    endDate: '',
    trainerName: '',
    noOfSeats: 25,
    eligibilityCriteria: { yearsOfExperience: 0, mustHaveSkills: '' },
    prerequisites: { goodToKnowSkills: '' },
    passingCriteria: { minAttendancePercentage: 80, minMarks: 60 },
    skillsToBeAcquired: ''
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async (): Promise<void> => {
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

  const fetchConsultants = async (): Promise<void> => {
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

  const assignTrainingToConsultant = async (): Promise<void> => {
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
        setCompletionDetails({ completedDate: todayDate, score: '', certificateUrl: '', feedback: '' });
      }
    } catch (err) {
      console.error('Assignment failed:', err);
    } finally {
      setLoadingAssign(false);
    }
  };

  const handleCreateTraining = async (): Promise<void> => {
    const body = {
      name: formData.name,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      trainerName: formData.trainerName,
      noOfSeats: Number(formData.noOfSeats),
      eligibilityCriteria: {
        yearsOfExperience: Number(formData.eligibilityCriteria.yearsOfExperience),
        mustHaveSkills: formData.eligibilityCriteria.mustHaveSkills.split(',').map(s => s.trim())
      },
      prerequisites: {
        goodToKnowSkills: formData.prerequisites.goodToKnowSkills.split(',').map(s => s.trim())
      },
      passingCriteria: {
        minAttendancePercentage: Number(formData.passingCriteria.minAttendancePercentage),
        minMarks: Number(formData.passingCriteria.minMarks)
      },
      skillsToBeAcquired: formData.skillsToBeAcquired.split(',').map(s => s.trim()),
      managerId
    };

    try {
      const res = await fetch(api + 'trainings/add-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        // alert('Training created successfully!');
        setShowCreateModal(false);
        setFormData({
          name: '',
          startDate: todayDate,
          endDate: '',
          trainerName: '',
          noOfSeats: 25,
          eligibilityCriteria: { yearsOfExperience: 0, mustHaveSkills: '' },
          prerequisites: { goodToKnowSkills: '' },
          passingCriteria: { minAttendancePercentage: 80, minMarks: 60 },
          skillsToBeAcquired: ''
        });
        fetchTrainings();
      } else {
        alert(data.message || 'Error creating training');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const openAssignModal = (trainingId: string): void => {
    setSelectedTrainingId(trainingId);
    fetchConsultants();
    setShowAssignModal(true);
  };

  return (
  <div className="min-h-screen p-6 bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-extrabold">Manage Trainings</h1>
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Create Training
      </button>
    </div>

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

    {/* Assign Modal */}
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

    {/* Create Training Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Create Training</h2>
            <button onClick={() => setShowCreateModal(false)} className="text-2xl font-bold hover:text-red-500">&times;</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Training Name" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Trainer Name" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.trainerName} onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })} />
            <input type="date" min={todayDate} className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            <input type="date" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            <input type="number" placeholder="No of Seats" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.noOfSeats} onChange={(e) => setFormData({ ...formData, noOfSeats: Number(e.target.value) })} />
            <input type="number" placeholder="Years of Experience" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.eligibilityCriteria.yearsOfExperience} onChange={(e) => setFormData({ ...formData, eligibilityCriteria: { ...formData.eligibilityCriteria, yearsOfExperience: Number(e.target.value) } })} />
            <input type="text" placeholder="Must Have Skills (comma separated)" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.eligibilityCriteria.mustHaveSkills} onChange={(e) => setFormData({ ...formData, eligibilityCriteria: { ...formData.eligibilityCriteria, mustHaveSkills: e.target.value } })} />
            <input type="text" placeholder="Good To Know Skills (comma separated)" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.prerequisites.goodToKnowSkills} onChange={(e) => setFormData({ ...formData, prerequisites: { ...formData.prerequisites, goodToKnowSkills: e.target.value } })} />
            <input type="number" placeholder="Min Attendance %" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.passingCriteria.minAttendancePercentage} onChange={(e) => setFormData({ ...formData, passingCriteria: { ...formData.passingCriteria, minAttendancePercentage: Number(e.target.value) } })} />
            <input type="number" placeholder="Min Marks" className="p-2 border rounded bg-white dark:bg-gray-700" value={formData.passingCriteria.minMarks} onChange={(e) => setFormData({ ...formData, passingCriteria: { ...formData.passingCriteria, minMarks: Number(e.target.value) } })} />
            <input type="text" placeholder="Skills To Be Acquired (comma separated)" className="p-2 border rounded bg-white dark:bg-gray-700 col-span-2" value={formData.skillsToBeAcquired} onChange={(e) => setFormData({ ...formData, skillsToBeAcquired: e.target.value })} />
          </div>
          <button onClick={handleCreateTraining} className="mt-6 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Submit</button>
        </div>
      </div>
    )}
  </div>
);

}
