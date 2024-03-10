"use server";


export async function userExists({ email }: { email?: string | null }) {
  try {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/account/exists`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //   },
    //   body: JSON.stringify({ email }),
    // });
    // if (response.ok) {
    //   const data = await response.json();
    //   return data;
    // }
    return { exists: true }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to register account')
    }
  }
}