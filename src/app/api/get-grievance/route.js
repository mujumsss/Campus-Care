import db from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const grievanceId = searchParams.get('id');

  if (!grievanceId) {
    return new Response(JSON.stringify({ error: 'Missing grievance ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const grievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(grievanceId);

  if (!grievance) {
    return new Response(JSON.stringify({ error: 'Grievance not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(grievance), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}


// import db from "@/lib/db";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const grievanceId = searchParams.get('id');

//   if (!grievanceId) {
//     return new Response('Missing grievance ID', { status: 400 });
//   }

//   const grievance = db.prepare('SELECT * FROM grievances WHERE id = ?').get(grievanceId);

//   if (!grievance) {
//     return new Response('Grievance not found', { status: 404 });
//   }

//   return new Response(JSON.stringify(grievance), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
// }