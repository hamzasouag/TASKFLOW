import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axios';

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? `Erreur ${err.response?.status ?? ''}`.trim();
  }
  return 'Erreur inconnue';
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projRes, colRes] = await Promise.all([api.get('/projects'), api.get('/columns')]);
      setProjects(projRes.data);
      setColumns(colRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const addProject = useCallback(async (name: string, color: string) => {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const renameProject = useCallback(async (id: string, name: string) => {
    setSaving(true);
    setError(null);
    try {
      const current = projects.find(project => project.id === id);
      if (!current) {
        throw new Error('Projet introuvable');
      }
      const { data } = await api.put(`/projects/${id}`, { ...current, name });
      setProjects(prev => prev.map(project => (project.id === id ? data : project)));
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }, [projects]);

  const deleteProject = useCallback(async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    projects,
    columns,
    loading,
    saving,
    error,
    addProject,
    renameProject,
    deleteProject,
    reload: fetchData,
  };
}
