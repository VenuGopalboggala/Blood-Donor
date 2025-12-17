const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export async function matchDonors({ bloodType, lat, lng, radiusKm=50 }) {
  const res = await fetch(`${API_BASE}/api/features/match`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ bloodType, lat, lng, radiusKm })
  });
  return res.json();
}

export async function createSOS(payload) {
  const res = await fetch(`${API_BASE}/api/features/sos`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function toggleAvailability(donorId, isAvailable) {
  const res = await fetch(`${API_BASE}/api/features/donor/${donorId}/availability`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ isAvailable })
  });
  return res.json();
}

export async function recordDonation(donorId, body) {
  const res = await fetch(`${API_BASE}/api/features/donor/${donorId}/donate`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function getDonationHistory(donorId) {
  const res = await fetch(`${API_BASE}/api/features/donor/${donorId}/history`);
  return res.json();
}

export async function createHospital(body) {
  const res = await fetch(`${API_BASE}/api/features/hospitals`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function verifyHospital(id, verified) {
  const res = await fetch(`${API_BASE}/api/features/hospitals/${id}/verify`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ verified })
  });
  return res.json();
}
