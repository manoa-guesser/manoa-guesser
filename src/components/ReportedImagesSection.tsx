'use client';

import { useState } from 'react';
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';
import swal from 'sweetalert';

type ReportedSubmission = {
  id: number;
  imageUrl: string;
  caption: string | null;
  submittedBy: string;
  reporters: string[];
  reportCount: number;
};

interface Props {
  initialSubmissions: ReportedSubmission[];
}

const ReportedImagesSection: React.FC<Props> = ({ initialSubmissions }) => {
  const [submissions, setSubmissions] = useState<ReportedSubmission[]>(initialSubmissions);

  const handleDelete = async (id: number) => {
    const confirmed = await swal({
      title: 'Delete image?',
      text: 'This will permanently remove the image from the game.',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      setSubmissions((prev) => prev.filter((s) => s.id !== id));

      swal('Deleted', 'The image has been removed.', 'success');
    } catch (err) {
      console.error(err);
      swal('Error', 'Could not delete the image.', 'error');
    }
  };

  const handleClearReports = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearReports' }),
      });

      if (!res.ok) {
        throw new Error('Failed to clear reports');
      }

      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, reportCount: 0, reporters: [] } : s)));

      swal('Reports cleared', 'Reports for this image have been cleared.', 'success');
    } catch (err) {
      console.error(err);
      swal('Error', 'Could not clear reports.', 'error');
    }
  };

  return (
    <Row className="mb-5">
      <Col>
        <Card className="shadow-sm rounded-4 admin-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="fw-bold mb-1 hero-subtitle">Reported Images</h2>
              <p className="text-muted mb-0">
                Images flagged by players. Delete bad images or clear reports if they&apos;re fine.
              </p>
            </div>

            <Badge bg={submissions.length > 0 ? 'danger' : 'secondary'} pill>
              {submissions.length}
              &nbsp;reported
            </Badge>
          </div>

          {submissions.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">No reported images.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Caption / ID</th>
                  <th>Submitted By</th>
                  <th>Reported By</th>
                  <th>Reports</th>
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
                      <div className="fw-semibold">{s.caption || `Submission #${s.id}`}</div>
                      <div className="text-muted small">
                        ID:
                        {s.id}
                      </div>
                    </td>
                    <td>{s.submittedBy}</td>
                    <td>{s.reporters && s.reporters.length > 0 ? s.reporters.join(', ') : '—'}</td>
                    <td>{s.reportCount}</td>
                    <td className="d-flex gap-2">
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(s.id)}>
                        Delete
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={() => handleClearReports(s.id)}>
                        Clear Reports
                      </Button>
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
};

export default ReportedImagesSection;
