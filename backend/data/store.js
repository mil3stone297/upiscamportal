const { v4: uuidv4 } = require('uuid');

// In-memory data store for fraud reports
let reports = [
  {
    id: uuidv4(),
    reporterName: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '9876543210',
    incidentDate: '2026-08-10',
    upiId: 'fraudster@paytm',
    transactionId: 'TXN20260810123456',
    amountLost: 15000,
    incidentType: 'fake_call',
    bankName: 'HDFC Bank',
    description:
      'Received a call from someone claiming to be from HDFC Bank KYC team. They asked me to share OTP for KYC verification. After sharing the OTP, Rs 15,000 was deducted from my account.',
    status: 'under_review',
    createdAt: new Date('2026-08-10T10:30:00').toISOString(),
    updatedAt: new Date('2026-08-10T10:30:00').toISOString(),
  },
  {
    id: uuidv4(),
    reporterName: 'Rahul Verma',
    email: 'rahul.verma@outlook.com',
    phone: '9123456789',
    incidentDate: '2026-08-08',
    upiId: 'discount.offer@gpay',
    transactionId: 'TXN20260808987654',
    amountLost: 5000,
    incidentType: 'phishing',
    bankName: 'SBI',
    description:
      'Got a WhatsApp message with a link claiming to offer exclusive Diwali cashback. Clicked the link and was redirected to a fake UPI page that stole my credentials.',
    status: 'resolved',
    createdAt: new Date('2026-08-08T14:15:00').toISOString(),
    updatedAt: new Date('2026-08-12T09:00:00').toISOString(),
  },
  {
    id: uuidv4(),
    reporterName: 'Meena Patel',
    email: 'meena.patel@yahoo.com',
    phone: '8765432109',
    incidentDate: '2026-08-12',
    upiId: 'qr.scam123@upi',
    transactionId: '',
    amountLost: 2500,
    incidentType: 'fake_qr',
    bankName: 'Axis Bank',
    description:
      'A fake QR code was pasted over the original QR at a local shop. I scanned it and paid Rs 2500 which went to a fraudulent account instead of the shopkeeper.',
    status: 'pending',
    createdAt: new Date('2026-08-12T18:45:00').toISOString(),
    updatedAt: new Date('2026-08-12T18:45:00').toISOString(),
  },
  {
    id: uuidv4(),
    reporterName: 'Amit Kumar',
    email: 'amit.kumar@rediffmail.com',
    phone: '7654321098',
    incidentDate: '2026-08-05',
    upiId: 'unknown@phonepe',
    transactionId: 'TXN20260805556677',
    amountLost: 30000,
    incidentType: 'unauthorized_transaction',
    bankName: 'ICICI Bank',
    description:
      'Found Rs 30,000 debited from my account without any transaction done by me. No OTP was received. Contacted bank but the transaction was already processed.',
    status: 'rejected',
    createdAt: new Date('2026-08-05T08:00:00').toISOString(),
    updatedAt: new Date('2026-08-13T11:30:00').toISOString(),
  },
  {
    id: uuidv4(),
    reporterName: 'Sunita Rao',
    email: 'sunita.rao@gmail.com',
    phone: '6543210987',
    incidentDate: '2026-08-13',
    upiId: 'lottery.winner@upi',
    transactionId: 'TXN20260813223344',
    amountLost: 8000,
    incidentType: 'other',
    bankName: 'Kotak Bank',
    description:
      'Got an SMS saying I won a lottery of Rs 5 lakh and need to pay Rs 8000 as processing fee via UPI. Paid the fee but never received any prize money.',
    status: 'under_review',
    createdAt: new Date('2026-08-13T16:20:00').toISOString(),
    updatedAt: new Date('2026-08-13T16:20:00').toISOString(),
  },
];

const getAllReports = () => reports;

const getReportById = (id) => reports.find((r) => r.id === id) || null;

const createReport = (data) => {
  const now = new Date().toISOString();
  const report = {
    id: uuidv4(),
    ...data,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  reports.push(report);
  return report;
};

const updateReport = (id, data) => {
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;
  reports[index] = {
    ...reports[index],
    ...data,
    id: reports[index].id,
    createdAt: reports[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  return reports[index];
};

const deleteReport = (id) => {
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return false;
  reports.splice(index, 1);
  return true;
};

module.exports = { getAllReports, getReportById, createReport, updateReport, deleteReport };
