/**
 * Merge.dev API Client
 * 
 * Wrapper for Merge.dev's unified ATS API.
 * Docs: https://docs.merge.dev/ats/overview/
 */

const MERGE_API_BASE = 'https://api.merge.dev/api/ats/v1'

export interface MergeConfig {
  apiKey: string          // MERGE_API_KEY from env
  accountToken?: string   // X-Account-Token for linked accounts
}

export interface MergeCandidate {
  id: string
  remote_id: string | null
  first_name: string | null
  last_name: string | null
  company: string | null
  title: string | null
  remote_created_at: string | null
  remote_updated_at: string | null
  last_interaction_at: string | null
  is_private: boolean
  can_email: boolean
  locations: string[]
  phone_numbers: MergePhoneNumber[]
  email_addresses: MergeEmailAddress[]
  urls: MergeUrl[]
  tags: string[]
  applications: string[]  // Application IDs
  attachments: string[]
}

export interface MergePhoneNumber {
  value: string
  phone_number_type: string | null
}

export interface MergeEmailAddress {
  value: string
  email_address_type: string | null
}

export interface MergeUrl {
  value: string
  url_type: string | null
}

export interface MergeApplication {
  id: string
  remote_id: string | null
  candidate: string        // Candidate ID
  job: string | null       // Job ID
  applied_at: string | null
  rejected_at: string | null
  source: string | null
  credited_to: string | null
  current_stage: string | null
  reject_reason: string | null
  remote_created_at: string | null
  remote_updated_at: string | null
}

export interface MergeJob {
  id: string
  remote_id: string | null
  name: string | null
  description: string | null
  code: string | null
  status: 'OPEN' | 'CLOSED' | 'DRAFT' | 'ARCHIVED' | 'PENDING' | null
  job_posting_urls: MergeUrl[]
  remote_created_at: string | null
  remote_updated_at: string | null
  confidential: boolean
  departments: string[]
  offices: string[]
  hiring_managers: string[]
  recruiters: string[]
}

export interface MergeOffice {
  id: string
  remote_id: string | null
  name: string | null
  location: string | null
}

export interface MergeActivity {
  id: string
  remote_id: string | null
  user: string | null
  remote_created_at: string | null
  activity_type: 'NOTE' | 'EMAIL' | 'COMMENT' | 'SCHEDULED' | null
  subject: string | null
  body: string | null
  visibility: 'ADMIN_ONLY' | 'PUBLIC' | 'PRIVATE' | null
  candidate: string | null
}

export interface MergeJobInterviewStage {
  id: string
  remote_id: string | null
  name: string | null
  job: string | null
  stage_order: number | null
}

export interface MergePaginatedResponse<T> {
  next: string | null
  previous: string | null
  results: T[]
}

export interface MergeLinkTokenResponse {
  link_token: string
  integration_name: string | null
  magic_link_url: string | null
}

export interface MergeAccountDetails {
  id: string
  integration: string
  integration_slug: string
  category: string
  end_user_origin_id: string
  end_user_organization_name: string
  end_user_email_address: string
  status: string
  webhook_listener_url: string
  is_duplicate: boolean | null
}

export class MergeClient {
  private apiKey: string
  private accountToken?: string

  constructor(config: MergeConfig) {
    this.apiKey = config.apiKey
    this.accountToken = config.accountToken
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }

    if (this.accountToken) {
      headers['X-Account-Token'] = this.accountToken
    }

