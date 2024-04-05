-- creates 10 test users:
--   user1@example.com //// password123
--   user2@example.com //// password123
--   ...
--   user10@example.com //// password123
INSERT INTO
    auth.users (
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
        select
            '00000000-0000-0000-0000-000000000000',
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
        FROM
            generate_series(1, 10)
    );

-- allows the above test users to login with email+password
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

-- set user2@example.com as moderator
update public.user_profiles set is_moderator = true where id = (select id from auth.users where email = 'user2@example.com' );

insert into
  public.drivers ( full_name, freetext_notes, year_of_racing ) (
    select
      'Sample Driver ' || (ROW_NUMBER() OVER ()),
      'sample text',
      2023
    FROM generate_series(1, 15)
  );

insert into
  public.drivers ( full_name, freetext_notes, year_of_racing ) (
    select
      'Drunk Driver ' || (ROW_NUMBER() OVER ()),
      'sample text',
      2024
    FROM generate_series(1, 13)
  );


insert into
  public.races ( race_name, drivers_from_year, race_start_date, race_end_date, voting_end_time ) (
    select
      'Sample Race ' || (ROW_NUMBER() OVER ()),
      2024,
      now()::date + trunc(random() * 30 * 3)::int, -- +- 3 months
      now()::date + trunc(random() * 30 * 3)::int, -- +- 3 months
      NOW() + (random() * (interval '180 days')) - INTERVAL '90 days'  -- +- 3 months
    FROM generate_series(1, 15)
  );
select * from public.races;
