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
    },
  });

  const onSubmit = async (data: EditUserFormValues) => {
    await editUser(data);
    swal('Success', 'User has been updated', 'success', {
      timer: 2000,
    });
  };

  return (
    <Container className="py-4 min-vh-100">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="home-card">
            <Card.Body>
              <h2 className="text-center mb-3 hero-title">Edit User</h2>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* ID (hidden) */}
                <input type="hidden" {...register('id')} />

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
                  {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
                </Form.Group>

                {/* Username */}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" {...register('username')} isInvalid={!!errors.username} />
                  {errors.username && (
                    <Form.Control.Feedback type="invalid">{errors.username.message}</Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Role */}
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select {...register('role')} isInvalid={!!errors.role}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                  {errors.role && <Form.Control.Feedback type="invalid">{errors.role.message}</Form.Control.Feedback>}
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex justify-content-between pt-2">
                  <Button type="submit" variant="primary" className="green_btn">
                    Submit
                  </Button>
                  <Button type="button" variant="danger" onClick={() => reset()}>
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUserForm;
