"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { PlusIcon, XIcon } from "lucide-react";

export default function SkillsPage() {
  const defaultSkills = [
    { id: 1, name: "React", level: "Advanced", tags: ["Frontend"] },
    { id: 2, name: "Node.js", level: "Intermediate", tags: ["Backend"] },
    { id: 3, name: "CSS", level: "Advanced", tags: ["UI", "Design"] },
  ];

  const [skills, setSkills] = useState(defaultSkills);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", level: "Beginner" });

  const filtered = skills.filter((skill) =>
    skill.name.toLowerCase().includes(query.toLowerCase())
  );

  const addSkill = () => {
    if (newSkill.name.trim() === "") return;
    setSkills([
      ...skills,
      { ...newSkill, id: Date.now(), tags: [] },
    ]);
    setNewSkill({ name: "", level: "Beginner" });
    setIsOpen(false);
  };

  return (
    <>
      <div className="p-6 min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">My Skills</h2>
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
          className="w-full p-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg mb-4"
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="rounded-2xl p-4 shadow-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {skill.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Level: {skill.level}
              </p>
              {skill.tags?.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {skill.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-zinc-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dialog for adding new skill */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
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
                className="w-full mb-3 p-2 border rounded-md bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
              />
              <select
                className="w-full mb-4 p-2 border rounded-md bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: e.target.value })
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
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
    </>
  );
}

