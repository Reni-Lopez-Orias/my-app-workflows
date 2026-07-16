const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message?.toString() ?? `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const listarTareas = () => request('/tareas');

export const crearTarea = (data) =>
  request('/tareas', { method: 'POST', body: JSON.stringify(data) });

export const actualizarTarea = (id, data) =>
  request(`/tareas/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const eliminarTarea = (id) =>
  request(`/tareas/${id}`, { method: 'DELETE' });
