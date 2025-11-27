import Payment from "../models/payment.model.js";
import Session from "../models/Session.model.js";

export async function MakePaymentHandler(req, res) {
  try {
    const { sessionId, amount, providerTxnId } = req.validatedData;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: "Session already paid"
      });
    }

    if (providerTxnId) {
      const existingPayment = await Payment.findOne({ providerTxnId });
      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: "Payment with this transaction ID already exists"
        });
      }
    }

    const payment = await Payment.create({
      session: sessionId,
      amount,
      providerTxnId: providerTxnId || undefined,
      status: 'initiated'
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name email' }
        ]
      });

    res.status(201).json({
      success: true,
      payment: populatedPayment
    });
  } catch (error) {
    console.error("Make payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment"
    });
  }
}

export async function GetPaymentHandler(req, res) {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email hourlyRate' },
          { path: 'student', select: 'name email' }
        ]
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment"
    });
  }
}

export async function UpdatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, providerTxnId } = req.validatedData;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = status;
    if (providerTxnId) {
      payment.providerTxnId = providerTxnId;
    }
    await payment.save();

    if (status === 'success') {
      await Session.findByIdAndUpdate(payment.session, { status: 'paid' });
    }

    const updatedPayment = await Payment.findById(id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email hourlyRate' },
          { path: 'student', select: 'name email' }
        ]
      });

    res.status(200).json({
      success: true,
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status"
    });
  }
}

export async function GetPaymentsBySession(req, res) {
  try {
    const { sessionId } = req.params;

    const payments = await Payment.find({ session: sessionId })
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error("Get payments by session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments"
    });
  }
}
