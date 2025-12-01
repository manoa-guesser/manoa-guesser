import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table, Badge, Button, Card } from 'react-bootstrap';
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

  const adminCount = users.filter((user) => user.role === 'ADMIN').length;

  return (
    <main className="min-vh-100 py-4">
      <Container id="list" fluid className="py-3">
        {/* Page header */}
        <Row className="mb-4">
          <Col>
            <h1 className="display-4 fw-bold hero-title">Admin Dashboard</h1>
          </Col>
        </Row>

        {/* Quick stats row */}
        <Row className="mb-4">
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="shadow-sm rounded-4 p-3">
              <h6 className="text-muted text-uppercase mb-1">Total Items</h6>
              <h3 className="mb-0">{stuff.length}</h3>
            </Card>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="shadow-sm rounded-4 p-3">
              <h6 className="text-muted text-uppercase mb-1">Total Users</h6>
              <h3 className="mb-0">{users.length}</h3>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm rounded-4 p-3">
              <h6 className="text-muted text-uppercase mb-1">Admins</h6>
              <h3 className="mb-0">{adminCount}</h3>
            </Card>
          </Col>
        </Row>

        {/* SECTION 1: Stuff / Game Items */}
        <Row className="mb-5">
          <Col>
            <Card className="shadow-sm rounded-4 admin-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="fw-bold mb-1 hero-subtitle">Game Items (Stuff)</h2>
                  <p className="text-muted mb-0">
                    View and manage all items currently stored in the system.
                  </p>
                </div>
                <Badge bg="success" pill>
                  {stuff.length}
                  &nbsp;
                  items
                </Badge>
              </div>
              <Table striped bordered hover responsive className="mb-0">
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
            </Card>
          </Col>
        </Row>

        {/* SECTION 2: Users & Roles */}
        <Row className="mb-5">
          <Col>
            <Card className="shadow-sm rounded-4 admin-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="fw-bold mb-1 hero-subtitle">User Management</h2>
                  <p className="text-muted mb-0">
                    View all registered users and their roles. Role editing controls
                    can be wired up here later.
                  </p>
                </div>
                <Badge bg="info" pill>
                  {users.length}
                  &nbsp;
                  users
                </Badge>
              </div>
              <Table striped bordered hover responsive className="mb-0">
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
            </Card>
          </Col>
        </Row>

        {/* SECTION 3: Image Moderation layout only */}
        <Row className="mb-5">
          <Col>
            <Card className="shadow-sm rounded-4 admin-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="fw-bold mb-1 hero-subtitle">Image Moderation</h2>
                  <p className="text-muted mb-0">
                    This section will be used to review and delete game images that
                    are not appropriate or do not fit the app. For now, this is just
                    the layout.
                  </p>
                </div>
                <Badge bg="warning" pill>
                  0&nbsp;pending
                </Badge>
              </div>
              <Table striped bordered hover responsive className="mb-0">
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
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Image moderation is not set up yet. Once the image model and
                      routes are ready, this table will list pending images with a
                      Delete button for each.
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
