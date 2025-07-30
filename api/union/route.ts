// app/api/union/route.ts

export const runtime = 'edge'

export async function POST(req: Request) {
  const { query, variables } = await req.json()

  const response = await fetch('https://api.union.build/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: response.status,
  })
}
