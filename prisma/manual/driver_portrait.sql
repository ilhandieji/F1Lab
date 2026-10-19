-- Companion table for public driver portraits.
-- Keyed by the existing F1DB driver.id and a season key ("2026" or "default").
-- Does not alter imported F1DB tables.
-- Does not rewrite object_key. An existing key such as
-- drivers/max-verstappen/portrait.webp stays as stored and becomes the default portrait.
-- Review this script before applying it. It is not run by the application.
-- Apply it locally and on the VPS before deploying code that reads driver_portrait.

CREATE TABLE IF NOT EXISTS driver_portrait (
  driver_id varchar(100) NOT NULL,
  season_key varchar(16) NOT NULL,
  object_key varchar(512) NOT NULL,
  CONSTRAINT driver_portrait_pkey PRIMARY KEY (driver_id, season_key),
  CONSTRAINT driver_portrait_driver_id_fkey
    FOREIGN KEY (driver_id) REFERENCES driver (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT driver_portrait_season_key_check
    CHECK (season_key = 'default' OR season_key ~ '^[0-9]{4}$')
);

-- Upgrade the original one-row-per-driver table (driver_id primary key, no season_key).
-- Existing object_key values are not modified.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'driver_portrait'
      AND column_name = 'season_key'
  ) THEN
    ALTER TABLE driver_portrait
      ADD COLUMN season_key varchar(16);
  END IF;

  UPDATE driver_portrait
  SET season_key = 'default'
  WHERE season_key IS NULL;

  ALTER TABLE driver_portrait
    ALTER COLUMN season_key SET NOT NULL;

  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'driver_portrait'
      AND constraint_name = 'driver_portrait_pkey'
      AND constraint_type = 'PRIMARY KEY'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.key_column_usage
    WHERE table_schema = 'public'
      AND table_name = 'driver_portrait'
      AND constraint_name = 'driver_portrait_pkey'
      AND column_name = 'season_key'
  ) THEN
    ALTER TABLE driver_portrait DROP CONSTRAINT driver_portrait_pkey;
    ALTER TABLE driver_portrait
      ADD CONSTRAINT driver_portrait_pkey PRIMARY KEY (driver_id, season_key);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'driver_portrait'
      AND constraint_name = 'driver_portrait_season_key_check'
  ) THEN
    ALTER TABLE driver_portrait
      ADD CONSTRAINT driver_portrait_season_key_check
      CHECK (season_key = 'default' OR season_key ~ '^[0-9]{4}$');
  END IF;
END $$;
