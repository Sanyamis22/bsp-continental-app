import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const RequestSchema = new Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, index: true },
    userPhone: { type: String, default: "" },

    serviceType: {
      type: String,
      required: true,
      enum: ["Property Vetting", "Loan Rejection Solution", "CIBIL Audit", "Custom Legal"],
    },

    // Form Details
    details: {
      ownerName: { type: String },
      propertyLocation: { type: String },
      bankName: { type: String },
      loanAmount: { type: Number },
      monthlyIncome: { type: Number },
      rejectionReason: { type: String },
      customMessage: { type: String },

      // CIBIL Audit Specific
      panNumber: { type: String },
      dateOfBirth: { type: String },
      selectedServices: [{ type: String }], // 🌟 Selected Checkboxes Array
    },

    // Documents (Aadhaar Front, Aadhaar Back, PAN, etc.)
    documentsList: [
      {
        name: { type: String },
        url: { type: String },
        size: { type: String },
        docType: { type: String, default: "General" }, 
      },
    ],

    // Approval Status
    status: {
      type: String,
      enum: ["Pending", "In Review", "Approved", "Rejected"],
      default: "Pending",
    },

    // Admin Response
    adminReply: {
      message: { type: String, default: "" },
      document: {
        name: { type: String, default: "" },
        url: { type: String, default: "" },
      },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export type RequestDoc = InferSchemaType<typeof RequestSchema>;

export default (mongoose.models.Request as Model<RequestDoc>) ||
  mongoose.model<RequestDoc>("Request", RequestSchema);