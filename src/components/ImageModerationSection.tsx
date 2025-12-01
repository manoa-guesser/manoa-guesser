'use client';

import { useState, useTransition } from 'react';
import { Badge, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap';

type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ModerationSubmission = {
  id: number;
  imageUrl: string;
  caption: string;
  submittedBy: string;
  status: SubmissionStatus;
  createdAt: string; // ISO string
};

function getStatusVariant(status: SubmissionStatus): 'warning' | 'success' | 'secondary' {
  if (status === 'PENDING') return 'warning';
  if (status === 'APPROVED') return 'success';
  return 'secondary'; // REJECTED or anything else
}

export default function ImageModerationSection({
  initialSubmissions,
}: {
  initialSubmissions: ModerationSubmission[];
}) {
  const [submissions, setSubmissions] = useState<ModerationSubmission[]>(initialSubmissions);
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<number | null>(null);

  const handleAction = (id: number, action: 'approve' | 'delete') => {
    setBusyId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/submissions/${id}`, {
          method: action === 'delete' ? 'DELETE' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: action === 'delete' ? undefined : JSON.stringify({ status: 'APPROVED' }),
        });

        if (!res.ok) {
          console.error('Failed moderation action');
          return;
        }

        // After approve/delete, remove from local list (we only show pending here)
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } finally {
        setBusyId(null);
      }
    });
  };

  const pendingCount = submissions.filter((s) => s.status === 'PENDING').length;

  return (
    <Row className="mb-5">
      <Col>
        <Card className="shadow-sm rounded-4 admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="fw-bold mb-1 hero-subtitle">Image Moderation</h2>
              <p className="text-muted mb-0">
                Review submitted game images and approve or delete them.
              </p>
            </div>
            <Badge bg={pendingCount > 0 ? 'warning' : 'success'} pill>
              {pendingCount}&nbsp;pending
            </Badge>
          </div>

          {submissions.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">
              There are currently no images to review.
            </p>
          ) : (
            <Table striped bordered hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title / ID</th>
                  <th>Uploader</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
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
                      <div className="text-muted small">ID: {s.id}</div>
                    </td>
                    <td>{s.submittedBy || 'Unknown'}</td>
                    <td>
                      <Badge bg={getStatusVariant(s.status)}>{s.status}</Badge>
                    </td>
                    <td>{new Date(s.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          disabled={isPending || busyId === s.id || s.status !== 'PENDING'}
                          onClick={() => handleAction(s.id, 'approve')}
                        >
                          {busyId === s.id && isPending ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={isPending || busyId === s.id}
                          onClick={() => handleAction(s.id, 'delete')}
                        >
                          {busyId === s.id && isPending ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Col>
    </Row>
  );
}
