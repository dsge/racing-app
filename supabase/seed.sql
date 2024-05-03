--------------------------------------------
-- Creates 10 test users:
--   user1@example.com //// password123
--   user2@example.com //// password123
--   ...
--   user10@example.com //// password123
--------------------------------------------
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) (
    select '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4 (),
      'authenticated',
      'authenticated',
      'user' || (ROW_NUMBER() OVER ()) || '@example.com',
      crypt ('password123', gen_salt ('bf')),
      current_timestamp,
      current_timestamp,
      current_timestamp,
      '{"provider":"email","providers":["email"]}',
      '{}',
      current_timestamp,
      current_timestamp,
      '',
      '',
      '',
      ''
    FROM generate_series(1, 10)
  );
-- allows the above test users to login with email+password
INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) (
    select uuid_generate_v4 (),
      id,
      id,
      format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    from auth.users
  );
--
----------------------------------------
-- set user2@example.com as moderator --
----------------------------------------
update public.user_profiles
set is_moderator = true
where id = (
    select id
    from auth.users
    where email = 'user2@example.com'
  );
--
-----------------------------
-- Random Drivers for 2023 --
-----------------------------
insert into public.drivers (full_name, freetext_notes, year_of_racing) (
    select 'Sample Driver ' || (ROW_NUMBER() OVER ()),
      'sample text',
      2023
    FROM generate_series(1, 15)
  );
-----------------------------
-- Random Drivers for 2024 --
-----------------------------
insert into public.drivers (full_name, freetext_notes, year_of_racing) (
    select 'Drunk Driver ' || (ROW_NUMBER() OVER ()),
      'sample text',
      2024
    FROM generate_series(1, 13)
  );
--
------------------------------------------------------------------------------
-- Random Sample Races with random dates ( sometimes they don't make sense) --
------------------------------------------------------------------------------
insert into public.races (
    race_name,
    drivers_from_year,
    race_start_date,
    race_end_date,
    voting_end_time
  ) (
    select 'Sample Race ' || (ROW_NUMBER() OVER ()),
      2024,
      now()::date + trunc(random() * 30 * 3)::int,
      -- +- 3 months
      now()::date + trunc(random() * 30 * 3)::int,
      -- +- 3 months
      NOW() + (random() * (interval '180 days')) - INTERVAL '90 days' -- +- 3 months
    FROM generate_series(1, 15)
  );
-------------------------------------------------------
-- Create some races that already have votes on them --
-------------------------------------------------------
CREATE OR REPLACE FUNCTION seed_vote_to_last_race_in_table(
    driver_offset integer,
    driver_final_pos int4,
    user_offset integer,
    is_fastest_lap_vote boolean,
    is_final_result boolean default false
  ) RETURNS VOID AS $$ BEGIN
INSERT INTO public.user_votes (
    race_id,
    driver_id,
    driver_final_position,
    user_uuid,
    is_fastest_lap_vote,
    is_final_result
  )
values (
    (
      select id
      from public.races
      ORDER BY id desc
      limit 1
    ), (
      SELECT id
      FROM public.drivers
      where year_of_racing = 2024
      limit 1 offset driver_offset
    ),
    driver_final_pos::int4,
    (
      SELECT id
      FROM public.user_profiles
      limit 1 offset user_offset
    ),
    is_fastest_lap_vote::boolean,
    is_final_result::boolean
  );
END;
$$ LANGUAGE 'plpgsql';
--
-------------------------------------------
INSERT INTO public.races (
    race_name,
    drivers_from_year,
    race_start_date,
    race_end_date,
    voting_end_time
  )
VALUES (
    'Lorem Ipsum Recent Race With Votes but No Final Results',
    2024,
    now()::date + trunc(-16)::int,
    -- -16 days
    now()::date + trunc(-15)::int,
    -- -15 days
    NOW() - INTERVAL '14 days' -- -14 days
  );
do $$ begin --
-- driver_offset, driver_final_pos, user_offset, is_fastest_lap_vote, is_final_vote
-- user offset 0 voting
perform seed_vote_to_last_race_in_table(3, 1, 0, FALSE);
perform seed_vote_to_last_race_in_table(2, 2, 0, FALSE);
perform seed_vote_to_last_race_in_table(1, 3, 0, FALSE);
perform seed_vote_to_last_race_in_table(0, 4, 0, FALSE);
perform seed_vote_to_last_race_in_table(4, 5, 0, FALSE);
perform seed_vote_to_last_race_in_table(5, 6, 0, FALSE);
perform seed_vote_to_last_race_in_table(6, 7, 0, FALSE);
perform seed_vote_to_last_race_in_table(7, 8, 0, FALSE);
perform seed_vote_to_last_race_in_table(8, 9, 0, FALSE);
perform seed_vote_to_last_race_in_table(9, 10, 0, FALSE);
perform seed_vote_to_last_race_in_table(8, 10, 0, TRUE);
-- user offset 3 voting
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 3, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 3, FALSE);
perform seed_vote_to_last_race_in_table(1, 9, 3, FALSE);
perform seed_vote_to_last_race_in_table(0, 10, 3, FALSE);
perform seed_vote_to_last_race_in_table(0, 10, 3, TRUE);
return;
end $$;
-----
-------------------------------------------
INSERT INTO public.races (
    race_name,
    drivers_from_year,
    race_start_date,
    race_end_date,
    voting_end_time
  )
