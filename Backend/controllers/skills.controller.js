import Skill from "../models/skill.model.js";
import MentorSkill from "../models/mentorSkills.model.js";
import User from "../models/user.model.js";

export async function GetAllSkills(req, res) {
  try {
    const skills = await Skill.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills"
    });
  }
}

export async function CreateSkill(req, res) {
  try {
    const { name } = req.validatedData;

    const existingSkill = await Skill.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists"
      });
    }

    const skill = await Skill.create({ name });

    res.status(201).json({
      success: true,
      skill
    });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create skill"
    });
  }
}

export async function AddSkillsToMentor(req, res) {
  try {
    const { id: mentorId } = req.params;
    const { skillIds } = req.validatedData;

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }

    if (mentor.role !== 'mentor') {
      return res.status(400).json({
        success: false,
        message: "User is not a mentor"
      });
    }

    const skills = await Skill.find({ _id: { $in: skillIds } });
    if (skills.length !== skillIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more invalid skill IDs"
      });
    }

    const mentorSkills = [];
    for (const skillId of skillIds) {
      const existingMentorSkill = await MentorSkill.findOne({
        mentor: mentorId,
        skill: skillId
      });

      if (!existingMentorSkill) {
        const mentorSkill = await MentorSkill.create({
          mentor: mentorId,
          skill: skillId
        });
        mentorSkills.push(mentorSkill);
      }
    }

    const allMentorSkills = await MentorSkill.find({ mentor: mentorId })
      .populate('skill', 'name');

    res.status(200).json({
      success: true,
      message: `${mentorSkills.length} skill(s) added`,
      skills: allMentorSkills
    });
  } catch (error) {
    console.error("Add skills to mentor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add skills to mentor"
    });
  }
}

export async function RemoveSkillFromMentor(req, res) {
  try {
    const { mentorId, skillId } = req.params;

    const mentorSkill = await MentorSkill.findOneAndDelete({
      mentor: mentorId,
      skill: skillId
    });

    if (!mentorSkill) {
      return res.status(404).json({
        success: false,
        message: "Mentor skill association not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill removed from mentor"
    });
  } catch (error) {
    console.error("Remove skill from mentor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove skill from mentor"
    });
  }
}

export async function GetMentorSkills(req, res) {
  try {
    const { mentorId } = req.params;

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }

    const mentorSkills = await MentorSkill.find({ mentor: mentorId })
      .populate('skill', 'name');

    res.status(200).json({
      success: true,
      skills: mentorSkills.map(ms => ms.skill)
    });
  } catch (error) {
    console.error("Get mentor skills error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor skills"
    });
  }
}
