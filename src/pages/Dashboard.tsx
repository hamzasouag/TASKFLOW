import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import styles from './Dashboard.module.css';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // GET — charger les données au montage
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ B:helper pour éviter la répétition du catch
  function handleApiError(err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
    } else {
      setError('Erreur inconnue');
    }
  }

  // POST — ajouter un projet
  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
    } catch (err) {
      handleApiError(err);   // B:remplacer le bloc catch répété
    } finally {
      setSaving(false);
    }
  }

  // PUT — renommer un projet
  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName === project.name) return;

    setSaving(true);         // B
    setError(null);          // B
    try {
      const { data } = await api.put('/projects/' + project.id, { ...project, name: newName });
      setProjects(prev =>
        prev.map(p => (p.id === project.id ? data : p))
      );
    } catch (err) {
      handleApiError(err);   // B

    } finally {
      setSaving(false);      // B

    }
  }

  // DELETE — supprimer un projet
  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;

    setSaving(true);         // B
    setError(null);          // B
    try {
      await api.delete('/projects/' + id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleApiError(err);   // B

    } finally {
      setSaving(false);      //  B
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={renameProject}
          onDelete={deleteProject}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>

            {/* ✅ Affichage de l'erreur */}
            {error && (
              <p className={styles.error}>{error}</p>
            )}

            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : '+ Nouveau projet'}
              </button>
            ) : (
              <form
                className={styles.inlineForm}
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
                  const color = (form.elements.namedItem('color') as HTMLInputElement).value;
                  if (!name) return;
                  addProject(name, color);
                  setShowForm(false);
                }}
              >
                <input
                  name="name"
                  placeholder="Nom du projet"
                  autoFocus
                />
                <input
                  name="color"
                  type="color"
                  defaultValue="#1B8C3E"
                />
                <button type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Créer'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </form>
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
