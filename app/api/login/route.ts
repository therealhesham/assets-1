import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: "pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91"}).base("appwChimKKH5U0rtH");

export async function POST(request: Request) {
  try {
    const { empid, password } = await request.json();

    if (!empid || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const records = await base('users') 
      .select({
        filterByFormula: `AND({empid} = "${empid}", {Password} = "${password}")`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = {
      id: records[0].id,
      email: records[0].fields.email,
      name: records[0].fields.name || '', 
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}