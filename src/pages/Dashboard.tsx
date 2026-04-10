import { useCallback, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useProjects, type Project } from '../hooks/useProjects';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { projects, columns, loading, saving, error, addProject, renameProject, deleteProject } =
    useProjects();

  const handleRename = useCallback(
    async (project: Project) => {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName === project.name) return;

    try {
      await renameProject(project.id, newName);
    } catch {
      // Error is already captured by the hook state.
    }
    },
    [renameProject],
  );

  const handleDelete = useCallback(
    async (id: string) => {
    if (!confirm('Êtes-vous sûr ?')) return;

    try {
      await deleteProject(id);
    } catch {
      // Error is already captured by the hook state.
    }
    },
    [deleteProject],
  );

  const handleCreateProject = useCallback(
    async (name: string, color: string) => {
      try {
        await addProject(name, color);
      } catch {
        // Error is already captured by the hook state.
      }
    },
    [addProject],
  );

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
      />
      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={handleRename}
          onDelete={handleDelete}
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
                  void handleCreateProject(name, color);
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
