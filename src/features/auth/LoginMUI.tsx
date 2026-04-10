import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from
'@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { loginFailure, loginStart, loginSuccess } from './authSlice';
import type { AppDispatch, RootState } from '../../store';

export default function LoginMUI() {
 const dispatch = useDispatch<AppDispatch>();
 const { loading, error } = useSelector((state: RootState) => state.auth);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

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
 JSON.stringify({ userId: currentUser.id, email: currentUser.email, role, exp }),
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
 <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh',
bgcolor:'#f0f0f0' }}>
 <Card sx={{ maxWidth: 400, width: '100%' }}>
 <CardContent sx={{ display:'flex', flexDirection:'column', gap:2, p:4 }}>
 <Typography variant="h4" align="center" color="#1B8C3E" fontWeight={700}>
 TaskFlow
 </Typography>
 <Typography variant="body2" align="center" color="text.secondary">
 Connectez-vous pour continuer
 </Typography>
 {error && <Alert severity="error">{error}</Alert>}
 <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column',
gap:'16px' }}>
 <TextField label="Email" type="email" value={email}
 onChange={e => setEmail(e.target.value)} fullWidth required />
 <TextField label="Mot de passe" type="password" value={password}
 onChange={e => setPassword(e.target.value)} fullWidth required />
 <Button type="submit" variant="contained" fullWidth disabled={loading}
 sx={{ bgcolor:'#1B8C3E', '&:hover':{ bgcolor:'#157a33' } }}>
 {loading ? 'Connexion...' : 'Se connecter'}
 </Button>
 </form>
 </CardContent>
 </Card>
 </Box>
 );
}
