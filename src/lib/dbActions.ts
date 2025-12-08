'use server';

import { Stuff, Condition, Prisma } from '@prisma/client';
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

/** Result type for createUser */
export type CreateUserResult = { ok: true } | { ok: false; field: 'username' | 'email'; message: string };

/**
 * Adds a new stuff to the database.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
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

export async function editStuff(stuff: Stuff) {
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });

  redirect('/list');
}

export async function deleteStuff(id: number) {
  await prisma.stuff.delete({
    where: { id },
  });

  redirect('/list');
}

/**
 * Creates a new user in the database.
 * Returns a structured result instead of throwing for duplicate username/email.
 */
export async function createUser(credentials: {
  email: string;
  password: string;
  username: string;
}): Promise<CreateUserResult> {
  const password = await hash(credentials.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: credentials.email,
        password,
        username: credentials.username,
        // role and score use defaults from the Prisma schema
      },
    });

    return { ok: true };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = err.meta?.target as string[] | string | undefined;

      const includesField = (field: string) => {
        if (!target) return false;
        if (Array.isArray(target)) return target.includes(field);
        return target === field;
      };

      if (includesField('username')) {
        return {
          ok: false,
          field: 'username',
          message: 'This username is already taken.',
        };
      }

      if (includesField('email')) {
        return {
          ok: false,
          field: 'email',
          message: 'This email is already in use.',
        };
      }
    }

    // Unexpected error: still throw so we see it in logs / dev
    throw err;
  }
}

/**
 * Changes the password of an existing user in the database.
 */
export async function changePassword(credentials: { email: string; password: string }) {
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
  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.email,
      username: user.username ?? null,
      role: user.role,
      score: user.score,
    },
  });

  redirect('/admin');
}

/**
 * Deletes an existing user from the database.
 */
export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });

  redirect('/admin');
}
