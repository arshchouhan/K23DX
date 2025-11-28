import User from "../models/user.model.js";
import MentorSkill from "../models/mentorSkills.model.js";
import MentorProfile from "../models/mentorProfile.model.js";

export async function GetCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userResponse = user.toObject();

    if (user.role === 'mentor') {
      const mentorSkills = await MentorSkill.find({ mentor: user._id })
        .populate('skill', 'name');
      userResponse.skills = mentorSkills.map(ms => ms.skill);

      const mentorProfile = await MentorProfile.findOne({ user: user._id }).lean();
      userResponse.mentorProfile = mentorProfile || null;
      userResponse.isProfileComplete = mentorProfile?.isProfileComplete ?? false;
    }

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
}

export async function UpdateCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    const { name, bio, hourlyRate } = req.validatedData;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (hourlyRate !== undefined && user.role === 'mentor') {
      if (hourlyRate < 0) {
        return res.status(400).json({
          success: false,
          message: "Hourly rate cannot be negative"
        });
      }
      user.hourlyRate = hourlyRate;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found after update"
      });
    }

    const userResponse = updatedUser.toObject();

    if (updatedUser.role === 'mentor') {
      const mentorSkills = await MentorSkill.find({ mentor: userId })
        .populate('skill', 'name');
      userResponse.skills = mentorSkills.map(ms => ms.skill);

      const mentorProfile = await MentorProfile.findOne({ user: userId }).lean();
      userResponse.mentorProfile = mentorProfile || null;
      userResponse.isProfileComplete = mentorProfile?.isProfileComplete ?? false;
    }

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error("Update current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user"
    });
  }
}