VALUES (
    'Lorem Ipsum Recent Race With Votes And Final Results',
    2024,
    now()::date + trunc(-10)::int,
    -- -10 days
    now()::date + trunc(-9)::int,
    -- -9 days
    NOW() - INTERVAL '8 days' -- -8 days
  );
do $$ begin --
-- driver_offset, driver_final_pos, user_offset, is_fastest_lap_vote, is_final_vote
-- user offset 0 voting
perform seed_vote_to_last_race_in_table(3, 1, 0, FALSE);
perform seed_vote_to_last_race_in_table(2, 2, 0, FALSE);
perform seed_vote_to_last_race_in_table(1, 3, 0, FALSE);
perform seed_vote_to_last_race_in_table(0, 4, 0, FALSE);
perform seed_vote_to_last_race_in_table(4, 5, 0, FALSE);
perform seed_vote_to_last_race_in_table(5, 6, 0, FALSE);
perform seed_vote_to_last_race_in_table(6, 7, 0, FALSE);
perform seed_vote_to_last_race_in_table(7, 8, 0, FALSE);
perform seed_vote_to_last_race_in_table(8, 9, 0, FALSE);
perform seed_vote_to_last_race_in_table(9, 10, 0, FALSE);
perform seed_vote_to_last_race_in_table(8, 10, 0, TRUE);
-- user offset 3 voting
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 3, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 3, FALSE);
perform seed_vote_to_last_race_in_table(1, 9, 3, FALSE);
perform seed_vote_to_last_race_in_table(0, 10, 3, FALSE);
perform seed_vote_to_last_race_in_table(0, 10, 3, TRUE);
-- Adding final results
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(0, 7, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(1, 8, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(2, 9, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(3, 10, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(0, 10, 3, TRUE, TRUE);
return;
end $$;
-------------------------------------------
INSERT INTO public.races (
    race_name,
    drivers_from_year,
    race_start_date,
    race_end_date,
    voting_end_time,
    is_sprint_race
  )
VALUES (
    'Recent Race SPRINT With Votes but No Final Results',
    2024,
    now()::date + trunc(-16)::int,
    -- -16 days
    now()::date + trunc(-15)::int,
    -- -15 days
    NOW() - INTERVAL '14 days',
    -- -14 days
    TRUE
  );
do $$ begin --
-- driver_offset, driver_final_pos, user_offset, is_fastest_lap_vote, is_final_vote
-- user offset 0 voting
perform seed_vote_to_last_race_in_table(3, 1, 0, FALSE);
perform seed_vote_to_last_race_in_table(2, 2, 0, FALSE);
perform seed_vote_to_last_race_in_table(1, 3, 0, FALSE);
perform seed_vote_to_last_race_in_table(0, 4, 0, FALSE);
perform seed_vote_to_last_race_in_table(4, 5, 0, FALSE);
perform seed_vote_to_last_race_in_table(5, 6, 0, FALSE);
perform seed_vote_to_last_race_in_table(6, 7, 0, FALSE);
perform seed_vote_to_last_race_in_table(7, 8, 0, FALSE);
-- user offset 3 voting
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 3, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 3, FALSE);
return;
end $$;
-----
-------------------------------------------
INSERT INTO public.races (
    race_name,
    drivers_from_year,
    race_start_date,
    race_end_date,
    voting_end_time,
    is_sprint_race
  )
VALUES (
    'Recent SPRINT Race With Votes And Final Results',
    2024,
    now()::date + trunc(-10)::int,
    -- -10 days
    now()::date + trunc(-9)::int,
    -- -9 days
    NOW() - INTERVAL '8 days',
    -- -8 days
    TRUE
  );
do $$ begin --
-- driver_offset, driver_final_pos, user_offset, is_fastest_lap_vote, is_final_vote
-- user offset 0 voting
perform seed_vote_to_last_race_in_table(3, 1, 0, FALSE);
perform seed_vote_to_last_race_in_table(2, 2, 0, FALSE);
perform seed_vote_to_last_race_in_table(1, 3, 0, FALSE);
perform seed_vote_to_last_race_in_table(0, 4, 0, FALSE);
perform seed_vote_to_last_race_in_table(4, 5, 0, FALSE);
perform seed_vote_to_last_race_in_table(5, 6, 0, FALSE);
perform seed_vote_to_last_race_in_table(6, 7, 0, FALSE);
perform seed_vote_to_last_race_in_table(7, 8, 0, FALSE);
-- user offset 3 voting
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 3, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 3, FALSE);
-- user offset 9 voting
perform seed_vote_to_last_race_in_table(8, 1, 9, FALSE);
perform seed_vote_to_last_race_in_table(9, 2, 9, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 9, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 9, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 9, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 9, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 9, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 9, FALSE);
-- Adding final results
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(0, 7, 3, FALSE, TRUE);
perform seed_vote_to_last_race_in_table(1, 8, 3, FALSE, TRUE);
return;
end $$;
-------------------------------------------
INSERT INTO public.races (
    race_name,
    drivers_from_year,
    voting_end_time,
    race_start_date,
    race_end_date,
    is_sprint_race
  )
VALUES (
    'Upcoming SPRINT With Votes',
    2024,
    NOW() + INTERVAL '2 days',
    -- +2 days
    now()::date + trunc(+ 3)::int,
    -- +3 days
    now()::date + trunc(+ 10)::int,
    -- +7 days
    TRUE
  );
do $$ begin --
-- driver_offset, driver_final_pos, user_offset, is_fastest_lap_vote, is_final_vote
-- user offset 0 voting
perform seed_vote_to_last_race_in_table(3, 1, 0, FALSE);
perform seed_vote_to_last_race_in_table(2, 2, 0, FALSE);
perform seed_vote_to_last_race_in_table(1, 3, 0, FALSE);
perform seed_vote_to_last_race_in_table(0, 4, 0, FALSE);
perform seed_vote_to_last_race_in_table(4, 5, 0, FALSE);
perform seed_vote_to_last_race_in_table(5, 6, 0, FALSE);
perform seed_vote_to_last_race_in_table(6, 7, 0, FALSE);
perform seed_vote_to_last_race_in_table(7, 8, 0, FALSE);
-- user offset 3 voting
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 3, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 3, FALSE);
-- user offset 9 voting
perform seed_vote_to_last_race_in_table(8, 1, 9, FALSE);
perform seed_vote_to_last_race_in_table(9, 2, 9, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 9, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 9, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 9, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 9, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 9, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 9, FALSE);
return;
end $$;
------------------------------------------------
INSERT INTO public.races (
    race_name,
    drivers_from_year,
    voting_end_time,
    race_start_date,
    race_end_date,
    is_sprint_race
  )
VALUES (
    'Ongoing Race With Votes',
    2024,
    NOW() - INTERVAL '1 days',
    -- -1 days
    now()::date + trunc(-1)::int,
    -- -1 days
    now()::date + trunc(+ 7)::int,
    -- +7 days
    FALSE
  );
do $$ begin --
-- driver_offset, driver_final_pos, user_offset, is_fastest_lap_vote, is_final_vote
-- user offset 0 voting
perform seed_vote_to_last_race_in_table(3, 1, 0, FALSE);
perform seed_vote_to_last_race_in_table(2, 2, 0, FALSE);
perform seed_vote_to_last_race_in_table(1, 3, 0, FALSE);
perform seed_vote_to_last_race_in_table(0, 4, 0, FALSE);
perform seed_vote_to_last_race_in_table(4, 5, 0, FALSE);
perform seed_vote_to_last_race_in_table(5, 6, 0, FALSE);
perform seed_vote_to_last_race_in_table(6, 7, 0, FALSE);
perform seed_vote_to_last_race_in_table(7, 8, 0, FALSE);
perform seed_vote_to_last_race_in_table(8, 9, 0, FALSE);
perform seed_vote_to_last_race_in_table(9, 10, 0, FALSE);
perform seed_vote_to_last_race_in_table(8, 10, 0, TRUE);
-- user offset 3 voting
perform seed_vote_to_last_race_in_table(9, 1, 3, FALSE);
perform seed_vote_to_last_race_in_table(8, 2, 3, FALSE);
perform seed_vote_to_last_race_in_table(7, 3, 3, FALSE);
perform seed_vote_to_last_race_in_table(6, 4, 3, FALSE);
perform seed_vote_to_last_race_in_table(5, 5, 3, FALSE);
perform seed_vote_to_last_race_in_table(4, 6, 3, FALSE);
perform seed_vote_to_last_race_in_table(3, 7, 3, FALSE);
perform seed_vote_to_last_race_in_table(2, 8, 3, FALSE);
perform seed_vote_to_last_race_in_table(1, 9, 3, FALSE);
perform seed_vote_to_last_race_in_table(0, 10, 3, FALSE);
perform seed_vote_to_last_race_in_table(0, 10, 3, TRUE);
return;
end $$;
-----