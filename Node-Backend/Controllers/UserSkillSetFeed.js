const UserSkillSet = require('../models/UserSkillSet');

const addUserSkillSet = async (req, res) => {
    try {
        const { userId, skills = [], projects = [] } = req.body;

        let userSkill = await UserSkillSet.findOne({ userId });

        if (userSkill) {
            // Merge skills with endorsement logic
            const existingSkillsMap = new Map(
                userSkill.skills.map(skill => [skill.name.toLowerCase(), skill])
            );

            skills.forEach(newSkill => {
                const key = newSkill.name.toLowerCase();
                if (existingSkillsMap.has(key)) {
                    // Increment endorsement if skill already exists
                    existingSkillsMap.get(key).endorsements += 1;
                } else {
                    // Add new skill
                    userSkill.skills.push(newSkill);
                }
            });

            // Append new projects if provided (optional: prevent duplicates by GitHub URL)
            if (projects.length > 0) {
                userSkill.projects.push(...projects);
            }

            await userSkill.save();
            return res.status(200).json({ message: 'Skill set updated successfully.', userSkill });

        } else {
            // New user skill set
            const userSkillData = new UserSkillSet({ userId, skills, projects });
            await userSkillData.save();
            return res.status(201).json({ message: 'Skill set added successfully.', userSkill: userSkillData });
        }

    } catch (error) {
        console.error('Error adding/updating skill set:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    addUserSkillSet,
};
