"use server";
import { faker } from '@faker-js/faker';

export async function getUsers() {
  try {
    const users = [];
    for await (const num of Array(10).keys()) {
      const person = faker.person;
      users.push({
        name: person.fullName(),
        status: Math.floor(Math.random() * 2) % 2 === 0 ? 'confirmed' : 'pending',
        avatar: `https://xsgames.co/randomusers/assets/avatars/${person.sexType()}/${num}.jpg`,
      });
    }
    return { users }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to get users')
    }
  }
}