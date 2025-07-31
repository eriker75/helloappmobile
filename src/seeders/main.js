/**
 * Entry point for all seeders.
 * You can add more seeders and import them here.
 */
const chatSeeder = require('./chat-seeder');

async function runSeeders() {
  try {
    await chatSeeder();
    console.log('✅ All seeders completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error running seeders:', err);
    process.exit(1);
  }
}

runSeeders();
