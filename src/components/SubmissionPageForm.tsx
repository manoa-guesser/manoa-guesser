'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { useState } from 'react';

interface SubmissionData {
  image: FileList;
  caption: string;
  location: string; // GPS coordinate string
  submittedBy: string;
}

const SubmissionForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionData>();

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') redirect('/auth/signin');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: SubmissionData) => {
    const formData = new FormData();
    formData.append('image', data.image[0]);
    formData.append('caption', data.caption);
    formData.append('location', data.location);
    formData.append('submittedBy', session?.user?.email || '');

    await fetch('/api/submissions', {
      method: 'POST',
      body: formData,
    });

    swal('Success', 'Your image has been submitted!', 'success', { timer: 2000 });
    reset();
    setPreview(null);
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-3">Submit a Manoa Location</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Image Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    {...register('image', { required: 'Image is required' })}
                    onChange={handleImageChange}
                  />
                  {errors.image && <div className="text-danger small">{errors.image.message}</div>}
                </Form.Group>

                {/* Preview */}
                {preview && (
                  <div className="text-center mb-3">
                    <Image
                      src={preview}
                      alt="Preview"
                      fluid
                      rounded
                      style={{ maxHeight: '250px', objectFit: 'contain' }}
                    />
                  </div>
                )}

                {/* Caption */}
                <Form.Group className="mb-3">
                  <Form.Label>Caption / Description</Form.Label>
                  <Form.Control type="text" placeholder="Optional hint..." {...register('caption')} />
                </Form.Group>

                {/* GPS Coordinates */}
                <Form.Group className="mb-3">
                  <Form.Label>Location (GPS Coordinates)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 21.3008, -157.8175"
                    {...register('location', {
                      required: 'Location is required',
                      pattern: {
                        value: /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/,
                        message: 'Enter valid GPS coordinates (lat, lon)',
                      },
                    })}
                  />
                  {errors.location && <div className="text-danger small">{errors.location.message}</div>}
                </Form.Group>

                <Button type="submit" variant="primary" className="me-2">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    reset();
                    setPreview(null);
                  }}
                >
                  Reset
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmissionForm;
