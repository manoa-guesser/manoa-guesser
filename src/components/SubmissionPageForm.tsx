'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddSubmissionSchema } from '@/lib/validationSchemas';
import { addSubmission, SubmissionFormData } from '@/lib/dbActions';
import supabase from '@/lib/supabaseClient';

const SubmissionMap = dynamic(() => import('./SubmissionMap'), { ssr: false });

const SubmissionForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: yupResolver(AddSubmissionSchema),
  });

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') redirect('/auth/signin');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);

      // IMPORTANT: Set imageUrl for Yup + dbActions
      setValue('imageUrl', imageURL);
    } else {
      setPreview(null);
      setValue('imageUrl', '');
    }
  };

  const onSubmit = async (data: SubmissionFormData) => {
    const file = data.image?.[0];
    if (!file) {
      swal('Error', 'Please upload an image', 'error');
      return;
    }

    // Create a unique filename
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('submissions') // <-- bucket name
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    supabase.auth.getUser().then(console.log);
    console.log('UPLOAD RESULT:', uploadData);
    console.log('UPLOAD ERROR:', uploadError);

    if (uploadError) {
      console.error(uploadError);
      swal('Error', 'Image upload failed', 'error');
      return;
    }

    // Get public URL
    const { data: publicURLData } = supabase.storage.from('submissions').getPublicUrl(fileName);

    const { publicUrl } = publicURLData;

    // Save submission to DB
    await addSubmission({
      imageUrl: publicUrl,
      caption: data.caption,
      location: data.location,
      submittedBy: session?.user?.email || '',
    });

    swal({
      title: 'Success!',
      text: 'Your image has been submitted.',
      icon: 'success',
      buttons: {
        submitAgain: {
          text: 'Submit Another',
          value: 'submitAgain',
          className: 'swal-btn swal-btn-submit',
        },
        playGame: {
          text: 'Play Game',
          value: 'playGame',
          className: 'swal-btn swal-btn-play',
        },
      },
    }).then((value) => {
      if (value === 'submitAgain') {
        reset();
        setPreview(null);
      } else if (value === 'playGame') {
        window.location.href = '/game';
      }
    });
  };

  return (
    <Container className="py-4 min-vh-100">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card className="home-card">
            <Card.Body>
              <h2 className="text-center mb-3 hero-title">Submit a Manoa Location</h2>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Image Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" accept="image/*" {...register('image')} onChange={handleImageChange} />
                  {errors.imageUrl && <div className="text-danger small">{errors.imageUrl.message}</div>}
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
                  <Form.Label>Hint</Form.Label>
                  <Form.Control type="text" placeholder="Hint..." {...register('caption')} />
                </Form.Group>

                {/* GPS Coordinates */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Location on Map</Form.Label>
                  <SubmissionMap setValue={setValue} />
                  {/* Disclaimer */}
                  <div style={{ fontSize: '0.85rem', color: 'gray', marginTop: '8px', opacity: 0.8 }}>
                    Submitted images will only appear in the game after approval by administrators.
                  </div>
                </Form.Group>
                <input type="hidden" {...register('submittedBy')} value={session?.user?.email || ''} />
                <input type="hidden" {...register('imageUrl')} />

                <Button type="submit" variant="primary" className="me-2 green_btn">
                  Submit
                </Button>

                <Button
                  type="button"
                  variant="danger"
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
