import "reflect-metadata";
import { PostgresStorageRepo } from "../postgresRepo/repo";

async function migrateServiceImages() {
  const storage = new PostgresStorageRepo();

  try {
    await storage.init();

    await storage.dataSource.query(`
      CREATE TABLE IF NOT EXISTS service_backup_before_images AS
      SELECT * FROM service
    `);

    await storage.dataSource.query(`
      ALTER TABLE service
      DROP COLUMN IF EXISTS images
    `);

    await storage.dataSource.query(`
      ALTER TABLE service
      ADD COLUMN images text[] NOT NULL DEFAULT '{}'
    `);

    await storage.dataSource.query(`
      UPDATE service
      SET images = ARRAY[image]
      WHERE image IS NOT NULL
        AND image != ''
    `);

    console.log("Service image migration completed successfully.");
  } catch (error) {
    console.error("Service image migration failed:", error);
    process.exit(1);
  } finally {
    await storage.destroy();
  }
}

migrateServiceImages();