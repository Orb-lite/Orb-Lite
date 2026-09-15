import * as React from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  buildDemoUsername,
  crmCreateDemoUser,
  crmDeleteDemoUser,
  crmListDemoUsers,
} from '@/lib/crm.functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEMO_PASSWORD = 'Abc2026+'

const PLATFORM_LABEL: Record<string, string> = {
  wialon_lite: 'Wialon Lite (ORB-LITE)',
  wialon_full: 'Wialon Full (ORB-FULL)',
}

export function UsuariosDemoSection() {
  const queryClient = useQueryClient()
  const list = useServerFn(crmListDemoUsers)
  const create = useServerFn(crmCreateDemoUser)
  const remove = useServerFn(crmDeleteDemoUser)

  const [customerNumber, setCustomerNumber] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [platform, setPlatform] = React.useState<'wialon_lite' | 'wialon_full'>('wialon_lite')
  const [notes, setNotes] = React.useState('')
  const [email, setEmail] = React.useState('')

  const query = useQuery({
    queryKey: ['crm-demo-users'],
    queryFn: () => list(),
  })

  const creation = useMutation({
    mutationFn: () =>
      create({
        data: {
          customerNumber: customerNumber.trim() ? Number(customerNumber) : null,
          fullName,
          company: company.trim() || null,
          platform,
          notes: notes.trim() || null,
          email: email.trim() || null,
        },
      }),
    onSuccess: (res: any) => {
      toast.success(`Usuario demo creado: ${res?.user?.username} · ${DEMO_PASSWORD}`)
      if (res?.emailSent) toast.success(`Folleto de acceso enviado a ${res.emailTo}`)
      else if (res?.emailReason) toast.warning(`Correo no enviado: ${res.emailReason}`)
      else if (!res?.emailTo) toast.info('Sin correo del cliente: no se envió el folleto')
      setCustomerNumber('')
      setFullName('')
      setCompany('')
      setNotes('')
      setEmail('')
      queryClient.invalidateQueries({ queryKey: ['crm-demo-users'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo crear el usuario demo'),
  })

  const deletion = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success('Usuario demo borrado')
      queryClient.invalidateQueries({ queryKey: ['crm-demo-users'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo borrar el usuario demo'),
  })

  const preview = fullName.trim() ? buildDemoUsername(fullName, company || null) : ''
  const rows = query.data?.rows ?? []

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-xl text-foreground">Usuarios demo Wialon</h2>
        <p className="text-sm text-muted-foreground">
          Genera el usuario para crear la cuenta demo en Wialon Lite o Wialon Full. Uno por
          cliente; la contraseña siempre es <span className="font-mono">{DEMO_PASSWORD}</span>.
        </p>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault()
          creation.mutate()
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="demo-nombre">Nombre y apellido del cliente</Label>
            <Input
              id="demo-nombre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-empresa">Empresa o razón social (opcional)</Label>
            <Input
              id="demo-empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Transportes ABC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-cliente">Número de cliente (opcional)</Label>
            <Input
              id="demo-cliente"
              inputMode="numeric"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="500"
            />
          </div>
          <div className="space-y-2">
            <Label>Plataforma solicitada</Label>
            <div className="flex gap-2">
              {(['wialon_lite', 'wialon_full'] as const).map((p) => (
                <Button
                  key={p}
                  type="button"
                  size="sm"
                  variant={platform === p ? 'default' : 'outline'}
                  onClick={() => setPlatform(p)}
                >
                  {PLATFORM_LABEL[p]}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="demo-email">Correo del cliente (para enviar el folleto de acceso)</Label>
            <Input
              id="demo-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@correo.com — si lo dejas vacío se usa el del cliente registrado"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="demo-notas">Notas internas (opcional)</Label>
            <Input
              id="demo-notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Demo por 7 días, 1 unidad"
            />
          </div>
        </div>

        {preview ? (
          <p className="text-sm text-muted-foreground">
            Usuario propuesto: <span className="font-mono text-foreground">{preview}</span> ·
            contraseña <span className="font-mono text-foreground">{DEMO_PASSWORD}</span>
          </p>
        ) : null}

        <Button type="submit" disabled={creation.isPending}>
          {creation.isPending ? 'Generando…' : 'Generar usuario demo'}
        </Button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Usuarios demo generados</h3>
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay usuarios demo.</p>
        ) : (
          rows.map((row: any) => (
            <div
              key={row.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="space-y-1 text-sm">
                <p className="font-mono text-foreground">
                  {row.username} · {row.password}
                </p>
                <p className="text-muted-foreground">
                  {row.full_name}
                  {row.company ? ` · ${row.company}` : ''}
                  {row.customer_number ? ` · Cliente #${row.customer_number}` : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  {PLATFORM_LABEL[row.platform] ?? row.platform}
                  {row.notes ? ` · ${row.notes}` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard?.writeText(`${row.username} / ${row.password}`)
                    toast.success('Usuario copiado')
                  }}
                >
                  Copiar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletion.mutate(row.id)}
                  disabled={deletion.isPending}
                >
                  Borrar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
