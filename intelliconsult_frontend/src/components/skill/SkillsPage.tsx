'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  XIcon,
  PencilIcon,
  CheckIcon,
  Undo2Icon,
} from 'lucide-react';
import api from '@/apiLink';
import { useAuth } from '@/context/AuthContext';
import DropzoneComponent from '../form/form-elements/ResumeDropZone';

type Skill = {
  _id?: string;
  name: string;
  yearsOfExperience: number;
  certification?: boolean | string;
  endorsements?: number;
};

export default function SkillsPage() {
  const { authData } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingSkills, setEditingSkills] = useState<{ [key: string]: Skill }>({});
  const [hasEdits, setHasEdits] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(api + 'skills/getskills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authData?.user._id }),
        });

        if (!res.ok) throw new Error('Failed to fetch skills');
        const data = await res.json();

        const sorted = (data?.data?.skills || []).sort(
          (a: Skill, b: Skill) => b.yearsOfExperience - a.yearsOfExperience
        );

        setSkills(sorted);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };

    if (authData?.user._id) fetchSkills();
  }, [authData?.user._id]);

  const getSkillKey = (skill: Skill) => skill._id || skill.name.toLowerCase();

  const handleEdit = (skill: Skill) => {
    const key = getSkillKey(skill);
    setEditingSkills((prev) => ({
      ...prev,
      [key]: { ...skill },
    }));
    setHasEdits(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: string, field: keyof Skill, value: any) => {
    setEditingSkills((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]:
          field === 'yearsOfExperience'
            ? parseInt(value)
            : field === 'certification'
            ? Boolean(value)
            : value,
      },
    }));
  };

  const handleCancelChanges = () => {
    setEditingSkills({});
    setHasEdits(false);
  };

  const syncSkillsWithEndorsement = async (userId: string, skills: Skill[]) => {
    const normalized = skills.map((skill) => ({
      name: skill.name,
      yearsOfExperience: skill.yearsOfExperience,
      certification: Boolean(skill.certification),
      endorsements: skill.endorsements ?? 0,
    }));

    const response = await fetch(api + 'skills/add-skill-set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skills: normalized, projects: [] }),
    });

    if (!response.ok) throw new Error('Failed to sync skills');
    return await response.json();
  };

  const handleUpdate = async () => {

    const userId = authData?.user._id;
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    
    const updatedSkills = Object.values(editingSkills);

    try {
      await syncSkillsWithEndorsement(authData?.user._id, updatedSkills);

      const updatedMap = new Map(
        updatedSkills.map((s) => [s.name.toLowerCase(), s])
      );

      const newSkills = skills.map((s) =>
        updatedMap.has(s.name.toLowerCase()) ? updatedMap.get(s.name.toLowerCase())! : s
      );

      setSkills(newSkills);
      setEditingSkills({});
      setHasEdits(false);
    } catch (err) {
      console.error('Error syncing skills:', err);
    }
  };

  const filtered = skills.filter((skill) =>
    skill.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          My Skills
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <input
        type="text"
        placeholder="Search skills..."
        className="w-full p-2 border rounded-lg mb-4
          bg-white dark:bg-zinc-900
          border-gray-300 dark:border-zinc-700
          text-zinc-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        onChange={(e) => setQuery(e.target.value)}
      />

      {hasEdits && (
        <div className="mb-4 flex justify-end gap-4">
          <button
            onClick={handleCancelChanges}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <Undo2Icon className="w-4 h-4" />
            Cancel Changes
          </button>
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((skill) => {
          const key = getSkillKey(skill);
          const isEditing = !!editingSkills[key];
          const skillData = isEditing ? editingSkills[key] : skill;

          return (
            <div
              key={key}
              className="rounded-2xl p-4 shadow-md hover:shadow-lg
                bg-white dark:bg-zinc-900
                border border-gray-200 dark:border-zinc-800
                hover:bg-zinc-50 dark:hover:bg-zinc-800
                transition relative"
            >
              {!isEditing && (
                <button
                  onClick={() => handleEdit(skill)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-blue-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={skillData.name}
                    onChange={(e) =>
                      handleChange(key, 'name', e.target.value)
                    }
                    className="w-full px-3 py-1 rounded-md text-sm border dark:bg-zinc-800 dark:text-white"
                  />
                  <input
                    type="number"
                    value={skillData.yearsOfExperience}
                    onChange={(e) =>
                      handleChange(key, 'yearsOfExperience', e.target.value)
                    }
                    className="w-full px-3 py-1 rounded-md text-sm border dark:bg-zinc-800 dark:text-white"
                    min={0}
                  />
                  <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={!!skillData.certification}
                      onChange={(e) =>
                        handleChange(key, 'certification', e.target.checked)
                      }
                    />
                    Certified
                  </label>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {skill.name.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Experience: {skill.yearsOfExperience} yrs
                  </p>
                  {skill.certification && (
                    <p className="text-xs mt-1 italic text-blue-600 dark:text-blue-400">
                      Certified
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Dropzone Dialog (unchanged) */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="relative bg-white dark:bg-zinc-900 rounded-xl w-full max-w-xl p-6 z-20 border border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white">
                Upload Resume (PDF or DOCX)
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <DropzoneComponent />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
