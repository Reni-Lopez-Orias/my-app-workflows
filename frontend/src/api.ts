type EstadoTarea = 'PENDIENTE' | 'HECHA';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: EstadoTarea;
  createdAt: string;
  updatedAt: string;
}

export interface CrearTareaInput {
  titulo: string;
  descripcion?: string;
  estado?: EstadoTarea;
}

export type ActualizarTareaInput = Partial<CrearTareaInput>;

const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message?.toString() ?? `Error ${res.status}`);
  }
  return res.status === 204 ? (null as T) : res.json();
}

export const listarTareas = () => request<Tarea[]>('/tareas');

export const crearTarea = (data: CrearTareaInput) =>
  request<Tarea>('/tareas', { method: 'POST', body: JSON.stringify(data) });

export const actualizarTarea = (id: number, data: ActualizarTareaInput) =>
  request<Tarea>(`/tareas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const eliminarTarea = (id: number) =>
  request<null>(`/tareas/${id}`, { method: 'DELETE' });
