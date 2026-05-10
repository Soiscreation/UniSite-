const today = new Date('2026-04-25T10:00:00+03:00')

export let clients = [
  { id: 'cl_1001', name: 'Mwananchi Foods Ltd', email: 'ops@mwananchifoods.co.ke', phone: '+254 711 204 900', type: 'Corporate', region: 'Nairobi', status: 'Active', premium: 1840000, joinedAt: '2024-08-14', contact: 'Mercy Wambui' },
  { id: 'cl_1002', name: 'Orbit Logistics', email: 'risk@orbitlogistics.co.ke', phone: '+254 722 410 112', type: 'Corporate', region: 'Mombasa', status: 'Active', premium: 2360000, joinedAt: '2023-11-03', contact: 'Daniel Mwangi' },
  { id: 'cl_1003', name: 'Safeguard Homes', email: 'hello@safeguardhomes.co.ke', phone: '+254 733 882 016', type: 'SME', region: 'Kisumu', status: 'Review', premium: 980000, joinedAt: '2025-02-18', contact: 'Janet Achieng' },
  { id: 'cl_1004', name: 'BrightPath School', email: 'admin@brightpath.ac.ke', phone: '+254 700 119 440', type: 'Institution', region: 'Nakuru', status: 'Active', premium: 1280000, joinedAt: '2022-06-09', contact: 'Peter Kariuki' },
  { id: 'cl_1005', name: 'Horizon Clinic Group', email: 'finance@horizonclinic.co.ke', phone: '+254 755 334 010', type: 'Healthcare', region: 'Nairobi', status: 'Inactive', premium: 3120000, joinedAt: '2021-09-21', contact: 'Dr. Linda Bosire' },
]

export let policies = [
  { id: 'pol_501', number: 'POL-MED-2026-501', clientId: 'cl_1001', product: 'Group Medical', insurer: 'Jubilee Health', status: 'Active', premium: 1840000, startDate: '2026-01-01', endDate: '2026-12-31' },
  { id: 'pol_502', number: 'POL-MTR-2026-502', clientId: 'cl_1002', product: 'Fleet Motor', insurer: 'Britam General', status: 'Active', premium: 2360000, startDate: '2026-02-01', endDate: '2027-01-31' },
  { id: 'pol_503', number: 'POL-FIR-2025-503', clientId: 'cl_1003', product: 'Fire and Perils', insurer: 'CIC Insurance', status: 'Pending', premium: 980000, startDate: '2026-05-01', endDate: '2027-04-30' },
  { id: 'pol_504', number: 'POL-LIA-2025-504', clientId: 'cl_1004', product: 'Public Liability', insurer: 'APA Insurance', status: 'Expired', premium: 420000, startDate: '2025-01-01', endDate: '2025-12-31' },
]

export const claims = [
  { id: 'CLM-1108', client: 'Mwananchi Foods Ltd', type: 'Fire', status: 'Pending', amount: 640000 },
  { id: 'CLM-1097', client: 'Orbit Logistics', type: 'Motor', status: 'Approved', amount: 370000 },
  { id: 'CLM-1052', client: 'Safeguard Homes', type: 'Property', status: 'Rejected', amount: 220000 },
]

export const revenueSeries = [
  { label: 'Jan', revenue: 4100000, policies: 21 },
  { label: 'Feb', revenue: 4600000, policies: 24 },
  { label: 'Mar', revenue: 5200000, policies: 27 },
  { label: 'Apr', revenue: 6100000, policies: 31 },
  { label: 'May', revenue: 6800000, policies: 35 },
  { label: 'Jun', revenue: 7400000, policies: 38 },
]

export const activity = [
  { id: 1, title: 'Medical policy renewed', detail: 'Mwananchi Foods Ltd', time: '12 min ago' },
  { id: 2, title: 'Claim approved', detail: 'Orbit Logistics motor claim', time: '1 hr ago' },
  { id: 3, title: 'Tender uploaded', detail: 'County Health Board cover', time: 'Yesterday' },
]

export function nextId(prefix) {
  return `${prefix}_${today.getTime()}_${Math.floor(Math.random() * 1000)}`
}
