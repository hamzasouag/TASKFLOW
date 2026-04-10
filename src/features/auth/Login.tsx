import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import styles from './Login.module.css';
import { loginFailure, loginStart, loginSuccess } from './authSlice';
import type { AppDispatch, RootState } from '../../store';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch<AppDispatch>();
	const { user, loading, error } = useSelector((state: RootState) => state.auth);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

	useEffect(() => {
		if (user) {
			navigate(from, { replace: true });
		}
	}, [user, navigate, from]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch(loginStart());

		try {
			const { data: users } = await api.get(`/users?email=${email}`);
			if (users.length === 0 || users[0].password !== password) {
				dispatch(loginFailure('Email ou mot de passe incorrect'));
				return;
			}

			const currentUser = users[0] as { id: string; email: string; name: string; role?: string; password: string };
			const role = currentUser.role ?? (currentUser.email.includes('admin') ? 'admin' : 'member');
			const exp = Math.floor(Date.now() / 1000) + 60 * 60;
			const fakeToken = btoa(
				JSON.stringify({
					userId: currentUser.id,
					email: currentUser.email,
					role,
					exp,
				}),
			);

			const { password: _password, ...userPayload } = currentUser;
			const authenticatedUser = { ...userPayload, role };

			localStorage.setItem('taskflow_token', fakeToken);
			localStorage.setItem('taskflow_user', JSON.stringify(authenticatedUser));
			dispatch(loginSuccess({ user: authenticatedUser, token: fakeToken }));
		} catch {
			dispatch(loginFailure('Erreur serveur'));
		}
	}

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className={styles.title}>TaskFlow</h1>
				<p className={styles.subtitle}>Connectez-vous pour continuer</p>
				{error && <div className={styles.error}>{error}</div>}
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className={styles.input}
					required
				/>
				<input
					type="password"
					placeholder="Mot de passe"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className={styles.input}
					required
				/>
				<button type="submit" className={styles.button} disabled={loading}>
					{loading ? 'Connexion...' : 'Se connecter'}
				</button>
			</form>
		</div>
	);
}