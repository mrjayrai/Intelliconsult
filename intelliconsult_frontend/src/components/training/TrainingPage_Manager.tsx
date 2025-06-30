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
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      const res = await fetch(api + 'trainings/add-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Training created successfully!');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Manage Trainings</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create Training
        </button>
      </div>

      {/* existing cards and assign modal remain unchanged */}
      {/* ... */}

      {/* Create Modal */}
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
