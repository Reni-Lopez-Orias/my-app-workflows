import { useEffect, useState, type SubmitEvent } from 'react';
import './App.css';
import {
  actualizarTarea,
  crearTarea,
  eliminarTarea,
  listarTareas,
  type Tarea,
} from './api.ts';

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarTareas = async () => {
    try {
      setTareas(await listarTareas());
      setError('');
    } catch (err) {
      setError('No se pudo conectar con la API (' + (err as Error).message + ')');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial en el mount, sin dependencias que cambien
    cargarTareas();
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    try {
      await crearTarea({ titulo, descripcion: descripcion || undefined });
      setTitulo('');
      setDescripcion('');
      cargarTareas();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggleEstado = async (tarea: Tarea) => {
    try {
      await actualizarTarea(tarea.id, {
        estado: tarea.estado === 'PENDIENTE' ? 'HECHA' : 'PENDIENTE',
      });
      cargarTareas();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTarea(id);
      cargarTareas();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="app">
      <h1>Tareas</h1>

      <form className="tarea-form" onSubmit={handleSubmit}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción (opcional)"
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}

      <ul className="tarea-list">
        {tareas.map((tarea) => (
          <li key={tarea.id} className={tarea.estado === 'HECHA' ? 'done' : ''}>
            <span className="tarea-info" onClick={() => toggleEstado(tarea)}>
              {tarea.titulo}
              {tarea.descripcion ? ` — ${tarea.descripcion}` : ''}
            </span>
            <button
              className="eliminar"
              onClick={() => handleEliminar(tarea.id)}
              aria-label={`Eliminar ${tarea.titulo}`}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {!cargando && tareas.length === 0 && !error && (
        <p>No hay tareas todavía. ¡Agregá una!</p>
      )}
    </div>
  );
}

export default App;
