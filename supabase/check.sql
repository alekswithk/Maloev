-- Run after schema.sql in the SQL Editor. All test data is rolled back.
begin;
insert into auth.users(id,email) values
  ('ae000000-0000-4000-8000-000000000001','maloev-check-a@example.invalid'),
  ('ae000000-0000-4000-8000-000000000002','maloev-check-b@example.invalid');

set local role anon;
do $$ begin
  begin
    perform * from public.user_data;
    raise exception 'FAIL: anonymous read allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.save_data('{}'::jsonb,0);
    raise exception 'FAIL: anonymous write allowed';
  exception when insufficient_privilege then null; end;
end $$;

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"ae000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$ declare payload jsonb := '{"app":"maloev","schemaVersion":1,"settings":{},"customers":[],"archive":[],"counters":{},"deleted":{}}'::jsonb;
begin
  if public.save_data(payload,0) is distinct from 1 then raise exception 'FAIL: initial save'; end if;
  if public.save_data(payload,0) is not null then raise exception 'FAIL: duplicate initial save'; end if;
  if public.save_data(payload,1) is distinct from 2 then raise exception 'FAIL: revision update'; end if;
  if public.save_data(payload,1) is not null then raise exception 'FAIL: stale revision accepted'; end if;
  if not exists(select 1 from public.user_data where user_id=auth.uid() and revision=2) then raise exception 'FAIL: own data unreadable'; end if;
  begin
    perform public.save_data('{}'::jsonb,2);
    raise exception 'FAIL: invalid payload accepted';
  exception when check_violation then null; end;
  begin
    update public.user_data set revision=100 where user_id=auth.uid();
    raise exception 'FAIL: direct write bypasses version check';
  exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claims','{"sub":"ae000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$ declare payload jsonb := '{"app":"maloev","schemaVersion":1,"settings":{},"customers":[],"archive":[],"counters":{},"deleted":{}}'::jsonb;
begin
  if exists(select 1 from public.user_data) then raise exception 'FAIL: another account is visible'; end if;
  if public.save_data(payload,2) is not null then raise exception 'FAIL: another account was updated'; end if;
  if public.save_data(payload,0) is distinct from 1 then raise exception 'FAIL: second account save'; end if;
  if (select count(*) from public.user_data) <> 1 then raise exception 'FAIL: account isolation'; end if;
end $$;
reset role;
do $$ begin
  if not exists(select 1 from public.user_data where user_id='ae000000-0000-4000-8000-000000000001' and revision=2) then raise exception 'FAIL: first account was changed'; end if;
end $$;
rollback;
select 'PASS: anonymous denial, private reads, private writes, revision conflicts and payload checks' as result;
