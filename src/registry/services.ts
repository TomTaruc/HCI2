import { ASSETS } from '../assets/manifest';

export type AccessPolicy = 'public' | 'unverified' | 'verified';

export interface ServiceDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  agencyId?: string; // e.g., 'sss', 'philhealth'
  route: string;
  icon?: string; // Legacy emoji support for transition
  logoUrl?: string; // Real logo support
  accessPolicy: AccessPolicy;
  supportedAction: string; // e.g. "Apply Now", "Inquire", "Verify"
}

export const SERVICE_REGISTRY: ServiceDefinition[] = [
  // ── APP GLOBAL SERVICES ──
  {
    id: 'bpesh',
    title: 'Bagong Pilipinas Serbisyo Hub',
    description: 'Central portal for all NGA services.',
    category: 'Hub',
    route: '/bpesh',
    accessPolicy: 'public',
    supportedAction: 'Open Hub',
    icon: '📋',
    logoUrl: ASSETS.logos.bpesh
  },
  {
    id: 'etravel',
    title: 'eTravel',
    description: 'Electronic travel declaration for arrivals and departures.',
    category: 'Travel',
    route: '/etravel',
    accessPolicy: 'public',
    supportedAction: 'Declare',
    icon: '✈️'
  },
  {
    id: 'consultation',
    title: 'Consultation',
    description: 'Send concerns, queries, or suggestions to government agencies.',
    category: 'Support',
    route: '/consultation',
    accessPolicy: 'public',
    supportedAction: 'Submit Form',
    icon: '📝'
  },
  {
    id: 'ereport',
    title: 'eReport',
    description: 'File non-emergency incident reports to authorities.',
    category: 'Public Safety',
    route: '/ereport',
    accessPolicy: 'unverified',
    supportedAction: 'Report Incident',
    icon: '🚨'
  },
  {
    id: 'egovpay',
    title: 'eGovPay',
    description: 'Pay government fees and contributions easily.',
    category: 'Payments',
    route: '/egovpay',
    accessPolicy: 'unverified',
    supportedAction: 'Pay Fees',
    icon: '💳'
  },
  {
    id: 'employment',
    title: 'Employment',
    description: 'Browse jobs, SPES, and livelihood programs.',
    category: 'Employment',
    route: '/employment',
    accessPolicy: 'public',
    supportedAction: 'Find Jobs',
    icon: '💼'
  },
  {
    id: 'weather',
    title: 'Weather',
    description: 'Current conditions and real-time alerts.',
    category: 'Information',
    route: '/weather',
    accessPolicy: 'public',
    supportedAction: 'View Weather',
    icon: '☀️'
  },
  {
    id: 'egov-ai',
    title: 'eGov AI',
    description: 'AI assistant for FAQs and navigation.',
    category: 'Support',
    route: '/egov-ai',
    accessPolicy: 'public',
    supportedAction: 'Chat',
    icon: '💬'
  },
  {
    id: 'speedtest',
    title: 'Speed Test',
    description: 'Test your internet connection speed.',
    category: 'Utility',
    route: '/speedtest',
    accessPolicy: 'public',
    supportedAction: 'Test Speed',
    icon: '📶'
  },
  {
    id: 'sim-registration',
    title: 'SIM Registration',
    description: 'Register your SIM card per the SIM Registration Act.',
    category: 'Registration',
    route: '/sim-registration',
    accessPolicy: 'public',
    supportedAction: 'Register SIM',
    icon: '📱'
  },
  {
    id: 'startup',
    title: 'Start-Up PH',
    description: 'Resources and registration for local startups.',
    category: 'Business',
    route: '/startup',
    accessPolicy: 'public',
    supportedAction: 'Explore',
    icon: '🚀'
  },

  // ── SSS SERVICES ──
  {
    id: 'sss-contribution',
    title: 'Contribution Inquiry',
    description: 'Check your SSS contributions and history.',
    category: 'Social Security',
    agencyId: 'sss',
    route: '/agencies/sss/services/contribution',
    accessPolicy: 'verified',
    supportedAction: 'View Records'
  },
  {
    id: 'sss-loan',
    title: 'Loan Status',
    description: 'Check your current SSS loan balances and status.',
    category: 'Social Security',
    agencyId: 'sss',
    route: '/agencies/sss/services/loan',
    accessPolicy: 'verified',
    supportedAction: 'View Loans'
  },
  {
    id: 'sss-claims',
    title: 'Benefit Claims',
    description: 'File and track SSS benefit claims.',
    category: 'Social Security',
    agencyId: 'sss',
    route: '/agencies/sss/services/claims',
    accessPolicy: 'verified',
    supportedAction: 'Manage Claims'
  },
  {
    id: 'sss-epayment',
    title: 'E-Payment',
    description: 'Pay your SSS contributions online.',
    category: 'Social Security',
    agencyId: 'sss',
    route: '/egovpay?agency=sss',
    accessPolicy: 'verified',
    supportedAction: 'Pay Now'
  },

  // ── GSIS SERVICES ──
  {
    id: 'gsis-contribution',
    title: 'Contribution Inquiry',
    description: 'Check your GSIS contributions and history.',
    category: 'Social Security',
    agencyId: 'gsis',
    route: '/agencies/gsis/services/contribution',
    accessPolicy: 'verified',
    supportedAction: 'View Records'
  },
  {
    id: 'gsis-loan',
    title: 'Loan Status',
    description: 'Check your GSIS loan balances.',
    category: 'Social Security',
    agencyId: 'gsis',
    route: '/agencies/gsis/services/loan',
    accessPolicy: 'verified',
    supportedAction: 'View Loans'
  },
  {
    id: 'gsis-claims',
    title: 'Benefit Claims',
    description: 'File and track GSIS claims.',
    category: 'Social Security',
    agencyId: 'gsis',
    route: '/agencies/gsis/services/claims',
    accessPolicy: 'verified',
    supportedAction: 'Manage Claims'
  },
  {
    id: 'gsis-ecard',
    title: 'GSIS e-Card',
    description: 'Access your GSIS digital e-Card.',
    category: 'Social Security',
    agencyId: 'gsis',
    route: '/agencies/gsis/services/ecard',
    accessPolicy: 'verified',
    supportedAction: 'View e-Card'
  },

  // ── PHILHEALTH SERVICES ──
  {
    id: 'philhealth-membership',
    title: 'Membership Verification',
    description: 'Verify your PhilHealth membership status.',
    category: 'Health',
    agencyId: 'philhealth',
    route: '/agencies/philhealth/services/membership',
    accessPolicy: 'verified',
    supportedAction: 'Verify'
  },
  {
    id: 'philhealth-contribution',
    title: 'Contribution Inquiry',
    description: 'Check your PhilHealth contribution records.',
    category: 'Health',
    agencyId: 'philhealth',
    route: '/agencies/philhealth/services/contribution',
    accessPolicy: 'verified',
    supportedAction: 'View Records'
  },
  {
    id: 'philhealth-claims',
    title: 'Benefits & Claims',
    description: 'Track PhilHealth claims and benefits.',
    category: 'Health',
    agencyId: 'philhealth',
    route: '/agencies/philhealth/services/claims',
    accessPolicy: 'verified',
    supportedAction: 'View Claims'
  },
  {
    id: 'philhealth-facilities',
    title: 'Accredited Facilities',
    description: 'Find PhilHealth-accredited hospitals and clinics.',
    category: 'Health',
    agencyId: 'philhealth',
    route: '/agencies/philhealth/services/facilities',
    accessPolicy: 'public',
    supportedAction: 'Find Facilities'
  },

  // ── PAG-IBIG SERVICES ──
  {
    id: 'pagibig-contribution',
    title: 'Contribution Inquiry',
    description: 'Check your Pag-IBIG regular savings.',
    category: 'Housing',
    agencyId: 'pagibig',
    route: '/agencies/pagibig/services/contribution',
    accessPolicy: 'verified',
    supportedAction: 'View Records'
  },
  {
    id: 'pagibig-housing',
    title: 'Housing Loan',
    description: 'Apply or check status of housing loans.',
    category: 'Housing',
    agencyId: 'pagibig',
    route: '/agencies/pagibig/services/housing',
    accessPolicy: 'verified',
    supportedAction: 'View Loan'
  },
  {
    id: 'pagibig-calamity',
    title: 'Calamity Loan',
    description: 'Apply for a calamity loan.',
    category: 'Housing',
    agencyId: 'pagibig',
    route: '/agencies/pagibig/services/calamity',
    accessPolicy: 'verified',
    supportedAction: 'Apply Now'
  },
  {
    id: 'pagibig-mp2',
    title: 'MP2 Savings',
    description: 'Manage your Modified Pag-IBIG II (MP2) savings.',
    category: 'Housing',
    agencyId: 'pagibig',
    route: '/agencies/pagibig/services/mp2',
    accessPolicy: 'verified',
    supportedAction: 'View MP2'
  },

  // ── LTO SERVICES ──
  {
    id: 'lto-license',
    title: 'eDriver\'s License',
    description: 'View your digital driver\'s license.',
    category: 'Transportation',
    agencyId: 'lto',
    route: '/agencies/lto/services/license',
    accessPolicy: 'verified',
    supportedAction: 'View License'
  },
  {
    id: 'lto-registration',
    title: 'Vehicle Registration',
    description: 'Check vehicle registration status.',
    category: 'Transportation',
    agencyId: 'lto',
    route: '/agencies/lto/services/registration',
    accessPolicy: 'verified',
    supportedAction: 'View Vehicles'
  },
  {
    id: 'lto-verification',
    title: 'Verification Services',
    description: 'Verify LTO documents and records.',
    category: 'Transportation',
    agencyId: 'lto',
    route: '/agencies/lto/services/verification',
    accessPolicy: 'public',
    supportedAction: 'Verify'
  },
  
  // ── BIR SERVICES ──
  {
    id: 'bir-tin',
    title: 'TIN Inquiry',
    description: 'Verify your Tax Identification Number.',
    category: 'Taxation',
    agencyId: 'bir',
    route: '/agencies/bir/services/tin',
    accessPolicy: 'verified',
    supportedAction: 'Inquire'
  },
  {
    id: 'bir-filing',
    title: 'Tax Filing Status',
    description: 'Check status of your tax filings.',
    category: 'Taxation',
    agencyId: 'bir',
    route: '/agencies/bir/services/filing',
    accessPolicy: 'verified',
    supportedAction: 'View Status'
  },
  {
    id: 'bir-receipts',
    title: 'eReceipts',
    description: 'View electronic tax receipts.',
    category: 'Taxation',
    agencyId: 'bir',
    route: '/agencies/bir/services/receipts',
    accessPolicy: 'verified',
    supportedAction: 'View Receipts'
  },
  {
    id: 'bir-digital-tin',
    title: 'Digital TIN ID',
    description: 'Access your digital TIN ID.',
    category: 'Taxation',
    agencyId: 'bir',
    route: '/agencies/bir/services/digital-tin',
    accessPolicy: 'verified',
    supportedAction: 'View ID'
  },
  
  // ── NBI SERVICES ──
  {
    id: 'nbi-clearance',
    title: 'NBI Clearance',
    description: 'Apply for a new NBI clearance.',
    category: 'Public Safety',
    agencyId: 'nbi',
    route: '/agencies/nbi/services/clearance',
    accessPolicy: 'verified',
    supportedAction: 'Apply'
  },
  {
    id: 'nbi-appointment',
    title: 'Appointment Booking',
    description: 'Book an appointment for NBI clearance.',
    category: 'Public Safety',
    agencyId: 'nbi',
    route: '/bpesh/nbi-clearance', // Matches existing /bpesh/nbi-clearance
    accessPolicy: 'verified',
    supportedAction: 'Book Now'
  },
  {
    id: 'nbi-renewal',
    title: 'Clearance Renewal',
    description: 'Renew an existing NBI clearance.',
    category: 'Public Safety',
    agencyId: 'nbi',
    route: '/agencies/nbi/services/renewal',
    accessPolicy: 'verified',
    supportedAction: 'Renew'
  },
  
  // ── DFA SERVICES ──
  {
    id: 'dfa-appointment',
    title: 'Passport Appointment',
    description: 'Schedule a passport application appointment.',
    category: 'Foreign Affairs',
    agencyId: 'dfa',
    route: '/agencies/dfa/services/appointment',
    accessPolicy: 'public',
    supportedAction: 'Book Now'
  },
  {
    id: 'dfa-status',
    title: 'Passport Status',
    description: 'Check the status of your passport application.',
    category: 'Foreign Affairs',
    agencyId: 'dfa',
    route: '/agencies/dfa/services/status',
    accessPolicy: 'public',
    supportedAction: 'Check Status'
  },
  {
    id: 'dfa-authentication',
    title: 'Authentication',
    description: 'Apostille and authentication services.',
    category: 'Foreign Affairs',
    agencyId: 'dfa',
    route: '/agencies/dfa/services/authentication',
    accessPolicy: 'public',
    supportedAction: 'Apply'
  },
  {
    id: 'dfa-consular',
    title: 'Consular Services',
    description: 'Other consular services and assistance.',
    category: 'Foreign Affairs',
    agencyId: 'dfa',
    route: '/agencies/dfa/services/consular',
    accessPolicy: 'public',
    supportedAction: 'View Services'
  },
  
  // ── DOLE SERVICES ──
  {
    id: 'dole-jobsearch',
    title: 'Job Search',
    description: 'Find local and overseas job opportunities.',
    category: 'Employment',
    agencyId: 'dole',
    route: '/employment',
    accessPolicy: 'public',
    supportedAction: 'Search Jobs'
  },
  {
    id: 'dole-spes',
    title: 'SPES Program',
    description: 'Special Program for Employment of Students.',
    category: 'Employment',
    agencyId: 'dole',
    route: '/agencies/dole/services/spes',
    accessPolicy: 'unverified',
    supportedAction: 'Apply'
  },
  {
    id: 'dole-livelihood',
    title: 'Livelihood Programs',
    description: 'Access various livelihood assistance programs.',
    category: 'Employment',
    agencyId: 'dole',
    route: '/agencies/dole/services/livelihood',
    accessPolicy: 'public',
    supportedAction: 'View Programs'
  },
  {
    id: 'dole-rights',
    title: 'Worker\'s Rights',
    description: 'Information on labor rights and standards.',
    category: 'Employment',
    agencyId: 'dole',
    route: '/agencies/dole/services/rights',
    accessPolicy: 'public',
    supportedAction: 'Read More'
  },
  
  // ── PRC SERVICES ──
  {
    id: 'prc-verification',
    title: 'License Verification',
    description: 'Verify a professional license.',
    category: 'Professional Licensing',
    agencyId: 'prc',
    route: '/agencies/prc/services/verification',
    accessPolicy: 'public',
    supportedAction: 'Verify'
  },
  {
    id: 'prc-results',
    title: 'Board Exam Results',
    description: 'Check recent licensure examination results.',
    category: 'Professional Licensing',
    agencyId: 'prc',
    route: '/agencies/prc/services/results',
    accessPolicy: 'public',
    supportedAction: 'View Results'
  },
  {
    id: 'prc-id',
    title: 'PRC ID',
    description: 'Access your digital PRC ID.',
    category: 'Professional Licensing',
    agencyId: 'prc',
    route: '/agencies/prc/services/id',
    accessPolicy: 'verified',
    supportedAction: 'View ID'
  },
  {
    id: 'prc-renewal',
    title: 'License Renewal',
    description: 'Renew your professional license.',
    category: 'Professional Licensing',
    agencyId: 'prc',
    route: '/agencies/prc/services/renewal',
    accessPolicy: 'verified',
    supportedAction: 'Renew'
  },
  
  // ── OWWA SERVICES ──
  {
    id: 'owwa-membership',
    title: 'OFW Membership',
    description: 'Check OWWA membership status.',
    category: 'OFW Services',
    agencyId: 'owwa',
    route: '/agencies/owwa/services/membership',
    accessPolicy: 'verified',
    supportedAction: 'Check Status'
  },
  {
    id: 'owwa-benefits',
    title: 'Benefits & Claims',
    description: 'Access OFW benefits and claims.',
    category: 'OFW Services',
    agencyId: 'owwa',
    route: '/agencies/owwa/services/claims',
    accessPolicy: 'verified',
    supportedAction: 'View Benefits'
  },
  {
    id: 'owwa-reintegration',
    title: 'Reintegration Programs',
    description: 'Programs for returning OFWs.',
    category: 'OFW Services',
    agencyId: 'owwa',
    route: '/agencies/owwa/services/reintegration',
    accessPolicy: 'public',
    supportedAction: 'View Programs'
  },
  {
    id: 'owwa-ecard',
    title: 'OWWA eCard',
    description: 'Access your digital OWWA eCard.',
    category: 'OFW Services',
    agencyId: 'owwa',
    route: '/agencies/owwa/services/ecard',
    accessPolicy: 'verified',
    supportedAction: 'View eCard'
  },
  
  // ── DSWD SERVICES ──
  {
    id: 'dswd-4ps',
    title: '4Ps Beneficiary Inquiry',
    description: 'Check status for the Pantawid Pamilyang Pilipino Program.',
    category: 'Social Welfare',
    agencyId: 'dswd',
    route: '/agencies/dswd/services/4ps',
    accessPolicy: 'verified',
    supportedAction: 'Check Status'
  },
  {
    id: 'dswd-aics',
    title: 'Assistance for Individuals in Crisis',
    description: 'AICS program information and application.',
    category: 'Social Welfare',
    agencyId: 'dswd',
    route: '/agencies/dswd/services/aics',
    accessPolicy: 'unverified',
    supportedAction: 'Apply'
  },
  {
    id: 'dswd-pension',
    title: 'Social Pension',
    description: 'Social pension for indigent senior citizens.',
    category: 'Social Welfare',
    agencyId: 'dswd',
    route: '/agencies/dswd/services/pension',
    accessPolicy: 'verified',
    supportedAction: 'View Details'
  }
];

export function getServiceById(id: string): ServiceDefinition | undefined {
  return SERVICE_REGISTRY.find(s => s.id === id);
}

export function getServiceByRoute(route: string): ServiceDefinition | undefined {
  return SERVICE_REGISTRY.find(s => s.route === route);
}

export function getServicesByAgency(agencyId: string): ServiceDefinition[] {
  return SERVICE_REGISTRY.filter(s => s.agencyId === agencyId);
}

export function getAllServices(): ServiceDefinition[] {
  return SERVICE_REGISTRY;
}
