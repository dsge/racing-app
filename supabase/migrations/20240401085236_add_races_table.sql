
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


CREATE TABLE IF NOT EXISTS "public"."races" (
    "id" bigint NOT NULL,
    "race_name" character varying DEFAULT ''::character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "drivers_from_year" integer
);

ALTER TABLE "public"."races" OWNER TO "postgres";

ALTER TABLE "public"."races" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."races_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "races_pkey" PRIMARY KEY ("id");

CREATE POLICY "Enable select for authenticated users only" ON "public"."races" AS PERMISSIVE for SELECT to authenticated using (true);

ALTER TABLE "public"."races" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."races" TO "anon";
GRANT ALL ON TABLE "public"."races" TO "authenticated";
GRANT ALL ON TABLE "public"."races" TO "service_role";

GRANT ALL ON SEQUENCE "public"."races_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."races_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."races_id_seq" TO "service_role";

RESET ALL;
