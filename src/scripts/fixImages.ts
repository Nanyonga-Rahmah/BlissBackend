import "reflect-metadata";
import { PostgresStorageRepo } from "../postgresRepo/repo";

async function fixServiceImages() {
  const storage = new PostgresStorageRepo();

  try {
    await storage.init();

    await storage.dataSource.query(`
      UPDATE service
      SET images = ARRAY[image]::text[]
      WHERE image IS NOT NULL
        AND image != ''
    `);

    console.log("Service images fixed successfully.");
  } catch (error) {
    console.error("Fix failed:", error);
    process.exit(1);
  } finally {
    await storage.destroy();
  }
}

fixServiceImages();