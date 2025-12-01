'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import type { User } from '@prisma/client';
import { EditUserSchema, EditUserFormValues } from '@/lib/validationSchemas';
import { editUser } from '@/lib/dbActions';

const EditUserForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: yupResolver(EditUserSchema),
    defaultValues: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as 'USER' | 'ADMIN',
      score: user.score,
    },
  });

  const onSubmit = async (data: EditUserFormValues) => {
    await editUser(data);
    swal('Success', 'User has been updated', 'success', {
      timer: 2000,
    });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* ID (hidden) */}
                <input type="hidden" {...register('id')} />

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`form-control ${
                      errors.email ? 'is-invalid' : ''
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </Form.Group>

                {/* Username */}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <input
                    type="text"
                    {...register('username')}
                    className={`form-control ${
                      errors.username ? 'is-invalid' : ''
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.username?.message}
                  </div>
                </Form.Group>

                {/* Role */}
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <select
                    {...register('role')}
                    className={`form-control ${
                      errors.role ? 'is-invalid' : ''
                    }`}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <div className="invalid-feedback">
                    {errors.role?.message}
                  </div>
                </Form.Group>

                {/* Score */}
                <Form.Group className="mb-3">
                  <Form.Label>Score</Form.Label>
                  <input
                    type="number"
                    {...register('score', { valueAsNumber: true })}
                    className={`form-control ${
                      errors.score ? 'is-invalid' : ''
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.score?.message}
                  </div>
                </Form.Group>

                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={() => reset()}
                        variant="warning"
                        className="float-right"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUserForm;
