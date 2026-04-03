import { useState } from 'react';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  submitLabel: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

export default function ProjectForm({ submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1B8C3E');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), color);
    setName('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Nom du projet"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
      />
      <input
        className={styles.color}
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        title="Couleur du projet"
      />
      <button className={styles.btnSubmit} type="submit">
        {submitLabel}
      </button>
      <button className={styles.btnCancel} type="button" onClick={onCancel}>
        Annuler
      </button>
    </form>
  );
}
