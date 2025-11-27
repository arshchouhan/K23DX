import Session from "../models/Session.model.js";
import User from "../models/user.model.js";

export async function CreateSession(req, res) {
  try {
    const { mentorId, studentId, start, end } = req.validatedData;

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({
        success: false,
        message: "Valid mentor not found"
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: "Valid student not found"
      });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time"
      });
    }

    if (startDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot create session in the past"
      });
    }

    const session = await Session.create({
      mentor: mentorId,
      student: studentId,
      start: startDate,
      end: endDate,
      status: 'pending'
    });

    const populatedSession = await Session.findById(session._id)
      .populate('mentor', 'name email hourlyRate')
      .populate('student', 'name email');

    res.status(201).json({
      success: true,
      session: populatedSession
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session"
    });
  }
}

export async function GetSessionsByRole(req, res) {
  try {
    const { role } = req.query;
    const userId = req.user.id;

    if (!role || !['mentor', 'student'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role (mentor or student) is required"
      });
    }

    const query = role === 'mentor' 
      ? { mentor: userId } 
      : { student: userId };

    const sessions = await Session.find(query)
      .populate('mentor', 'name email hourlyRate')
      .populate('student', 'name email')
      .sort({ start: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions"
    });
  }
}

export async function UpdateSessionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.validatedData;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const userId = req.user.id;
    if (session.mentor.toString() !== userId && session.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this session"
      });
    }

    session.status = status;
    await session.save();

    const updatedSession = await Session.findById(id)
      .populate('mentor', 'name email hourlyRate')
      .populate('student', 'name email');

    res.status(200).json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    console.error("Update session status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update session status"
    });
  }
}

export async function GetSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate('mentor', 'name email hourlyRate')
      .populate('student', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch session"
    });
  }
}
