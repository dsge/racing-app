
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


CREATE TABLE IF NOT EXISTS "public"."user_votes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "race_id" bigint NOT NULL,
    "driver_id" bigint NOT NULL,
    "driver_final_position" int NOT NULL,
    "user_uuid" uuid NOT NULL
);

ALTER TABLE "public"."user_votes" OWNER TO "postgres";

ALTER TABLE "public"."user_votes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_votes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."user_votes"
    ADD CONSTRAINT "user_votes_pkey" PRIMARY KEY ("id");

CREATE INDEX idx_uservotes_useruuid ON "public"."user_votes"(user_uuid);

CREATE POLICY "Enable select for authenticated users only" ON "public"."user_votes" AS PERMISSIVE for SELECT to authenticated using (true);
CREATE POLICY "Enable insert for authenticated users only" ON "public"."user_votes" for insert to authenticated with check (true);
create policy "Enable delete for users based on user_uuid" ON "public"."user_votes" for delete using (auth.uid() = user_uuid);
create policy "Enable update for users based on user_uuid" ON "public"."user_votes" for update using (auth.uid() = user_uuid);

ALTER TABLE "public"."user_votes" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."user_votes" TO "anon";
GRANT ALL ON TABLE "public"."user_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."user_votes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_votes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_votes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_votes_id_seq" TO "service_role";

RESET ALL;