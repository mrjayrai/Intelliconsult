'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XIcon } from 'lucide-react';
import api from '@/apiLink';
import { useAuth } from '@/context/AuthContext';

type Skill = {
  _id?: string;
  name: string;
  yearsOfExperience: number;
  certification?: boolean;
};

export default function SkillsPage() {
  const { authData } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', yearsOfExperience: 1 });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(api + 'skills/getskills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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

  const filtered = skills.filter((skill) =>
    skill.name.toLowerCase().includes(query.toLowerCase())
  );

  const addSkill = () => {
    if (newSkill.name.trim() === '') return;
    setSkills([
      ...skills,
      { ...newSkill, certification: false, _id: Date.now().toString() },
    ]);
    setNewSkill({ name: '', yearsOfExperience: 1 });
    setIsOpen(false);
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((skill, index) => (
          <div
            key={index}
            className="rounded-2xl p-4 shadow-sm hover:shadow-md
              bg-white dark:bg-zinc-900
              border border-gray-200 dark:border-zinc-800
              hover:bg-zinc-50 dark:hover:bg-zinc-800
              transition"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {skill.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Experience: {skill.yearsOfExperience} yrs
            </p>
            {skill.certification && (
              <p className="text-xs mt-1 italic text-blue-600 dark:text-blue-400">
                Certified
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Dialog to add new skill (local only) */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="relative bg-white dark:bg-zinc-900 rounded-xl max-w-sm w-full p-6 z-20 border border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white">
                Add New Skill
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Skill Name"
              className="w-full mb-3 p-2 border rounded-md
                bg-white dark:bg-zinc-800
                border-gray-300 dark:border-zinc-700
                text-zinc-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Years of Experience"
              className="w-full mb-4 p-2 border rounded-md
                bg-white dark:bg-zinc-800
                border-gray-300 dark:border-zinc-700
                text-zinc-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={newSkill.yearsOfExperience}
              onChange={(e) =>
                setNewSkill({ ...newSkill, yearsOfExperience: Number(e.target.value) })
              }
            />
            <button
              onClick={addSkill}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Add Skill
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
