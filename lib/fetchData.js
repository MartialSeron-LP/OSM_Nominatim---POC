// const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org";
// const NOMINATIM_API_URL = "https://geocoding.geofabrik.de/b74413d43f121a21b544bcef1b0c7fcc";
const NOMINATIM_API_URL = "http://localhost:8080";

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;

  const controller = new AbortController();

  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
}

export async function search({ q, format = "jsonv2", limit = 10 }) {
  const headers = [["Accept", "application/json"]];

  const qs = new URLSearchParams({ q, format, limit });

  const url = `${NOMINATIM_API_URL}/search?${qs}`;

  try {
    const response = await fetchWithTimeout(url, {
      headers,
    });

    const data = await response.json();

    console.log({ data });

    return data;
  } catch (err) {
    console.error({ err });
    throw err;
  }
}

export async function reverse({ lat, lon, zoom = 18, format = "jsonv2" }) {
  const headers = [["Accept", "application/json"]];

  const qs = new URLSearchParams({ lat, lon, zoom, format });

  const url = `${NOMINATIM_API_URL}/reverse?${qs}`;

  try {
    const response = await fetchWithTimeout(url, {
      headers,
    });

    const data = await response.json();

    return data;
  } catch (err) {
    console.error({ err });
    throw err;
  }
}
