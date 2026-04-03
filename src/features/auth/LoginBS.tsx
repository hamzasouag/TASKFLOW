import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../../api/axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const LoginBS: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // ✅ On destructure { state, dispatch } — exactement ce que useAuth() retourne
  const { state, dispatch } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = (location.state as { from?: string })?.from ?? '/dashboard';

 
  useEffect(() => {
    if (state.user) {
      navigate(from, { replace: true });
    }
  }, [state.user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Signale le début du chargement
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await api.post('/auth/login', { email, password });

      // ✅ Dispatch l'action de succès avec les données reçues
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });

      navigate(from, { replace: true });
    } catch (err: any) {
      // ✅ Dispatch l'action d'erreur
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: err.response?.data?.message ?? 'Identifiants incorrects.',
      });
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

          {/* ✅ state.error vient du reducer */}
          {state.error && (
            <Alert variant="danger" className="py-2">
              {state.error}
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

            {/* ✅ state.loading vient du reducer */}
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={state.loading}
            >
              {state.loading ? (
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