create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('resumen-pendientes-diario')
where exists (select 1 from cron.job where jobname = 'resumen-pendientes-diario');

select cron.schedule(
  'resumen-pendientes-diario',
  '0 0 * * *',
  $$
  select net.http_post(
    url := 'https://project--10f76478-fa8c-4683-b688-ea8db9a49f72.lovable.app/api/public/cron/resumen-pendientes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', '53fe929a9ee005b699c72ae8784cee722181c47285a0d44c'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 20000
  );
  $$
);