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
  wialonGrantUnits,
  wialonHwTypes,
  wialonPermissions,
} from '@/lib/wialon.functions'

export const Route = createFileRoute('/wialon/cms')({
  head: () => ({
    meta: [
      { title: 'Altas de unidades y usuarios | ORB-LITE' },
      { name: 'description', content: 'Da de alta unidades GPS y usuarios de la plataforma.' },
      { property: 'og:title', content: 'Altas de unidades y usuarios | ORB-LITE' },
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
  const permissionsFn = useServerFn(wialonPermissions)
  const grantFn = useServerFn(wialonGrantUnits)

  const overview = useQuery({
    queryKey: ['wialon-cms', session.sid],
    queryFn: () => overviewFn({ data: { host: session.host, sid: session.sid } }),
  })

  const permissions = useQuery({
    queryKey: ['wialon-permissions', session.sid],
    queryFn: () =>
      permissionsFn({ data: { host: session.host, sid: session.sid, userId: session.userId } }),
  })

  const canCreateUnits = permissions.data?.canCreateUnits ?? false
  const canCreateUsers = permissions.data?.canCreateUsers ?? false

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
  const [level, setLevel] = React.useState<'consulta' | 'completo'>('consulta')
  const [selectedUnits, setSelectedUnits] = React.useState<number[]>([])
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
      setUnitMsg(`Unidad creada en la plataforma: ${created.name} (ID ${created.id})`)
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

      let extra = ''
      if (selectedUnits.length > 0) {
        const granted = await grantFn({
          data: {
            host: session.host,
            sid: session.sid,
            userId: created.id,
            unitIds: selectedUnits,
            level,
          },
        })
        extra = ` · Acceso ${level} a ${granted.granted} unidad(es)`
      }

      setUserMsg(`Usuario creado: ${created.name} (ID ${created.id})${extra}`)
      setUserName('')
      setSelectedUnits([])
      void overview.refetch()
    } catch (err) {
      setUserErr(err instanceof Error ? err.message : 'No se pudo crear el usuario.')
    } finally {
      setUserBusy(false)
    }
  }

  function toggleUnit(id: number) {
    setSelectedUnits((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]))
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

      <div className="rounded-lg border border-border/60 p-4 text-sm">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Tus permisos</p>
        {permissions.isLoading ? (
          <p className="mt-2 text-muted-foreground">Consultando permisos…</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            <span>Alta de unidades: {canCreateUnits ? 'permitida' : 'no autorizada'}</span>
            <span>Alta de usuarios: {canCreateUsers ? 'permitida' : 'no autorizada'}</span>
            {permissions.data?.limits.units != null ? (
              <span>Límite de unidades: {permissions.data.limits.units}</span>
            ) : null}
            {permissions.data?.isAdministrator ? <span>Rol: administrador</span> : null}
            {permissions.data?.plan ? <span>Plan: {permissions.data.plan}</span> : null}
          </div>
        )}
        {!canCreateUnits && !canCreateUsers && !permissions.isLoading ? (
          <p className="mt-2 text-muted-foreground">
            {permissions.data?.isAdministrator
              ? 'Wialon reconoce el rol de administrador, pero la cuenta no tiene activos los servicios necesarios para crear unidades o usuarios.'
              : 'Wialon no reporta habilitado el permiso de crear unidades y usuarios para este usuario.'}
          </p>
        ) : null}
      </div>

      {overview.isError ? (
        <p className="text-sm text-destructive">
          {overview.error instanceof Error ? overview.error.message : 'Error al consultar los datos.'}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onCreateUnit} className="rounded-lg border border-border/60 p-5">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">Nueva unidad</h2>

          <label className="mt-4 block text-sm">
            Nombre en plataforma
            <input
              className={inputClass}
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              disabled={!canCreateUnits}
              required
            />
          </label>

          <label className="mt-4 block text-sm">
            Buscar tipo de equipo
            <input
              className={inputClass}
              value={hwSearch}
              onChange={(e) => setHwSearch(e.target.value)}
              placeholder="Ej. Teltonika, Concox, OL-01"
              disabled={!canCreateUnits}
            />
          </label>

          <label className="mt-4 block text-sm">
            Tipo de equipo
            <select
              className={inputClass}
              value={hwTypeId}
              onChange={(e) => setHwTypeId(e.target.value)}
              disabled={!canCreateUnits}
              required
            >
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
            <input
              className={inputClass}
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              disabled={!canCreateUnits}
            />
          </label>

          <label className="mt-4 block text-sm">
            Teléfono del SIM (opcional)
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!canCreateUnits}
            />
          </label>

          {unitErr ? <p className="mt-4 text-sm text-destructive">{unitErr}</p> : null}
          {unitMsg ? <p className="mt-4 text-sm text-primary">{unitMsg}</p> : null}

          <button
            type="submit"
            disabled={unitBusy || !canCreateUnits}
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
              disabled={!canCreateUsers}
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
              disabled={!canCreateUsers}
              required
            />
          </label>

          <label className="mt-4 block text-sm">
            Nivel de acceso a las unidades
            <select
              className={inputClass}
              value={level}
              onChange={(e) => setLevel(e.target.value as 'consulta' | 'completo')}
              disabled={!canCreateUsers}
            >
              <option value="consulta">Solo consulta (ver y reportes)</option>
              <option value="completo">Administración de la unidad</option>
            </select>
          </label>

          <fieldset className="mt-4 text-sm" disabled={!canCreateUsers}>
            <legend className="text-muted-foreground">Unidades que podrá ver</legend>
            <div className="mt-2 max-h-44 space-y-1 overflow-y-auto rounded-md border border-border/60 p-3">
              {(overview.data?.units ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No hay unidades en la cuenta.</p>
              ) : (
                (overview.data?.units ?? []).map((unit) => (
                  <label key={unit.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedUnits.includes(unit.id)}
                      onChange={() => toggleUnit(unit.id)}
                    />
                    <span>{unit.name}</span>
                  </label>
                ))
              )}
            </div>
          </fieldset>

          {userErr ? <p className="mt-4 text-sm text-destructive">{userErr}</p> : null}
          {userMsg ? <p className="mt-4 text-sm text-primary">{userMsg}</p> : null}

          <button
            type="submit"
            disabled={userBusy || !canCreateUsers}
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
