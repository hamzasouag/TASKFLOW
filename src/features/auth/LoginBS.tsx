import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { loginFailure, loginStart, loginSuccess } from './authSlice';
import type { AppDispatch, RootState } from '../../store';

const LoginBS: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = (location.state as { from?: string })?.from ?? '/dashboard';

 
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: unknown) {
      dispatch(loginFailure('Identifiants incorrects.'));
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '100%', maxWidth: '420px' }} className="shadow-sm p-4">
        <Card.Body>
          <h2 className="text-center fw-bold mb-1">TaskFlow</h2>
          <p className="text-center text-muted mb-4">Connectez-vous à votre espace</p>

          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="bs-email">
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="exemple@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="bs-password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Connexion…
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginBS;