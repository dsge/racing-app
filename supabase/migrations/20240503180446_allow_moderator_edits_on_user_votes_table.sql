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
drop policy "Enable delete for users based on user_uuid" ON "public"."user_votes";
create policy "Enable delete for users based on user_uuid" ON "public"."user_votes" for delete using (
  auth.uid() = user_uuid
  or public.is_moderator()
);
drop policy "Enable update for users based on user_uuid" ON "public"."user_votes";
create policy "Enable update for users based on user_uuid" ON "public"."user_votes" for
update using (
    auth.uid() = user_uuid
    or public.is_moderator()
  );
RESET ALL;