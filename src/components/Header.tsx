import { useDispatch, useSelector } from 'react-redux';
import styles from './Header.module.css';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';

interface HeaderProps {
	title: string;
	onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
	const dispatch = useDispatch<AppDispatch>();
	const userName = useSelector((state: RootState) => state.auth.user?.name);

	function handleLogout() {
		localStorage.removeItem('taskflow_token');
		localStorage.removeItem('taskflow_user');
		dispatch(logout());
	}

	return (
		<header className={styles.header}>
			<div className={styles.left}>
				<button className={styles.menuBtn} onClick={onMenuClick}>
					☰
				</button>
				<h1 className={styles.logo}>{title}</h1>
			</div>
			<div className={styles.right}>
				{userName && <span className={styles.userName}>{userName}</span>}
				{userName && (
					<button className={styles.logoutBtn} onClick={handleLogout}>
						Deconnexion
					</button>
				)}
			</div>
		</header>
	);
}