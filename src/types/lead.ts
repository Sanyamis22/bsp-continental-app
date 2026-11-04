export interface InquiryDTO {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  amount: number;
  message: string;
  paymentStatus?: string;
  createdAt: string;
}

export interface ContactDTO {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
}
