
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

create table IF NOT EXISTS public.user_profiles (
  id uuid not null references auth.users on delete cascade,
  display_name text,
  "is_moderator" boolean DEFAULT FALSE,
  primary key (id)
);

alter table public.user_profiles enable row level security;

ALTER TABLE "public"."user_profiles" OWNER TO "postgres";

CREATE POLICY "Enable select for authenticated users only" ON "public"."user_profiles" AS PERMISSIVE for SELECT to authenticated using (true);

ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


-- inserts a row into public.user_profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, 'Unnamed User');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


RESET ALL;
