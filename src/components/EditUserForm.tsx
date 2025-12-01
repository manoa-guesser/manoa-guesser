'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@prisma/client';
import { EditUserSchema } from '@/lib/validationSchemas';
import { editUser } from '@/lib/dbActions';

type EditUserFormValues = {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
  score: number;
  username?: string | null;
};

const onSubmit = async (data: User) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await editUser(data);
  swal('Success', 'User has been updated', 'success', {
    timer: 2000,
  });
};

const EditUserForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(EditUserSchema),
  });

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
                <input type="hidden" {...register('id')} value={user.id} />

                {/* Email (usually primary identifier – you can disable if you don't want it editable) */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <input
                    type="email"
                    {...register('email')}
                    defaultValue={user.email}
                    required
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>

                {/* Username (optional field in your schema) */}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <input
                    type="text"
                    {...register('username')}
                    defaultValue={user.username ?? ''}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.username?.message}</div>
                </Form.Group>

                {/* Role (enum: USER / ADMIN) */}
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <select
                    {...register('role')}
                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                    defaultValue={user.role}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <div className="invalid-feedback">{errors.role?.message}</div>
                </Form.Group>

                {/* Score */}
                <Form.Group className="mb-3">
                  <Form.Label>Score</Form.Label>
                  <input
                    type="number"
                    {...register('score')}
                    defaultValue={user.score}
                    className={`form-control ${errors.score ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.score?.message}</div>
                </Form.Group>

                {/* Password – you can leave this out or make a separate change-password flow.
                    If you *do* include it here, make sure your schema & backend handle hashing. */}

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
                        onClick={() => reset(user)}
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
