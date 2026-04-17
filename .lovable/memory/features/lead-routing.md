---
name: Lead routing
description: Segmented leads table — every form (buyer, seller, contact, valuation, concierge, specialized) inserts via src/lib/leads.ts with lead_type tag; trigger auto-promotes priority to hot for buyer_agreement/pre_approval/seller_listing
type: feature
---
All site forms call `submitLead({ lead_type, specialty?, name, email, phone, payload })` from `src/lib/leads.ts`.

Lead types: buyer_agreement, pre_approval, seller_listing, valuation, contact, chatbot, loan_referral, concierge, specialized_service.

DB trigger `set_lead_priority` auto-tags hot priority for buyer_agreement, pre_approval, seller_listing.

RLS: anon+auth can INSERT (constrained by length checks); only admins (rows in public.admins) can SELECT/UPDATE/DELETE via `is_admin()` security definer function.
