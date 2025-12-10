'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** The sign up page. */
const SignUp = () => {
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      const result = await createUser({
        email: data.email,
        password: data.password,
        username: data.username,
      });

      if (!result.ok) {
        // Inline error under the correct field
        setError(result.field, {
          type: 'manual',
          message: result.message,
        });
        return;
      }

      // Only sign in if user creation succeeded
      await signIn('credentials', {
        callbackUrl: '/add',
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      // Only truly unexpected errors reach here now
      console.error('Sign up error:', err);
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <h1 className="text-center fw-bold mb-3 hero-title display-5">Join Manoa Guesser!</h1>
            <p className="text-center mb-4 hero-subtitle fs-4">Create an account to start exploring UH Manoa.</p>

            <Card className="p-4 rounded-4 home-card">
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* Username */}
                  <Form.Group className="form-group mb-3">
                    <Form.Label>Username</Form.Label>
                    <input
                      type="text"
                      {...register('username')}
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="form-group mb-3">
                    <Form.Label>Email</Form.Label>
                    <input
                      type="text"
                      {...register('email')}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="form-group mb-3">
                    <Form.Label>Password</Form.Label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="form-group mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </Form.Group>

                  <Form.Group className="form-group py-2">
                    <Row>
                      <Col>
                        <Button type="submit" className="btn btn-primary w-100">
                          Register
                        </Button>
                      </Col>
                      <Col>
                        <Button type="button" onClick={() => reset()} className="btn btn-warning float-right w-100">
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Body>

              <Card.Footer>
                Already have an account?
                <a href="/auth/signin"> Sign in</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;
