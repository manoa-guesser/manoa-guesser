import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

// For creating a user (e.g. admin panel or signup form)
export const AddUserSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  username: Yup.string().nullable(),
  role: Yup.mixed<'USER' | 'ADMIN'>()
    .oneOf(['USER', 'ADMIN'], 'Invalid role')
    .required('Role is required'),
  score: Yup.number().integer('Score must be an integer').min(0, 'Score cannot be negative').default(0),
});

// For editing a user in the admin edit page (no password here)
export const EditUserSchema = Yup.object({
  id: Yup.number().required('ID is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().nullable(),
  role: Yup.mixed<'USER' | 'ADMIN'>()
    .oneOf(['USER', 'ADMIN'], 'Invalid role')
    .required('Role is required'),
  score: Yup.number().integer('Score must be an integer')
    .min(0, 'Score cannot be negative').required('Score is required'),
});
