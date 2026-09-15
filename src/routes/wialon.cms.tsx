import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { WialonGuard } from '@/components/wialon-guard'
import { PLATFORM_URLS, type WialonSession } from '@/lib/wialon-session'
import {
  wialonCmsOverview,
  wialonCreateUnit,
  wialonCreateUser,
  wialonHwTypes,
} from '@/lib/wialon.functions'

export const Route = createFileRoute('/wialon/cms')({
  head: () => ({
    meta: [
      { title: 'Altas de unidades y usuarios (CMS) | ORB-LITE' },
      { name: 'description', content: 'Da de alta unidades GPS y usuarios de la plataforma.' },
      { property: 'og:title', content: 'Altas de unidades y usuarios (CMS) | ORB-LITE' },
      { property: 'og:description', content: 'Da de alta unidades GPS y usuarios de la plataforma.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <WialonGuard>{(session) => <CmsView session={session} />}</WialonGuard>,
})

const inputClass =
  'mt-2 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary'

function CmsView({ session }: { session: WialonSession }) {
  const overviewFn = useServerFn(wialonCmsOverview)
  const hwFn = useServerFn(wialonHwTypes)
  const createUnitFn = useServerFn(wialonCreateUnit)
  const createUserFn = useServerFn(wialonCreateUser)

  const overview = useQuery({
    queryKey: ['wialon-cms', session.sid],
    queryFn: () => overviewFn({ data: { host: session.host, sid: session.sid } }),
  })

  const [hwSearch, setHwSearch] = React.useState('')
  const hwTypes = useQuery({
    queryKey: ['wialon-hw', session.sid, hwSearch],
    queryFn: () => hwFn({ data: { host: session.host, sid: session.sid, search: hwSearch } }),
  })

  const [unitName, setUnitName] = React.useState('')
  const [hwTypeId, setHwTypeId] = React.useState('')
  const [uniqueId, setUniqueId] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [unitMsg, setUnitMsg] = React.useState<string | null>(null)
  const [unitErr, setUnitErr] = React.useState<string | null>(null)
  const [unitBusy, setUnitBusy] = React.useState(false)

  const [userName, setUserName] = React.useState('')
  const [userPass, setUserPass] = React.useState('Abc2026+')
  const [userMsg, setUserMsg] = React.useState<string | null>(null)
  const [userErr, setUserErr] = React.useState<string | null>(null)
  const [userBusy, setUserBusy] = React.useState(false)

  const creatorId = session.userId

  async function onCreateUnit(e: React.FormEvent) {
    e.preventDefault()
    setUnitErr(null)
    setUnitMsg(null)
    setUnitBusy(true)
    try {
      const created = await createUnitFn({
        data: {
          host: session.host,
          sid: session.sid,
          creatorId,
          name: unitName,
          hwTypeId: Number(hwTypeId),
          uniqueId: uniqueId || undefined,
          phone: phone || undefined,
        },
      })
      setUnitMsg(`Unidad creada: ${created.name} (ID ${created.id})`)
      setUnitName('')
      setUniqueId('')
      setPhone('')
      void overview.refetch()
    } catch (err) {
      setUnitErr(err instanceof Error ? err.message : 'No se pudo crear la unidad.')
    } finally {
      setUnitBusy(false)
    }
  }

  async function onCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setUserErr(null)
    setUserMsg(null)
    setUserBusy(true)
    try {
      const created = await createUserFn({
        data: {
          host: session.host,
          sid: session.sid,
          creatorId,
          name: userName,
          password: userPass,
        },
      })
      setUserMsg(`Usuario creado: ${created.name} (ID ${created.id})`)
      setUserName('')
      void overview.refetch()
    } catch (err) {
      setUserErr(err instanceof Error ? err.message : 'No se pudo crear el usuario.')
    } finally {
      setUserBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Cuentas / recursos', value: overview.data?.resources.length ?? 0 },
          { label: 'Usuarios', value: overview.data?.users.length ?? 0 },
          { label: 'Unidades', value: overview.data?.units.length ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border/60 p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {overview.isError ? (
        <p className="text-sm text-destructive">
          {overview.error instanceof Error ? overview.error.message : 'Error al consultar el CMS.'}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onCreateUnit} className="rounded-lg border border-border/60 p-5">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">Nueva unidad</h2>

          <label className="mt-4 block text-sm">
            Nombre en plataforma
            <input className={inputClass} value={unitName} onChange={(e) => setUnitName(e.target.value)} required />
          </label>

          <label className="mt-4 block text-sm">
            Buscar tipo de equipo
            <input
              className={inputClass}
              value={hwSearch}
              onChange={(e) => setHwSearch(e.target.value)}
              placeholder="Ej. Teltonika, Concox, OL-01"
            />
          </label>

          <label className="mt-4 block text-sm">
            Tipo de equipo
            <select className={inputClass} value={hwTypeId} onChange={(e) => setHwTypeId(e.target.value)} required>
              <option value="">Selecciona…</option>
              {(hwTypes.data?.types ?? []).map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm">
            IMEI / ID único
            <input className={inputClass} value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} />
          </label>

          <label className="mt-4 block text-sm">
            Teléfono del SIM (opcional)
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>

          {unitErr ? <p className="mt-4 text-sm text-destructive">{unitErr}</p> : null}
          {unitMsg ? <p className="mt-4 text-sm text-primary">{unitMsg}</p> : null}

          <button
            type="submit"
            disabled={unitBusy}
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60"
          >
            {unitBusy ? 'Creando…' : 'Crear unidad'}
          </button>
        </form>

        <form onSubmit={onCreateUser} className="rounded-lg border border-border/60 p-5">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">Nuevo usuario</h2>

          <label className="mt-4 block text-sm">
            Usuario
            <input
              className={inputClass}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="off"
              required
            />
          </label>

          <label className="mt-4 block text-sm">
            Contraseña provisional
            <input
              className={inputClass}
              value={userPass}
              onChange={(e) => setUserPass(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>

          {userErr ? <p className="mt-4 text-sm text-destructive">{userErr}</p> : null}
          {userMsg ? <p className="mt-4 text-sm text-primary">{userMsg}</p> : null}

          <button
            type="submit"
            disabled={userBusy}
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60"
          >
            {userBusy ? 'Creando…' : 'Crear usuario'}
          </button>

          <p className="mt-4 text-xs text-muted-foreground">
            Gestor oficial:{' '}
            <a className="text-primary" href={PLATFORM_URLS[session.host].cms} target="_blank" rel="noreferrer">
              {PLATFORM_URLS[session.host].cms}
            </a>
          </p>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-card/60 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">ID</th>
            </tr>
          </thead>
          <tbody>
            {(overview.data?.users ?? []).map((user) => (
              <tr key={user.id} className="border-t border-border/50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
