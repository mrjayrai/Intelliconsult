'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [markCompleted, setMarkCompleted] = useState(false);

  const [formData, setFormData] = useState({
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

  const fetchTrainings = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/trainings/get-training', {
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
      const res = await fetch('http://localhost:4000/api/users/get-consultant', {
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

    const assignedDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
    const payload = {
      userId: selectedConsultant,
      trainingId: selectedTrainingId,
      assignedDate,
      isCompleted: markCompleted
    };

    setLoadingAssign(true);
    try {
      const res = await fetch('http://localhost:4000/api/trainings/assign-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAssignModal(false);
        setSelectedConsultant('');
        setSelectedTrainingId('');
        setMarkCompleted(false);
      }
    } catch (err) {
      console.error('Assignment failed:', err);
    } finally {
      setLoadingAssign(false);
    }
  };

  const handleCreateTraining = async () => {
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
      const res = await fetch('http://localhost:4000/api/trainings/add-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
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
      }
    } catch (err) {
      console.error('Error:', err);
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
    <div className="pt-20 px-6 pb-10 min-h-screen bg-gradient-to-b from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Manage Trainings</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition duration-200"
        >
           Create Training
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {trainings.map((training) => (
          <div
            key={training._id}
            className="rounded-2xl border border-gray-300 dark:border-gray-700 p-6 shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-center mb-2 truncate">{training.name}</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-300 mb-1">
                <span className="font-medium">Trainer:</span> {training.trainerName}
              </p>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {new Date(training.startDate).toLocaleDateString()} → {new Date(training.endDate).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => openAssignModal(training._id)}
              className="mt-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition duration-200"
            >
              Assign Consultant
            </button>
          </div>
        ))}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md text-black dark:text-white shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Assign Consultant</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedConsultant('');
                  setSelectedTrainingId('');
                  setMarkCompleted(false);
                }}
                className="text-2xl font-bold hover:text-red-500"
              >
                &times;
              </button>
            </div>

            <label className="block mb-2 font-medium">Select Consultant:</label>
            <select
              className="w-full p-2 rounded border dark:bg-gray-700 focus:outline-none"
              value={selectedConsultant}
              onChange={(e) => setSelectedConsultant(e.target.value)}
            >
              <option value="">-- Select Consultant --</option>
              {consultants.map((consultant) => (
                <option key={consultant._id} value={consultant._id}>
                  {consultant.name} ({consultant.email})
                </option>
              ))}
            </select>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="completed"
                checked={markCompleted}
                onChange={(e) => setMarkCompleted(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="completed" className="text-sm font-medium">
                Mark as Completed
              </label>
            </div>

            <button
              onClick={assignTrainingToConsultant}
              disabled={!selectedConsultant || loadingAssign}
              className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loadingAssign ? 'Assigning...' : 'Assign Training'}
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
{showCreateModal && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-y-auto">
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-xl w-full max-w-5xl mx-4 my-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Create Training</h2>
        <button
          onClick={() => setShowCreateModal(false)}
          className="text-3xl font-bold hover:text-red-500"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Training Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Trainer Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.trainerName}
              onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                min={todayDate}
                className="w-full p-2 rounded border bg-white dark:bg-gray-700"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                className="w-full p-2 rounded border bg-white dark:bg-gray-700"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">No. of Seats</label>
            <input
              type="number"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.noOfSeats}
              onChange={(e) => setFormData({ ...formData, noOfSeats: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Skills to be Acquired</label>
            <input
              type="text"
              placeholder="Comma-separated"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.skillsToBeAcquired}
              onChange={(e) => setFormData({ ...formData, skillsToBeAcquired: e.target.value })}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Years of Experience</label>
            <input
              type="number"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.eligibilityCriteria.yearsOfExperience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eligibilityCriteria: {
                    ...formData.eligibilityCriteria,
                    yearsOfExperience: Number(e.target.value)
                  }
                })
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Must Have Skills</label>
            <input
              type="text"
              placeholder="Comma-separated"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.eligibilityCriteria.mustHaveSkills}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eligibilityCriteria: {
                    ...formData.eligibilityCriteria,
                    mustHaveSkills: e.target.value
                  }
                })
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Good to Know Skills</label>
            <input
              type="text"
              placeholder="Comma-separated"
              className="w-full p-2 rounded border bg-white dark:bg-gray-700"
              value={formData.prerequisites.goodToKnowSkills}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prerequisites: {
                    ...formData.prerequisites,
                    goodToKnowSkills: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Min Attendance %</label>
              <input
                type="number"
                className="w-full p-2 rounded border bg-white dark:bg-gray-700"
                value={formData.passingCriteria.minAttendancePercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingCriteria: {
                      ...formData.passingCriteria,
                      minAttendancePercentage: Number(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Min Marks</label>
              <input
                type="number"
                className="w-full p-2 rounded border bg-white dark:bg-gray-700"
                value={formData.passingCriteria.minMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingCriteria: {
                      ...formData.passingCriteria,
                      minMarks: Number(e.target.value)
                    }
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreateTraining}
        className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
      >
        Submit
      </button>
    </div>
  </div>
)}

{/* Create Model End */}
    </div>
  );
}
