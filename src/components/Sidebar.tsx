import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project { id: string; name: string; color: string; }

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map(p => (
          <li key={p.id}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.dot} style={{ background: p.color }} />
              <span className={styles.name}>{p.name}</span>
              <div className={styles.actions}>
                <button
                  className={styles.btnRename}
                  onClick={(e) => {
                    e.preventDefault(); // ✅ évite la navigation au clic bouton
                    onRename(p);
                  }}
                  title="Renommer"
                >
                  ✏️
                </button>
                <button
                  className={styles.btnDelete}
                  onClick={(e) => {
                    e.preventDefault(); // ✅ évite la navigation au clic bouton
                    onDelete(p.id);
                  }}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