    const response = await fetch(`${MERGE_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new MergeAPIError(
        `Merge API error: ${response.status} ${response.statusText}`,
        response.status,
        errorText
      )
    }

    return response.json()
  }

  /**
   * Create a Link token for the Merge Link embedded component.
   * This initiates the OAuth flow for connecting an ATS.
   */
  async createLinkToken(params: {
    endUserEmailAddress: string
    endUserOrganizationName: string
    endUserOriginId: string   // Your org ID
    categories?: string[]
    linkExpiryMins?: number
  }): Promise<MergeLinkTokenResponse> {
    return this.request<MergeLinkTokenResponse>('/link-token', {
      method: 'POST',
      body: JSON.stringify({
        end_user_email_address: params.endUserEmailAddress,
        end_user_organization_name: params.endUserOrganizationName,
        end_user_origin_id: params.endUserOriginId,
        categories: params.categories || ['ats'],
        link_expiry_mins: params.linkExpiryMins || 30,
      }),
    })
  }

  /**
   * Exchange a public token for an account token after OAuth completes.
   */
  async exchangeToken(publicToken: string): Promise<{ account_token: string }> {
    return this.request<{ account_token: string }>('/account-token', {
      method: 'POST',
      body: JSON.stringify({ public_token: publicToken }),
    })
  }

  /**
   * Get linked account details.
   */
  async getAccountDetails(): Promise<MergeAccountDetails> {
    return this.request<MergeAccountDetails>('/account-details')
  }

  /**
   * Delete/unlink an account.
   */
  async deleteAccount(): Promise<void> {
    await this.request('/delete-account', { method: 'POST' })
  }

  // ============================================
  // CANDIDATES
  // ============================================

  async getCandidates(params?: {
    cursor?: string
    pageSize?: number
    modifiedAfter?: string
    includeRemoteData?: boolean
  }): Promise<MergePaginatedResponse<MergeCandidate>> {
    const searchParams = new URLSearchParams()
    if (params?.cursor) searchParams.set('cursor', params.cursor)
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString())
    if (params?.modifiedAfter) searchParams.set('modified_after', params.modifiedAfter)
    if (params?.includeRemoteData) searchParams.set('include_remote_data', 'true')

    const query = searchParams.toString()
    return this.request<MergePaginatedResponse<MergeCandidate>>(
      `/candidates${query ? `?${query}` : ''}`
    )
  }

  async getCandidate(id: string): Promise<MergeCandidate> {
    return this.request<MergeCandidate>(`/candidates/${id}`)
  }

  // ============================================
  // APPLICATIONS
  // ============================================

  async getApplications(params?: {
    cursor?: string
    pageSize?: number
    modifiedAfter?: string
    candidateId?: string
    jobId?: string
  }): Promise<MergePaginatedResponse<MergeApplication>> {
    const searchParams = new URLSearchParams()
    if (params?.cursor) searchParams.set('cursor', params.cursor)
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString())
    if (params?.modifiedAfter) searchParams.set('modified_after', params.modifiedAfter)
    if (params?.candidateId) searchParams.set('candidate_id', params.candidateId)
    if (params?.jobId) searchParams.set('job_id', params.jobId)

    const query = searchParams.toString()
    return this.request<MergePaginatedResponse<MergeApplication>>(
      `/applications${query ? `?${query}` : ''}`
    )
  }

  async getApplication(id: string): Promise<MergeApplication> {
    return this.request<MergeApplication>(`/applications/${id}`)
  }

  // ============================================
  // JOBS
  // ============================================

  async getJobs(params?: {
    cursor?: string
    pageSize?: number
    status?: 'OPEN' | 'CLOSED' | 'DRAFT' | 'ARCHIVED' | 'PENDING'
  }): Promise<MergePaginatedResponse<MergeJob>> {
    const searchParams = new URLSearchParams()
    if (params?.cursor) searchParams.set('cursor', params.cursor)
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString())
    if (params?.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    return this.request<MergePaginatedResponse<MergeJob>>(
      `/jobs${query ? `?${query}` : ''}`
    )
  }

  async getJob(id: string): Promise<MergeJob> {
    return this.request<MergeJob>(`/jobs/${id}`)
  }

  // ============================================
  // OFFICES
  // ============================================

  async getOffices(params?: {
    cursor?: string
    pageSize?: number
  }): Promise<MergePaginatedResponse<MergeOffice>> {
    const searchParams = new URLSearchParams()
    if (params?.cursor) searchParams.set('cursor', params.cursor)
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString())

    const query = searchParams.toString()
    return this.request<MergePaginatedResponse<MergeOffice>>(
      `/offices${query ? `?${query}` : ''}`
    )
  }

  // ============================================
  // ACTIVITIES
  // ============================================

  async getActivities(params?: {
    cursor?: string
    pageSize?: number
    modifiedAfter?: string
    candidateId?: string
  }): Promise<MergePaginatedResponse<MergeActivity>> {
    const searchParams = new URLSearchParams()
    if (params?.cursor) searchParams.set('cursor', params.cursor)
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString())
    if (params?.modifiedAfter) searchParams.set('modified_after', params.modifiedAfter)
    if (params?.candidateId) searchParams.set('candidate_id', params.candidateId)

    const query = searchParams.toString()
    return this.request<MergePaginatedResponse<MergeActivity>>(
      `/activities${query ? `?${query}` : ''}`
    )
  }

  // ============================================
  // JOB INTERVIEW STAGES
  // ============================================

  async getJobInterviewStages(params?: {
    cursor?: string
    pageSize?: number
    jobId?: string
  }): Promise<MergePaginatedResponse<MergeJobInterviewStage>> {
    const searchParams = new URLSearchParams()
    if (params?.cursor) searchParams.set('cursor', params.cursor)
    if (params?.pageSize) searchParams.set('page_size', params.pageSize.toString())
    if (params?.jobId) searchParams.set('job_id', params.jobId)

    const query = searchParams.toString()
    return this.request<MergePaginatedResponse<MergeJobInterviewStage>>(
      `/job-interview-stages${query ? `?${query}` : ''}`
    )
  }

  // ============================================
  // WEBHOOKS
  // ============================================

  /**
   * Verify a webhook signature from Merge.
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    // Merge uses HMAC-SHA256 for webhook signatures
    // In production, use crypto.createHmac to verify
    // For now, this is a placeholder
    if (!signature || !secret) return false
    
    // TODO: Implement actual HMAC verification
    // const expectedSignature = crypto
    //   .createHmac('sha256', secret)
    //   .update(payload)
    //   .digest('hex')
    // return crypto.timingSafeEqual(
    //   Buffer.from(signature),
    //   Buffer.from(expectedSignature)
    // )
    
    return true // Placeholder - implement before production
  }
}

export class MergeAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody: string
  ) {
    super(message)
    this.name = 'MergeAPIError'
  }
}

/**
 * Create a Merge client instance with environment variables.
 */
export function createMergeClient(accountToken?: string): MergeClient {
  const apiKey = process.env.MERGE_API_KEY
  if (!apiKey) {
    throw new Error('MERGE_API_KEY environment variable is not set')
  }

  return new MergeClient({
    apiKey,
    accountToken,
  })
}
