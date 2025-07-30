'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'

interface Transfer {
  sender_canonical: string
  receiver_canonical: string
  base_amount: string
  base_token_meta: {
    denom: string
    representations: { name: string; symbol: string; decimals: number }[]
  }
  source_universal_chain_id: string
  destination_universal_chain_id: string
}

export default function Home() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await fetch('/api/union', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query GetLatest10UserTransfers {
                v2_transfers(
                  args: {
                    p_limit: 10
                    p_addresses_canonical: ["0xcaa2020596277ddfde8e42f064ebf640f85d895a"]
                  }
                ) {
                  sender_canonical
                  receiver_canonical
                  base_amount
                  base_token_meta {
                    denom
                    representations {
                      name
                      symbol
                      decimals
                    }
                  }
                  source_universal_chain_id
                  destination_universal_chain_id
                }
              }`,
          }),
        })

        if (!res.ok) throw new Error(`GraphQL error: ${res.status}`)

        const json = await res.json()
        console.log('Fetched transfers:', json)

        if (json.errors) {
          throw new Error(json.errors[0]?.message || 'Unknown GraphQL error')
        }

        setTransfers(json.data?.v2_transfers || [])
      } catch (err: any) {
        console.error('Failed to fetch transfers:', err)
        setError(err.message || 'Unknown error')
      }
    }

    fetchTransfers()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Union Testnet: Latest 10 Transfers</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {!transfers.length && !error && <p className="text-gray-500">Loading...</p>}
      {!!transfers.length && (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Chain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((tx, i) => {
                  const rep = tx.base_token_meta.representations[0]
                  const amount = parseFloat(tx.base_amount) / 10 ** rep.decimals
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{tx.sender_canonical.slice(0, 6)}...{tx.sender_canonical.slice(-4)}</TableCell>
                      <TableCell className="text-xs">{tx.receiver_canonical.slice(0, 6)}...{tx.receiver_canonical.slice(-4)}</TableCell>
                      <TableCell>{amount.toFixed(4)}</TableCell>
                      <TableCell>{rep.symbol}</TableCell>
                      <TableCell className="text-xs">{tx.source_universal_chain_id} → {tx.destination_universal_chain_id}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
