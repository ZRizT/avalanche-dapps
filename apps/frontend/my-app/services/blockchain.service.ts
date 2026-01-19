const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error("NEXT_PUBLIC_BACKEND_URL belum diset!");
}

export async function getBlockchainValue() {
  const res = await fetch(`${BACKEND_URL}/blockchain/value`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch value");
  return res.json();
}

export async function getBlockchainIdentity() {
  const res = await fetch(`${BACKEND_URL}/blockchain/identity`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch identity");
  return res.json();
}

export async function getBlockchainEvents() {
  const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch events");
  return res.json();
}