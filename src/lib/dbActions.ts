'use server';

import { Stuff, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import type { EditUserFormValues } from '@/lib/validationSchemas';

export type SubmissionFormData = {
  image?: FileList;
  imageUrl: string;
  caption: string;
  location: string;
  submittedBy: string;
};

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: {
  name: string;
  quantity: number;
  owner: string;
  condition: string;
}) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';

  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else if (stuff.condition === 'good') {
    condition = 'good';
  } else {
    condition = 'fair';
  }

  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

export async function addSubmission(submission: SubmissionFormData) {
  await prisma.submission.create({
    data: {
      imageUrl: submission.imageUrl,
      caption: submission.caption,
      location: submission.location,
      submittedBy: submission.submittedBy,
    },
  });

  redirect('/submission');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      // role and score use defaults from the Prisma schema
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Edits an existing user (for admin edit page).
 * Uses the EditUserFormValues type (no password).
 */
export async function editUser(user: EditUserFormValues) {
  // console.log(`editUser data: ${JSON.stringify(user, null, 2)}`);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.email,
      username: user.username ?? null,
      role: user.role,
      score: user.score,
      // password is NOT changed here
    },
  });

  // Change this path to whatever your admin/user list route is
  redirect('/admin'); // or '/admin/users' or similar
}

/**
 * (Optional) Deletes an existing user from the database.
 * Be careful with this in production.
 */
export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });

  // Adjust redirect as needed
  redirect('/admin');
}
