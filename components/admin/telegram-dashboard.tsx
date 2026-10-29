'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Overview = {
  users: number
  activeSessions: number
  sessionsInIntake: number
  abandonedIntakes24h: number
  messages24h: number
  countedAnswers24h: number
  handoffs24h: number
  messagesTodayAddis: number
  handoffsTodayAddis: number
  estimatedEtb24h: number
  timezone: string
}

type SessionRow = {
  id: string
  status: string
  phone: string | null
  handoffReason: string | null
  handoffAt: string | null
  intakeStep?: string | null
  updatedAt: string
  user: {
    telegramUserId: string
    username: string | null
    displayName: string | null
    firstName: string | null
    isBlocked: boolean
  }
  countedAnswersInSession: number
}

type SessionDetail = {
  session: Record<string, unknown> & { intakeStep?: string | null }
  user: Record<string, unknown>
  countedAnswers24h: number
  estimatedEtb: number
  intakeSummary?: string | null
  messages: Array<{
    id: string
    role: string
    kind: string
    text: string | null
    countsTowardLimit: boolean
    createdAt: string
  }>
}

export function TelegramDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<SessionDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadOverview = useCallback(() => {
    fetch('/api/admin/telegram/overview')
      .then(async (r) => {
        if (!r.ok) throw new Error('auth')
        return r.json()
      })
      .then(setOverview)
      .catch(() => setError('Could not load overview'))
  }, [])

  const loadSessions = useCallback((cursor?: string | null) => {
    const q = new URLSearchParams({ limit: '20' })
    if (cursor) q.set('cursor', cursor)
    fetch(`/api/admin/telegram/sessions?${q}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('auth')
        return r.json()
      })
      .then((data) => {
        setSessions((prev) => (cursor ? [...prev, ...data.sessions] : data.sessions))
        setNextCursor(data.nextCursor)
      })
      .catch(() => setError('Could not load sessions'))
  }, [])

  useEffect(() => {
    loadOverview()
    loadSessions()
  }, [loadOverview, loadSessions])

  useEffect(() => {
    if (!selectedId) {
      setDetail(null)
      return
    }
    fetch(`/api/admin/telegram/sessions/${selectedId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(setDetail)
      .catch(() => setDetail(null))
  }, [selectedId])

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Telegram bot</h1>
          <p className="text-sm text-muted-foreground">Analytics & session transcripts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button variant="ghost" onClick={logout}>Sign out</Button>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {overview && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="text-base">Users</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.users}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Active sessions</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.activeSessions}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">In quote wizard</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.sessionsInIntake}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Stale quotes (&gt;24h)</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.abandonedIntakes24h}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">AI answers (24h)</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.countedAnswers24h}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Messages today (Addis)</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.messagesTodayAddis}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Handoffs today (Addis)</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{overview.handoffsTodayAddis}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Est. Addis spend (24h)</CardTitle></CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{overview.estimatedEtb24h}</span>
              <span className="text-sm text-muted-foreground ml-2">ETB (estimate)</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[28rem] overflow-y-auto">
            {sessions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left rounded-lg border p-3 transition hover:bg-muted/50 ${
                  selectedId === s.id ? 'border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">
                    {s.user.displayName || s.user.firstName || s.user.telegramUserId}
                  </span>
                  {s.intakeStep && <Badge variant="outline">In intake</Badge>}
                  {s.handoffAt && <Badge variant="secondary">Handoff</Badge>}
                  {s.user.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.phone || 'no phone'} · {new Date(s.updatedAt).toLocaleString()}
                </p>
              </button>
            ))}
            {nextCursor && (
              <Button variant="outline" className="w-full" onClick={() => loadSessions(nextCursor)}>
                Load more
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session detail</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[28rem] overflow-y-auto space-y-3">
            {!selectedId && (
              <p className="text-sm text-muted-foreground">Select a session to view transcript.</p>
            )}
            {detail && (
              <>
                <p className="text-sm">
                  <span className="text-muted-foreground">24h answers:</span> {detail.countedAnswers24h}/20
                  · <span className="text-muted-foreground">Est.:</span> {detail.estimatedEtb} ETB
                  {detail.session.intakeStep && (
                    <>
                      {' '}
                      · <span className="text-muted-foreground">Intake step:</span>{' '}
                      {String(detail.session.intakeStep)}
                    </>
                  )}
                </p>
                {detail.intakeSummary && (
                  <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {detail.intakeSummary}
                  </pre>
                )}
                {detail.messages.map((m) => (
                  <div key={m.id} className="text-sm border-b pb-2">
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{m.role}</span>
                      <span>{m.kind}</span>
                      {m.countsTowardLimit && <Badge className="text-[10px] px-1">counted</Badge>}
                    </div>
                    <p className="whitespace-pre-wrap break-words">{m.text || '—'}</p>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
