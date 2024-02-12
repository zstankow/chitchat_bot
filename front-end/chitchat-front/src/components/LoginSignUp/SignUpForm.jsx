import React, { useState, useEffect } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import './LoginSignUp.css';

export default function SignUpForm({ closeModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, updateUser } = useAuth();
  const [invalidFields, setInvalidFields] = useState([]);
  const [level, setLevel] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    level: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const generateUniqueId = () => {
    return nanoid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !firstName || !lastName || !level) {
      console.error('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/signup', {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        level,
      });
      const userData = response.data;
      // login({ email, password, firstName, lastName, level });
      updateUser(userData);
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate('/home');
      }, 1000);
      closeModal();
    } catch (error) {
      console.error('Error registering user:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      navigate('/home');
    }
  }, [showSuccessMessage, navigate]);

  return (
    <Form onSubmit={handleSubmit}>
      {showSuccessMessage && <Alert variant="success">Signup successful!</Alert>}

      <Form.Group controlId="formBasicEmail" className={invalidFields.includes('email') ? 'invalid' : ''}>
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errorMessages.email && <small className="text-danger">{errorMessages.email}</small>}
      </Form.Group>

      <Form.Group controlId="formBasicPassword" className={invalidFields.includes('password') ? 'invalid' : ''}>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessages.password && <small className="text-danger">{errorMessages.password}</small>}
      </Form.Group>

      <Form.Group controlId="formBasicConfirmPassword" className={invalidFields.includes('confirmPassword') ? 'invalid' : ''}>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {errorMessages.confirmPassword && <small className="text-danger">{errorMessages.confirmPassword}</small>}
      </Form.Group>

      <Form.Group controlId="formBasicFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicLanguageLevel" className={invalidFields.includes('languageLevel') ? 'invalid' : ''}>
        <Form.Label>Language Level</Form.Label>
        <div>
          <label>
            Beginner
            <input
              type="radio"
              value="Beginner"
              checked={level === 'Beginner'}
              onChange={(e) => setLevel(e.target.value)}
            />
          </label>
          <label>
            Intermediate
            <input
              type="radio"
              value="Intermediate"
              checked={level === 'Intermediate'}
              onChange={(e) => setLevel(e.target.value)}
            />
          </label>
          <label>
            Advanced
            <input
              type="radio"
              value="Advanced"
              checked={level === 'Advanced'}
              onChange={(e) => setLevel(e.target.value)}
            />
          </label>
        </div>
        {errorMessages.level && <small className="text-danger">{errorMessages.level}</small>}
      </Form.Group>

      <button className="switch-login-signup-btn" type="submit" disabled={loading}>
        {loading ? (
          <>
            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
            {' Loading...'}
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </Form>
  );
}