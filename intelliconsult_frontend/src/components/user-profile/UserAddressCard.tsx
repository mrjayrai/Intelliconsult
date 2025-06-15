'use client';

import React, { useEffect, useState } from 'react';

import api from '@/apiLink';
import { useAuth } from '@/context/AuthContext';

type Project = {
  projectInfo: string;
  timeConsumedInDays: number;
  skillsUsed: string[];
  githubUrl: string;
};

type Skill = {
  name: string;
  yearsOfExperience: number;
  certification?: boolean;
};


export default function UserAddressCard() {
  const { authData } = useAuth();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(null);

  if (!authData) return null;

  const { _id } = authData.user;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
  const fetchSkills = async () => {
    try {
      const res = await fetch(api + 'skills/getskills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: _id }),
      });

      if (!res.ok) {
        throw new Error('No Skills Added');
      }

      const data = await res.json();

      const sortedSkills = (data?.data?.skills || []).sort(
        (a: { yearsOfExperience: number; }, b: { yearsOfExperience: number; }) => b.yearsOfExperience - a.yearsOfExperience
      );

      setSkills(sortedSkills);
      setProjects(data?.data?.projects || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching skills:', err.message);
      setError(err.message);
      console.log(error);
      
    }
  };

  if (_id) {
    fetchSkills();
  }
}, [_id,error]);


  

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        

        {/* Skills Widget Section */}
        <div className="mt-10">
  <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">Skills</h4>

  {skills.length === 0 ? (
    <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet.</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="p-3 border border-gray-200 rounded-xl bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {skill.name.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Experience: {skill?.yearsOfExperience} yrs
          </p>
          {skill?.certification && (
            <p className="text-xs text-gray-400 mt-1 italic">Certified</p>
          )}
        </div>
      ))}
    </div>
  )}
</div>


        {/* Projects Widget Section */}
        <div className="mt-10">
  <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">Projects</h4>

  {projects.length === 0 ? (
    <p className="text-sm text-gray-500 dark:text-gray-400">No projects added yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <p className="font-medium text-gray-800 dark:text-white/90">{project.projectInfo}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Time: {project.timeConsumedInDays} days
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-400 dark:text-gray-300">Skills Used:</p>
            <ul className="flex flex-wrap gap-1 mt-1">
              {project.skillsUsed.map((skill, i) => (
                <li
                  key={i}
                  className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 mt-2 inline-block hover:underline"
          >
            View on GitHub
          </a>
        </div>
      ))}
    </div>
  )}
</div>

      </div>

      {/* Modal */}
      
    </>
  );
}
