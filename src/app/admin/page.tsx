// app/admin/page.tsx  (or wherever this lives)

import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table, Badge, Button } from 'react-bootstrap';
import StuffItemAdmin from '@/components/StuffItemAdmin';
import prisma from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const stuff = await prisma.stuff.findMany({});
  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container id="list" fluid className="py-3">
        {/* Page header */}
        <Row className="mb-4">
          <Col>
            <h1 className="display-4 fw-bold hero-title">Admin Dashboard</h1>
            <p className="text-muted mb-0">
              Central panel for managing items, users, and (soon) game images.
            </p>
          </Col>
        </Row>

        {/* SECTION 1: Stuff / Game Items */}
        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold hero-subtitle">Game Items (Stuff)</h2>
            <p className="text-muted">
              View and manage all items currently stored in the system.
            </p>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stuff.map((item) => (
                  <StuffItemAdmin key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* SECTION 2: Users & Roles */}
        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold hero-subtitle">User Management</h2>
            <p className="text-muted">
              View all registered users and their roles. Role editing controls can be
              wired up here later.
            </p>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions (Coming Soon)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === 'ADMIN' ? (
                        <Badge bg="primary">Admin</Badge>
                      ) : (
                        <Badge bg="secondary">User</Badge>
                      )}
                    </td>
                    <td>
                      {/* Placeholder buttons for future functionality */}
                      <Button variant="outline-primary" size="sm" disabled>
                        Edit Role
                      </Button>
                      {' '}
                      <Button variant="outline-danger" size="sm" disabled>
                        Disable User
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* SECTION 3: Image Moderation layout only */}
        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold hero-subtitle">Image Moderation</h2>
            <p className="text-muted">
              This section will be used to review and delete game images that are not
              appropriate or do not fit the app. For now, this is just the layout.
            </p>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title / ID</th>
                  <th>Uploader</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                  <th>Reports</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder row until image model & logic are ready */}
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    Image moderation is not set up yet. Once the image model and
                    routes are ready, this table will list pending images with a
                    Delete button for each.
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
