import Review from "../models/review.model.js";
import Session from "../models/Session.model.js";

export async function CreateReviewHandler(req, res) {
  try {
    const { sessionId, rating, review } = req.validatedData;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "Can only review completed sessions"
      });
    }

    const userId = req.user.id;
    if (session.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only students can review their sessions"
      });
    }

    const existingReview = await Review.findOne({ session: sessionId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Session already reviewed"
      });
    }

    const newReview = await Review.create({
      session: sessionId,
      rating,
      review: review || undefined
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name email' }
        ]
      });

    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review"
    });
  }
}

export async function GetReviewsHandler(req, res) {
  try {
    const { mentor } = req.query;

    if (!mentor) {
      return res.status(400).json({
        success: false,
        message: "Mentor ID is required"
      });
    }

    const sessions = await Session.find({ mentor, status: 'completed' }).select('_id');
    const sessionIds = sessions.map(s => s._id);

    const reviews = await Review.find({ session: { $in: sessionIds } })
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: parseFloat(averageRating),
      reviews
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
}

export async function GetReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name email' }
        ]
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review"
    });
  }
}
