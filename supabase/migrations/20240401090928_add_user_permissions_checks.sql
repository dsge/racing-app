
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_table_access_method = "heap";

-- authorize with role-based access control
create or replace function public.is_moderator()
returns boolean as $$
declare
  bind_permissions int;
begin
  select count(*)
  from public.user_permissions
  where user_permissions.is_moderator = true
    and user_permissions.id::uuid = (auth.uid())
  into bind_permissions;

  return bind_permissions > 0;
end;
$$ language plpgsql security definer set search_path = public;

create policy "Allow moderator access to races" on public.races to public using ( public.is_moderator() );
create policy "Allow moderator access to drivers" on public.drivers to public using ( public.is_moderator() );

RESET ALL;
