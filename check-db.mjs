import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkDatabase() {
  console.log('\n========== DATABASE REPORT ==========\n');

  // 1. Sessions
  const sessions = await sql`SELECT * FROM sessions ORDER BY created_at DESC`;
  console.log(`SESSIONS: ${sessions.length} total`);
  const completed = sessions.filter(s => s.completed_at);
  console.log(`  - Completed: ${completed.length}`);
  console.log(`  - In Progress: ${sessions.length - completed.length}`);
  const consented = sessions.filter(s => s.consent_research);
  console.log(`  - Research Consent: ${consented.length}`);

  if (sessions.length > 0) {
    console.log('\n  Demographics breakdown:');
    const demographics = sessions.filter(s => s.demographics).map(s => s.demographics);
    if (demographics.length > 0) {
      const ages = {};
      const industries = {};
      const countries = {};
      demographics.forEach(d => {
        if (d.ageRange) ages[d.ageRange] = (ages[d.ageRange] || 0) + 1;
        if (d.industry) industries[d.industry] = (industries[d.industry] || 0) + 1;
        if (d.country) countries[d.country] = (countries[d.country] || 0) + 1;
      });
      console.log('    Age ranges:', ages);
      console.log('    Industries:', industries);
      console.log('    Countries:', countries);
    } else {
      console.log('    No demographics captured yet');
    }
  }

  // 2. Sorts
  const sorts = await sql`SELECT * FROM sorts`;
  console.log(`\nSORTS: ${sorts.length} total entries`);
  if (sorts.length > 0) {
    const categories = { very: 0, somewhat: 0, less: 0 };
    const veryValues = {};
    sorts.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
      if (s.category === 'very') {
        veryValues[s.value_name] = (veryValues[s.value_name] || 0) + 1;
      }
    });
    console.log('  Category distribution:', categories);
    console.log('  Top "Very Important" values:');
    Object.entries(veryValues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([val, count]) => console.log(`    - ${val}: ${count}`));
  }

  // 3. Rankings
  const rankings = await sql`SELECT * FROM rankings`;
  console.log(`\nRANKINGS: ${rankings.length} total entries`);
  if (rankings.length > 0) {
    const rank1Values = {};
    rankings.filter(r => r.rank === 1).forEach(r => {
      rank1Values[r.value_name] = (rank1Values[r.value_name] || 0) + 1;
    });
    console.log('  Most common #1 ranked values:');
    Object.entries(rank1Values)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([val, count]) => console.log(`    - ${val}: ${count}`));
  }

  // 4. Definitions
  const definitions = await sql`SELECT * FROM definitions`;
  console.log(`\nDEFINITIONS: ${definitions.length} total entries`);
  if (definitions.length > 0) {
    const withTranscript = definitions.filter(d => d.raw_transcript);
    const withRefined = definitions.filter(d => d.refined_definition);
    const userEdited = definitions.filter(d => d.user_edited);
    console.log(`  - With voice transcript: ${withTranscript.length}`);
    console.log(`  - With AI definition: ${withRefined.length}`);
    console.log(`  - User edited: ${userEdited.length}`);
  }

  // 5. Profiles
  const profiles = await sql`SELECT * FROM profiles`;
  console.log(`\nPROFILES: ${profiles.length} total`);
  if (profiles.length > 0) {
    const withShareSlug = profiles.filter(p => p.share_slug);
    console.log(`  - Publicly shared: ${withShareSlug.length}`);
    if (withShareSlug.length > 0) {
      console.log('  Share slugs:');
      withShareSlug.forEach(p => console.log(`    - ${p.share_slug}`));
    }
  }

  // Show recent session details
  if (sessions.length > 0) {
    console.log('\n========== RECENT SESSIONS ==========\n');
    sessions.slice(0, 5).forEach((s, i) => {
      console.log(`Session ${i + 1}: ${s.id}`);
      console.log(`  Created: ${s.created_at}`);
      console.log(`  Completed: ${s.completed_at || 'No'}`);
      console.log(`  Research Consent: ${s.consent_research}`);
      if (s.demographics) {
        console.log(`  Demographics: ${JSON.stringify(s.demographics)}`);
      }
      console.log('');
    });
  }

  console.log('=====================================\n');
}

checkDatabase().catch(console.error);
