'use client';

import { useState } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import Image from 'next/image';

interface Submission {
  id: number;
  imageUrl: string;
  caption: string;
  submittedBy: string;
  status: string;
  createdAt: string;
}

interface Props {
  submissions: Submission[];
}

export default function ApprovedSubmissionsTable({ submissions }: Props) {
  const [items, setItems] = useState(submissions);

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        const data = await res.json();
        // eslint-disable-next-line no-alert
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line no-alert
      alert('An error occurred while deleting.');
    }
  };

  if (items.length === 0) {
    return <p className="text-center text-muted">No approved submissions yet.</p>;
  }

  return (
    <Table striped bordered hover responsive className="mb-5">
      <thead>
        <tr>
          <th>Preview</th>
          <th>Caption / ID</th>
          <th>Uploader</th>
          <th>Status</th>
          <th>Uploaded</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((s) => (
          <tr key={s.id}>
            <td>
              <Image
                src={s.imageUrl}
                alt={s.caption || `Submission ${s.id}`}
                width={80}
                height={80}
                style={{
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                }}
              />
            </td>
            <td>
              <div className="fw-semibold">{s.caption || `Submission #${s.id}`}</div>

              {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
              <div className="text-muted small">ID: {s.id}</div>
            </td>

            <td>{s.submittedBy || 'Unknown'}</td>

            <td>
              <Badge bg={s.status === 'APPROVED' ? 'success' : 'secondary'}>
                {s.status}
              </Badge>
            </td>

            <td>{new Date(s.createdAt).toLocaleString()}</td>

            <td>
              <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
