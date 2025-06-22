const UserSkillSet = require('../models/UserSkillSet');

const addUserSkillSet = async (req, res) => {
  try {
    const { userId, skills = [], projects = [] } = req.body;

    let userSkill = await UserSkillSet.findOne({ userId });

    if (userSkill) {
      // Map existing skills by lowercase name
      const existingSkillsMap = new Map(
        userSkill.skills.map(skill => [skill.name.toLowerCase(), skill])
      );

      skills.forEach(newSkill => {
        const key = newSkill.name.toLowerCase();
        if (existingSkillsMap.has(key)) {
          const existing = existingSkillsMap.get(key);

          // Update years of experience if new value is greater
          if (
            typeof newSkill.yearsOfExperience === 'number' &&
            newSkill.yearsOfExperience > (existing.yearsOfExperience || 0)
          ) {
            existing.yearsOfExperience = newSkill.yearsOfExperience;
          }

          // Update certification if provided
          if (newSkill.certification !== undefined) {
            existing.certification = !!newSkill.certification;
          }

          // Increment endorsements
          existing.endorsements = (existing.endorsements || 0) + 1;
        } else {
          // Add new skill
          userSkill.skills.push({
            ...newSkill,
            endorsements: newSkill.endorsements ?? 1, // default to 1 endorsement for new
          });
        }
      });

      // Append new projects (skip duplicates based on GitHub URL)
      const existingUrls = new Set(userSkill.projects.map(p => p.githubUrl));
      const newUniqueProjects = projects.filter(p => !existingUrls.has(p.githubUrl));
      userSkill.projects.push(...newUniqueProjects);

      await userSkill.save();

      return res.status(200).json({
        message: 'Skill set updated successfully.',
        userSkill,
      });

    } else {
      // New user skill set
      const normalizedSkills = skills.map(s => ({
        ...s,
        endorsements: s.endorsements ?? 1,
        certification: !!s.certification,
      }));

      const userSkillData = new UserSkillSet({
        userId,
        skills: normalizedSkills,
        projects,
      });

      await userSkillData.save();

      return res.status(201).json({
        message: 'Skill set added successfully.',
        userSkill: userSkillData,
      });
    }

  } catch (error) {
    console.error('Error adding/updating skill set:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  addUserSkillSet,
};
