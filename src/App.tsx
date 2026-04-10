import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginBS from './features/auth/LoginBS';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { setAuthToken } from './api/axios';
import type { RootState } from './store';

export default function App() {
	const token = useSelector((state: RootState) => state.auth.token);

	useEffect(() => {
		setAuthToken(token);
	}, [token]);

	return (
		<Routes>
			<Route path="/login" element={<LoginBS />} />
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/projects/:id"
				element={
					<ProtectedRoute>
						<ProjectDetail />
					</ProtectedRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/dashboard" replace />} />
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
}
