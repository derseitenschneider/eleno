
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

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."background_colors" AS ENUM (
    'blue',
    'red',
    'green',
    'yellow'
);

ALTER TYPE "public"."background_colors" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_user"() RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
	--delete from public.profiles where id = auth.uid();
	delete from auth.users where id = auth.uid();
$$;

ALTER FUNCTION "public"."delete_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, new.raw_user_meta_data->>'firstName', new.raw_user_meta_data->>'lastName');
  insert into public.settings (user_id)
  values (new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_user_update_data"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
update public.profiles
set first_name = new.raw_user_meta_data->>'firstName', 
last_name = new.raw_user_meta_data->>'lastName',
email = new.email
where id = new.id;
return new;
end;$$;

ALTER FUNCTION "public"."handle_user_update_data"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."todos" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "text" "text" NOT NULL,
    "due" "date",
    "completed" boolean DEFAULT false,
    "student_id" bigint,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."todos" OWNER TO "postgres";

ALTER TABLE "public"."todos" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Todos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."groups" (
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "groupName" "text" NOT NULL,
    "durationMinutes" smallint,
    "dayOfLesson" "text",
    "startOfLesson" "text",
    "endOfLesson" "text",
    "userId" "uuid" NOT NULL,
    "archive" boolean DEFAULT false NOT NULL,
    "students" "text"[],
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."groups" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "lessonContent" "text",
    "homework" "text",
    "studentId" bigint NOT NULL,
    "date" "date",
    "user_id" "uuid" NOT NULL,
    "homeworkKey" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."lessons" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "firstName" "text",
    "lastName" "text",
    "instrument" "text",
    "durationMinutes" "text",
    "dayOfLesson" "text",
    "startOfLesson" "text",
    "endOfLesson" "text",
    "archive" boolean DEFAULT false,
    "location" "text",
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."students" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."last_3_lessons" WITH ("security_invoker"='true') AS
 WITH "latest_lessons" AS (
         SELECT "lessons"."id",
            "lessons"."created_at",
            "lessons"."lessonContent",
            "lessons"."homework",
            "lessons"."studentId",
            "lessons"."date",
            "lessons"."user_id",
            "lessons"."homeworkKey",
            "students"."archive",
            "row_number"() OVER (PARTITION BY "lessons"."studentId" ORDER BY "lessons"."date" DESC) AS "my_row_number"
           FROM ("public"."lessons"
             JOIN "public"."students" ON (("students"."id" = "lessons"."studentId")))
        )
 SELECT "latest_lessons"."id",
    "latest_lessons"."lessonContent",
    "latest_lessons"."homework",
    "latest_lessons"."studentId",
    "latest_lessons"."date",
    "latest_lessons"."user_id",
    "latest_lessons"."homeworkKey"
   FROM "latest_lessons"
  WHERE (("latest_lessons"."my_row_number" <= 3) AND (NOT "latest_lessons"."archive"))
  ORDER BY "latest_lessons"."studentId", "latest_lessons"."date";

ALTER TABLE "public"."last_3_lessons" OWNER TO "postgres";

ALTER TABLE "public"."lessons" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."lessons_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "studentId" bigint,
    "title" "text",
    "text" "text",
    "user_id" "uuid" NOT NULL,
    "order" smallint DEFAULT '0'::smallint NOT NULL,
    "backgroundColor" "public"."background_colors"
);

ALTER TABLE "public"."notes" OWNER TO "postgres";

ALTER TABLE "public"."notes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."only_active_notes" WITH ("security_invoker"='true') AS
 WITH "active_notes" AS (
         SELECT "notes"."id",
            "notes"."studentId",
            "notes"."user_id",
            "notes"."title",
            "notes"."text",
            "notes"."order",
            "notes"."backgroundColor",
            "students"."archive"
           FROM ("public"."notes"
             JOIN "public"."students" ON (("students"."id" = "notes"."studentId")))
        )
 SELECT "active_notes"."id",
    "active_notes"."studentId",
    "active_notes"."title",
    "active_notes"."text",
    "active_notes"."order",
    "active_notes"."user_id",
    "active_notes"."backgroundColor"
   FROM "active_notes"
  WHERE (NOT "active_notes"."archive")
  ORDER BY "active_notes"."order";

ALTER TABLE "public"."only_active_notes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "email" "text",
    "last_name" "text",
    "lifetime_membership" boolean DEFAULT false NOT NULL,
    "stripe_customer" "text",
    "stripe_subscription" boolean DEFAULT false NOT NULL,
    CONSTRAINT "username_length" CHECK (("char_length"("first_name") >= 3))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

COMMENT ON COLUMN "public"."profiles"."stripe_customer" IS 'Stripe customer id, retrieved via webhook & edge-function';

CREATE TABLE IF NOT EXISTS "public"."repertoire" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "startDate" "date",
    "endDate" "date",
    "studentId" bigint NOT NULL,
    "user_id" "uuid"
);

ALTER TABLE "public"."repertoire" OWNER TO "postgres";

ALTER TABLE "public"."repertoire" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."repertoire_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid"
);

ALTER TABLE "public"."settings" OWNER TO "postgres";

ALTER TABLE "public"."settings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."students" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."students_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "Todos_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_api_key_key" UNIQUE ("homeworkKey");

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_customer_id_key" UNIQUE ("stripe_customer");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."repertoire"
    ADD CONSTRAINT "repertoire_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."repertoire"
    ADD CONSTRAINT "repertoire_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "create_stripe_customer" AFTER INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://brhpqxeowknyhrimssxw.functions.supabase.co/create-customer', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaHBxeGVvd2tueWhyaW1zc3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0MDgwMzUsImV4cCI6MTk5MTk4NDAzNX0.hIvCoJwGTLAZTXVhvYi8OCbbXT_EoUKFMF-j_ik-5Vk"}', '{}', '1000');

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "public_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."repertoire"
    ADD CONSTRAINT "repertoire_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."repertoire"
    ADD CONSTRAINT "repertoire_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."todos"
    ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "UID_only" ON "public"."groups" TO "authenticated" USING (("auth"."uid"() = "userId")) WITH CHECK (("auth"."uid"() = "userId"));

CREATE POLICY "UID_only" ON "public"."lessons" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "UID_only" ON "public"."notes" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "UID_only" ON "public"."profiles" TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "UID_only" ON "public"."repertoire" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "UID_only" ON "public"."settings" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "UID_only" ON "public"."students" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "UID_only" ON "public"."todos" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."notes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."repertoire" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."todos" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_user_update_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_update_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_update_data"() TO "service_role";

GRANT ALL ON TABLE "public"."todos" TO "anon";
GRANT ALL ON TABLE "public"."todos" TO "authenticated";
GRANT ALL ON TABLE "public"."todos" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Todos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Todos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Todos_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";

GRANT ALL ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "service_role";

GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";

GRANT ALL ON TABLE "public"."last_3_lessons" TO "anon";
GRANT ALL ON TABLE "public"."last_3_lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."last_3_lessons" TO "service_role";

GRANT ALL ON SEQUENCE "public"."lessons_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."lessons_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."lessons_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."only_active_notes" TO "anon";
GRANT ALL ON TABLE "public"."only_active_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."only_active_notes" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."repertoire" TO "anon";
GRANT ALL ON TABLE "public"."repertoire" TO "authenticated";
GRANT ALL ON TABLE "public"."repertoire" TO "service_role";

GRANT ALL ON SEQUENCE "public"."repertoire_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."repertoire_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."repertoire_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."settings_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."students_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."students_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."students_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;