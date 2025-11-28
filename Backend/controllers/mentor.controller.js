import User from "../models/user.model.js";
import MentorSkill from "../models/mentorSkills.model.js";
import Session from "../models/Session.model.js";
import Review from "../models/review.model.js";
import MentorProfile from "../models/mentorProfile.model.js";

export async function CreateOrUpdateMentorProfile(req, res) {
  try {
    const {
      headline,
      bio,
      experience,
      company,
      linkedinProfile,
      githubProfile,
      hourlyRate,
      skills,
      isProfileComplete = true
    } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware that adds user to req

    let normalizedSkills;
    if (Array.isArray(skills)) {
      normalizedSkills = skills.map((skill) => skill.trim()).filter(Boolean);
    } else if (typeof skills === 'string') {
      normalizedSkills = skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Check if profile already exists
    let profile = await MentorProfile.findOne({ user: userId });

    const profileData = {
      user: userId,
      headline,
      bio,
      experience: experience !== undefined ? Number(experience) : undefined,
      company,
      linkedinProfile,
      githubProfile,
      hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
      isProfileComplete
    };

    if (normalizedSkills !== undefined) {
      profileData.skills = normalizedSkills;
    }

    if (profile) {
      // Update existing profile
      profile = await MentorProfile.findByIdAndUpdate(
        profile._id,
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      profile = new MentorProfile(profileData);
      await profile.save();
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Mentor profile saved successfully'
    });

  } catch (error) {
    console.error('Error saving mentor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving mentor profile',
      error: error.message
    });
  }
}

export async function GetAllMentors(req, res) {
  try {
    // TEMPORARY MOCK DATA - Remove this when you have real mentors in DB
    const mockMentors = [
      {
        _id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'mentor',
        headline: 'Senior Software Engineer | Tech Lead',
        company: 'Google, Microsoft',
        experience: '8+ Years of Experience',
        bio: 'Passionate about mentoring developers in system design and cloud architecture. Specialized in helping engineers grow their careers at top tech companies.',
        hourlyRate: 15,
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true,
        skills: [
          { _id: 's1', name: 'System Design' },
          { _id: 's2', name: 'Cloud' },
          { _id: 's3', name: 'Career Growth' },
          { _id: 's4', name: 'Interview Prep' }
        ],
        averageRating: 4.9,
        totalReviews: 47
      },
      {
        _id: '2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'mentor',
        headline: 'Senior Product Manager',
        company: 'Amazon, Facebook',
        experience: '7+ Years of Experience',
        bio: 'Helping PMs break into FAANG companies. Expert in product strategy, roadmapping, and stakeholder management.',
        hourlyRate: 20,
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
        isOnline: true,
        skills: [
          { _id: 's5', name: 'Product Management' },
          { _id: 's6', name: 'FAANG' },
          { _id: 's7', name: 'Interview Prep' },
          { _id: 's8', name: 'Career Growth' }
        ],
        averageRating: 4.8,
        totalReviews: 32
      },
      {
        _id: '3',
        name: 'Michael Rodriguez',
        email: 'michael@example.com',
        role: 'mentor',
        headline: 'Lead Data Scientist',
        company: 'Netflix, Airbnb',
        experience: '9+ Years of Experience',
        bio: 'Specialized in machine learning, A/B testing, and data-driven decision making. Mentor for aspiring data scientists.',
        hourlyRate: 25,
        profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg',
        isOnline: false,
        skills: [
          { _id: 's9', name: 'Machine Learning' },
          { _id: 's10', name: 'Data Science' },
          { _id: 's11', name: 'Python' },
          { _id: 's12', name: 'A/B Testing' }
        ],
        averageRating: 5.0,
        totalReviews: 28
      },
      {
        _id: '4',
        name: 'Priya Patel',
        email: 'priya@example.com',
        role: 'mentor',
        headline: 'UX/UI Designer',
        company: 'Adobe, Figma',
        experience: '6+ Years of Experience',
        bio: 'Helping designers build beautiful, user-centered products. Expert in design systems and user research.',
        hourlyRate: 18,
        profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
        isOnline: true,
        skills: [
          { _id: 's13', name: 'UI/UX' },
          { _id: 's14', name: 'Figma' },
          { _id: 's15', name: 'Design Systems' },
          { _id: 's16', name: 'User Research' }
        ],
        averageRating: 4.7,
        totalReviews: 19
      },
      {
        _id: '5',
        name: 'David Kim',
        email: 'david@example.com',
        role: 'mentor',
        headline: 'Senior DevOps Engineer',
        company: 'Docker, AWS',
        experience: '10+ Years of Experience',
        bio: 'Helping teams implement CI/CD pipelines, containerization, and cloud infrastructure at scale.',
        hourlyRate: 22,
        profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
        isOnline: false,
        skills: [
          { _id: 's17', name: 'DevOps' },
          { _id: 's18', name: 'AWS' },
          { _id: 's19', name: 'Docker' },
          { _id: 's20', name: 'Kubernetes' }
        ],
        averageRating: 4.9,
        totalReviews: 41
      }
    ];

    // Return mock data for now
    res.status(200).json({
      success: true,
      count: mockMentors.length,
      mentors: mockMentors
    });

    // COMMENTED OUT: Original database logic - uncomment when you have real data
    /*
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
    */
  } catch (error) {
    console.error("Get all mentors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors"
    });
  }
}

// Keep other functions as they are
export async function GetMentorById(req, res) {
  // ... existing code
}

export async function GetMentorsBySkill(req, res) {
  // ... existing code
}

export async function GetCarouselMentors(req, res) {
  // ... existing code
}