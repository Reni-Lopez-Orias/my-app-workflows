import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.tsx';
import * as api from './api.ts';
import type { Tarea } from './api.ts';

vi.mock('./api.ts');

const tareaEjemplo: Tarea = {
  id: 1,
  titulo: 'Comprar pan',
  descripcion: null,
  estado: 'PENDIENTE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('App', () => {
  beforeEach(() => {
    vi.mocked(api.listarTareas).mockResolvedValue([]);
  });

  it('muestra el mensaje de vacio cuando no hay tareas', async () => {
    render(<App />);

    expect(await screen.findByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it('lista las tareas que devuelve la API', async () => {
    vi.mocked(api.listarTareas).mockResolvedValue([tareaEjemplo]);

    render(<App />);

    expect(await screen.findByText('Comprar pan')).toBeInTheDocument();
  });

  it('crea una tarea al enviar el formulario', async () => {
    const user = userEvent.setup();
    vi.mocked(api.crearTarea).mockResolvedValue(tareaEjemplo);
    render(<App />);
    await screen.findByText(/no hay tareas/i);

    await user.type(screen.getByPlaceholderText('Título'), 'Comprar pan');
    await user.click(screen.getByRole('button', { name: /agregar/i }));

    expect(api.crearTarea).toHaveBeenCalledWith({
      titulo: 'Comprar pan',
      descripcion: undefined,
    });
  });

  it('alterna el estado al hacer click en la tarea', async () => {
    const user = userEvent.setup();
    vi.mocked(api.listarTareas).mockResolvedValue([tareaEjemplo]);
    vi.mocked(api.actualizarTarea).mockResolvedValue({
      ...tareaEjemplo,
      estado: 'HECHA',
    });
    render(<App />);

    const item = await screen.findByText('Comprar pan');
    await user.click(item);

    expect(api.actualizarTarea).toHaveBeenCalledWith(1, { estado: 'HECHA' });
  });

  it('elimina una tarea al hacer click en "Eliminar"', async () => {
    const user = userEvent.setup();
    vi.mocked(api.listarTareas).mockResolvedValue([tareaEjemplo]);
    vi.mocked(api.eliminarTarea).mockResolvedValue(null);
    render(<App />);
    await screen.findByText('Comprar pan');

    await user.click(
      screen.getByRole('button', { name: /eliminar comprar pan/i }),
    );

    expect(api.eliminarTarea).toHaveBeenCalledWith(1);
  });

  it('muestra un error si no se puede conectar con la API', async () => {
    vi.mocked(api.listarTareas).mockRejectedValue(new Error('network fail'));

    render(<App />);

    expect(
      await screen.findByText(/no se pudo conectar/i),
    ).toBeInTheDocument();
  });
});
