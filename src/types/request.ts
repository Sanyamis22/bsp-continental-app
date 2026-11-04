export const SERVICE_TYPES = [
  "Property Vetting",
  "Loan Rejection Solution",
  "CIBIL Audit",
  "Custom Legal",
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const REQUEST_STATUSES = ["Pending", "In Review", "Approved", "Rejected"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface RequestDocumentDTO {
  name?: string;
  url?: string;
  size?: string | number;
  docType?: string;
  /** Client-only: local File before upload. */
  fileObject?: File;
  /** Client-only: checklist category label. */
  category?: string;
  /** Client-only: stable React list key before upload. */
  clientId?: string;
}

export interface RequestDetailsDTO {
  ownerName?: string;
  propertyLocation?: string;
  bankName?: string;
  loanAmount?: number;
  monthlyIncome?: number;
  rejectionReason?: string;
  customMessage?: string;
  panNumber?: string;
  dateOfBirth?: string;
  dob?: string;
  selectedServices?: string[];
}

export interface AdminReplyDTO {
  message?: string;
  document?: { name?: string; url?: string };
  updatedAt?: string;
}

export interface RequestDTO {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceType: ServiceType | string;
  details?: RequestDetailsDTO;
  documentsList?: RequestDocumentDTO[];
  status: RequestStatus | string;
  adminReply?: AdminReplyDTO;
  remarks?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

/** Validated input for submitting a request (identity comes from the session, not the client). */
export interface CreateRequestInput {
  userName?: string;
  userPhone?: string;
  serviceType: ServiceType;
  details: RequestDetailsDTO;
  documentsList: RequestDocumentDTO[];
}

export interface DecideRequestInput {
  requestId: string;
  status: RequestStatus;
  adminMessage?: string;
  adminDocument?: { name?: string; url?: string };
}
