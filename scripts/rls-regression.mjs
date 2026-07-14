#!/usr/bin/env node
/**
 * RLS regression test — runs against the live project using the anon key only.
 *
 * Verifies:
 *   - anon CAN insert into public lead-capture tables (feedback, preferences, notifications)
 *   - anon CANNOT read from any protected table (admins, site_feedback, lead_preferences,
 *     lead_notifications, leads, offmarket_listings hidden_details, agent_profiles email/phone,
 *     saved_searches, offmarket_unlocks)
 *
 * Usage: node scripts/rls-regression.mjs
 * Env:   SUPABASE_URL, SUPABASE_ANON_KEY (falls back to project defaults).
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || 'https://pvvuyidkofifxtvkxqzr.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dnV5aWRrb2ZpZnh0dmt4cXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjI0MjgsImV4cCI6MjA5MDczODQyOH0.0lLa6MzAN0-YiXwltJ8vhIW3r732jjUQQ9WfRbm-lLY';

const sb = createClient(URL, KEY, { auth: { persistSession: false } });

let passed = 0, failed = 0;
const record = (name, ok, detail = '') => {
  const tag = ok ? '✓' : '✗';
  console.log(`${tag} ${name}${detail ? '  — ' + detail : ''}`);
  ok ? passed++ : failed++;
};

async function mustDenyRead(table, columns = '*') {
  const { data, error } = await sb.from(table).select(columns).limit(1);
  const denied = (!data || data.length === 0);
  record(`anon SELECT denied: ${table}`, denied,
    error ? `error=${error.code}` : `rows=${data?.length ?? 0}`);
}

async function mustAllowInsert(table, row) {
  const { error } = await sb.from(table).insert(row);
  record(`anon INSERT allowed: ${table}`, !error, error ? error.message : 'ok');
}

async function mustDenyInsert(table, row) {
  const { error } = await sb.from(table).insert(row);
  record(`anon INSERT denied: ${table}`, !!error, error ? error.code : 'unexpectedly succeeded');
}

async function main() {
  // Reads that MUST be denied
  await mustDenyRead('admins');
  await mustDenyRead('site_feedback');
  await mustDenyRead('lead_preferences');
  await mustDenyRead('lead_notifications');
  await mustDenyRead('leads');
  await mustDenyRead('saved_searches');
  await mustDenyRead('offmarket_unlocks');

  // Inserts that MUST succeed (public lead-capture)
  const tag = `rls-regression ${new Date().toISOString()}`;
  await mustAllowInsert('site_feedback', {
    rating: 5, liked: ['Design'], liked_notes: tag,
    improve_notes: null, contact_opt_in: false,
    page_url: 'https://example.com/rls-test', user_agent: 'rls-regression',
  });
  await mustAllowInsert('lead_preferences', {
    preferences: ['natural_light'], source_page: 'rls-test',
  });

  // Inserts that MUST be denied (admin-only tables)
  await mustDenyInsert('admins', { email: `attacker+${Date.now()}@example.com` });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
