import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table, Badge, Button, Card } from 'react-bootstrap';
import prisma from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import Link from 'next/link';
import ImageModerationSection from '@/components/ImageModerationSection';

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

  // Pending submissions for Image Moderation
  const pendingSubmissions = await prisma.submission.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  // Reported images (reportCount > 0)
  const reportedSubmissions = await prisma.submission.findMany({
    where: {
      reportCount: {
        gt: 0,
      },
    },
    orderBy: [
      { reportCount: 'desc' },
      { createdAt: 'desc' },
    ],
  });

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

        {/* SECTION 1: Users – Players & Scores */}
        <Row className="mb-5">
          <Col>
            <Card className="shadow-sm rounded-4 admin-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="fw-bold mb-1 hero-subtitle">Players Information</h2>
                  <p className="text-muted mb-0">
                    View all users along with their usernames, roles, and current scores.
                  </p>
                </div>
                <Badge bg="success" pill>
                  {users.length}
                  &nbsp;players
                </Badge>
              </div>
              <Table striped bordered hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.username ?? '-'}</td>
                      <td>{user.role}</td>
                      <td>{user.score}</td>
                      <td>
                        <Link href={`/edit/${user.id}`}>
                          <Button variant="outline-primary" size="sm">
                            Edit User
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        {/* SECTION 2: Image Moderation (pending images only) */}
        <ImageModerationSection
          initialSubmissions={pendingSubmissions.map((s) => ({
            id: s.id,
            imageUrl: s.imageUrl,
            caption: s.caption,
            submittedBy: s.submittedBy,
            status: s.status,
            createdAt: s.createdAt.toISOString(),
          }))}
        />

        {/* SECTION 3: Reported Images */}
        <Row className="mb-5">
          <Col>
            <Card className="shadow-sm rounded-4 admin-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="fw-bold mb-1 hero-subtitle">Reported Images</h2>
                  <p className="text-muted mb-0">
                    Images that have been reported by players. Use this section to review
                    frequently reported content.
                  </p>
                </div>
                <Badge bg={reportedSubmissions.length > 0 ? 'danger' : 'secondary'} pill>
                  {reportedSubmissions.length}
                  &nbsp;reported
                </Badge>
              </div>

              {reportedSubmissions.length === 0 ? (
                <p className="text-center text-muted py-4 mb-0">
                  There are currently no reported images.
                </p>
              ) : (
                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Preview</th>
                      <th>Title / ID</th>
                      <th>Submitted By</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedSubmissions.map((s) => (
                      <tr key={s.id}>
                        <td>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.imageUrl}
                            alt={s.caption || `Submission ${s.id}`}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '0.75rem',
                            }}
                          />
                        </td>
                        <td>
                          <div className="fw-semibold">
                            {s.caption || `Submission #${s.id}`}
                          </div>
                          <div className="text-muted small">
                            ID:
                            {s.id}
                          </div>
                        </td>
                        <td>{s.submittedBy || 'Unknown'}</td>
                        <td>{s.status}</td>
                        <td>{s.createdAt.toLocaleString()}</td>
                        <td>{s.reportCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
