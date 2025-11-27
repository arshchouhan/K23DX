import User from "../models/user.model.js";
import MentorSkill from "../models/mentorSkills.model.js";
import Session from "../models/Session.model.js";
import Review from "../models/review.model.js";

export async function GetAllMentors(req, res) {
  try {
    const { skill, minRate, maxRate, sortBy } = req.query;

    let query = { role: 'mentor' };

    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = parseFloat(minRate);
      if (maxRate) query.hourlyRate.$lte = parseFloat(maxRate);
    }

    let mentors = await User.find(query).select('-password');

    if (skill) {
      const mentorSkills = await MentorSkill.find({ skill })
        .populate('mentor')
        .select('mentor');
      const mentorIds = mentorSkills.map(ms => ms.mentor._id.toString());
      mentors = mentors.filter(m => mentorIds.includes(m._id.toString()));
    }

    for (let mentor of mentors) {
      const skills = await MentorSkill.find({ mentor: mentor._id })
        .populate('skill', 'name');
      mentor._doc.skills = skills.map(s => s.skill);

      const sessions = await Session.find({ mentor: mentor._id, status: 'completed' });
      const sessionIds = sessions.map(s => s._id);
      const reviews = await Review.find({ session: { $in: sessionIds } });
      
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;
      
      mentor._doc.averageRating = parseFloat(averageRating);
      mentor._doc.totalReviews = reviews.length;
    }

    if (sortBy === 'rating') {
      mentors.sort((a, b) => b._doc.averageRating - a._doc.averageRating);
    } else if (sortBy === 'price-low') {
      mentors.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    } else if (sortBy === 'price-high') {
      mentors.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    }

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    console.error("Get all mentors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors"
    });
  }
}

export async function GetMentorById(req, res) {
  try {
    const { id } = req.params;

    const mentor = await User.findById(id).select('-password');

    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }

    const mentorSkills = await MentorSkill.find({ mentor: id })
      .populate('skill', 'name');
    mentor._doc.skills = mentorSkills.map(ms => ms.skill);

    const sessions = await Session.find({ mentor: id, status: 'completed' });
    const sessionIds = sessions.map(s => s._id);
    const reviews = await Review.find({ session: { $in: sessionIds } })
      .populate({
        path: 'session',
        populate: { path: 'student', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

    mentor._doc.averageRating = parseFloat(averageRating);
    mentor._doc.totalReviews = reviews.length;
    mentor._doc.recentReviews = reviews;
    mentor._doc.totalSessions = sessions.length;

    res.status(200).json({
      success: true,
      mentor
    });
  } catch (error) {
    console.error("Get mentor by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor"
    });
  }
}

export async function GetMentorsBySkill(req, res) {
  try {
    const { skillId } = req.params;

    const mentorSkills = await MentorSkill.find({ skill: skillId })
      .populate('mentor', '-password');

    if (mentorSkills.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        mentors: []
      });
    }

    const mentors = [];
    for (const ms of mentorSkills) {
      if (ms.mentor && ms.mentor.role === 'mentor') {
        const mentor = ms.mentor.toObject();
        
        const skills = await MentorSkill.find({ mentor: mentor._id })
          .populate('skill', 'name');
        mentor.skills = skills.map(s => s.skill);

        const sessions = await Session.find({ mentor: mentor._id, status: 'completed' });
        const sessionIds = sessions.map(s => s._id);
        const reviews = await Review.find({ session: { $in: sessionIds } });
        
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;
        
        mentor.averageRating = parseFloat(averageRating);
        mentor.totalReviews = reviews.length;

        mentors.push(mentor);
      }
    }

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    console.error("Get mentors by skill error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors"
    });
  }
}

export async function GetCarouselMentors(req, res) {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('-password')
      .limit(10);

    const mentorsWithRatings = [];
    for (const mentor of mentors) {
      const mentorObj = mentor.toObject();
      
      const skills = await MentorSkill.find({ mentor: mentor._id })
        .populate('skill', 'name');
      mentorObj.skills = skills.map(s => s.skill);

      const sessions = await Session.find({ mentor: mentor._id, status: 'completed' });
      const sessionIds = sessions.map(s => s._id);
      const reviews = await Review.find({ session: { $in: sessionIds } });
      
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;
      
      mentorObj.averageRating = parseFloat(averageRating);
      mentorObj.totalReviews = reviews.length;

      mentorsWithRatings.push(mentorObj);
    }

    mentorsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json({
      success: true,
      count: mentorsWithRatings.length,
      mentors: mentorsWithRatings
    });
  } catch (error) {
    console.error("Get carousel mentors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch carousel mentors"
    });
  }
}
