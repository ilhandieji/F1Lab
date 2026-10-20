# F1Lab

A F1 data playground for nerd people and those who want to know abount the details of sport.

## This project is powered by

[F1DB Project](https://github.com/f1db/f1db) using the psql .sql file for dataset

## For Deployment

```
git checkout server
git pull origin server
git merge main
git push origin server
```

Run this commands to deploy the App to VPS

## Driver portraits

Public portraits are files in object storage, one object per season plus an optional default. Folder names are the F1DB `driver.id`, not a display name. The site stores those object keys in `driver_portrait` and does not upload files or use storage credentials.

```text
drivers/max-verstappen/2026/portrait.webp
drivers/max-verstappen/2018/portrait.webp
drivers/max-verstappen/default/portrait.webp
```

The site renders portraits with public URLs and `next/image`. It never uses S3 credentials in the app. Search and other lists without a season use the `default` portrait.

The hero uses the portrait for the season on screen. If that season has no row, it uses `season_key = 'default'`. If that is missing too, or the image request fails, the frame shows the driver's abbreviation and permanent number. A portrait from another year is never used as a fallback.

Set this before `next dev` and before `next build` on the VPS. `next start` alone is too late, because Next inlines `NEXT_PUBLIC_*` at build time.

```
NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL=https://dieji.s3.ir-central1.arvanstorage.ir
```

A stored key `drivers/max-verstappen/2026/portrait.webp` becomes:

```
https://dieji.s3.ir-central1.arvanstorage.ir/drivers/max-verstappen/2026/portrait.webp
```

Open that URL in a browser. A public object returns the image. A missing object returns an error from storage. Do not add image files to this repository.

Before deploying the code that reads portraits, review and apply [prisma/manual/driver_portrait.sql](prisma/manual/driver_portrait.sql) locally and on the VPS. The application does not run that script. The script creates the table, or upgrades an existing one-row-per-driver table by setting `season_key` to `default` on current rows. It does not change stored object keys, so an older key such as `drivers/max-verstappen/portrait.webp` keeps working as the default portrait. Until the table exists, driver profile queries fail.

Profile data, including every portrait row for that driver, is cached with `cacheLife("hours")`. A new or updated portrait row can stay stale for that cache lifetime. Replacing the bytes at an existing object key can also stay stale in the browser and in Next's image cache.

Register a season portrait and a default portrait after the files are in object storage:

```sql
INSERT INTO driver_portrait (driver_id, season_key, object_key)
VALUES ('max-verstappen', '2026', 'drivers/max-verstappen/2026/portrait.webp')
ON CONFLICT (driver_id, season_key)
DO UPDATE SET object_key = EXCLUDED.object_key;

INSERT INTO driver_portrait (driver_id, season_key, object_key)
VALUES ('max-verstappen', 'default', 'drivers/max-verstappen/default/portrait.webp')
ON CONFLICT (driver_id, season_key)
DO UPDATE SET object_key = EXCLUDED.object_key;
```

