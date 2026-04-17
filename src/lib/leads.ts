import { supabase } from '@/integrations/supabase/client'

export type LeadType =
  | 'buyer_agreement'
  | 'pre_approval'
  | 'seller_listing'
  | 'valuation'
  | 'contact'
  | 'chatbot'
  | 'loan_referral'
  | 'concierge'
  | 'specialized_service'

export interface SubmitLeadInput {
  lead_type: LeadType
  specialty?: string
  name?: string
  email?: string
  phone?: string
  payload?: Record<string, unknown>
}

/**
 * Segmented lead routing — every form on the site funnels here.
 * The DB trigger auto-tags hot vs warm priority based on lead_type so
 * downstream automations (email, CRM, voicemail agent) can route correctly.
 */
export async function submitLead(input: SubmitLeadInput) {
  const source_page =
    typeof window !== 'undefined' ? window.location.pathname : null

  const row = {
    lead_type: input.lead_type,
    specialty: input.specialty ?? null,
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    source_page,
    payload: (input.payload ?? {}) as never,
  }

  const { error } = await supabase.from('leads').insert([row])

  if (error) {
    console.error('Lead submission failed:', error)
    throw error
  }
}
