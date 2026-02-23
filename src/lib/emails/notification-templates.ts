import { emailWrapper, APP_URL } from '@/lib/email-templates'

// ── Invite Email ──────────────────────────────────────────

export function inviteEmail(params: {
  orgName: string
  role: string
  inviteUrl: string
  expiresAt: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>You've been invited to ${params.orgName}</h1>
    </div>
    <div class="content">
      <p>You've been invited to join <strong>${params.orgName}</strong> on EmployArmor as a <strong>${params.role}</strong>.</p>
      
      <p>EmployArmor helps organizations manage AI hiring compliance, employee training, and tool governance.</p>
      
      <div class="stat-box">
        <strong>Organization:</strong> ${params.orgName}<br>
        <strong>Role:</strong> ${params.role}<br>
        <strong>Expires:</strong> ${params.expiresAt}
      </div>
      
      <a href="${params.inviteUrl}" class="cta">Accept Invite →</a>
      
      <p style="color: #6b7280; font-size: 14px;">This invite link expires on ${params.expiresAt}. If you didn't expect this invitation, you can safely ignore this email.</p>
    </div>`

  return {
    subject: `You've been invited to join ${params.orgName} on EmployArmor`,
    html: emailWrapper(content),
  }
}

// ── Training Completed ────────────────────────────────────

export function trainingCompletedEmail(params: {
  adminName: string
  employeeName: string
  trackTitle: string
  completionDate: string
  certificateNumber?: string
  score?: number
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>✅ Training Completed</h1>
    </div>
    <div class="content">
      <p>Hi ${params.adminName},</p>
      
      <p><strong>${params.employeeName}</strong> has completed their assigned training.</p>
      
      <div class="stat-box">
        <strong>Training:</strong> ${params.trackTitle}<br>
        <strong>Completed:</strong> ${params.completionDate}<br>
        ${params.score !== undefined ? `<strong>Score:</strong> ${params.score}%<br>` : ''}
        ${params.certificateNumber ? `<strong>Certificate:</strong> ${params.certificateNumber}` : ''}
      </div>
      
      <a href="${APP_URL}/training" class="cta">View Training Dashboard →</a>
      
      <p>— EmployArmor</p>
    </div>`

  return {
    subject: `${params.employeeName} completed "${params.trackTitle}" training`,
    html: emailWrapper(content, `<p>You're receiving this because you're an admin of the organization.</p>`),
  }
}

// ── Disclosure Signed ─────────────────────────────────────

export function disclosureSignedEmail(params: {
  adminName: string
  employeeName: string
  disclosureTitle: string
  signedDate: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>📝 Disclosure Signed</h1>
    </div>
    <div class="content">
      <p>Hi ${params.adminName},</p>
      
      <p><strong>${params.employeeName}</strong> has signed a disclosure document.</p>
      
      <div class="stat-box">
        <strong>Disclosure:</strong> ${params.disclosureTitle}<br>
        <strong>Signed:</strong> ${params.signedDate}
      </div>
      
      <a href="${APP_URL}/employee-disclosures" class="cta">View Disclosures →</a>
      
      <p>— EmployArmor</p>
    </div>`

  return {
    subject: `${params.employeeName} signed "${params.disclosureTitle}"`,
    html: emailWrapper(content, `<p>You're receiving this because you're an admin of the organization.</p>`),
  }
}

// ── Tool Request Submitted ────────────────────────────────

export function toolRequestSubmittedEmail(params: {
  adminName: string
  employeeName: string
  toolName: string
  reason: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>🔧 New Tool Request</h1>
    </div>
    <div class="content">
      <p>Hi ${params.adminName},</p>
      
      <p><strong>${params.employeeName}</strong> has submitted a new AI tool request for review.</p>
      
      <div class="stat-box">
        <strong>Tool:</strong> ${params.toolName}<br>
        <strong>Reason:</strong> ${params.reason}
      </div>
      
      <a href="${APP_URL}/approvals" class="cta">Review Request →</a>
      
      <p>— EmployArmor</p>
    </div>`

  return {
    subject: `New tool request: ${params.toolName} from ${params.employeeName}`,
    html: emailWrapper(content, `<p>You're receiving this because you're an admin of the organization.</p>`),
  }
}

// ── Tool Request Decided ──────────────────────────────────

export function toolRequestDecidedEmail(params: {
  employeeName: string
  toolName: string
  decision: 'approved' | 'denied'
  adminNotes?: string
}): { subject: string; html: string } {
  const isApproved = params.decision === 'approved'
  const emoji = isApproved ? '✅' : '❌'
  const headerClass = isApproved ? '' : 'urgent-header'

  const content = `
    <div class="header ${headerClass}">
      <h1>${emoji} Tool Request ${isApproved ? 'Approved' : 'Denied'}</h1>
    </div>
    <div class="content">
      <p>Hi ${params.employeeName},</p>
      
      <p>Your request to use <strong>${params.toolName}</strong> has been <strong>${params.decision}</strong>.</p>
      
      <div class="stat-box">
        <strong>Tool:</strong> ${params.toolName}<br>
        <strong>Decision:</strong> ${params.decision.charAt(0).toUpperCase() + params.decision.slice(1)}<br>
        ${params.adminNotes ? `<strong>Notes:</strong> ${params.adminNotes}` : ''}
      </div>
      
      <a href="${APP_URL}/portal/tools" class="cta">View Your Tools →</a>
      
      <p>— EmployArmor</p>
    </div>`

  return {
    subject: `Your tool request for ${params.toolName} was ${params.decision}`,
    html: emailWrapper(content),
  }
}

// ── Employee Joined Team ──────────────────────────────────

export function employeeJoinedEmail(params: {
  adminName: string
  newMemberName: string
  newMemberEmail: string
  role: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>👋 New Team Member</h1>
    </div>
    <div class="content">
      <p>Hi ${params.adminName},</p>
      
      <p>A new member has joined your organization.</p>
      
      <div class="stat-box">
        <strong>Name:</strong> ${params.newMemberName}<br>
        <strong>Email:</strong> ${params.newMemberEmail}<br>
        <strong>Role:</strong> ${params.role}
      </div>
      
      <a href="${APP_URL}/settings/team" class="cta">View Team →</a>
      
      <p>— EmployArmor</p>
    </div>`

  return {
    subject: `${params.newMemberName} joined your team`,
    html: emailWrapper(content, `<p>You're receiving this because you're an admin of the organization.</p>`),
  }
}

// ── Compliance Score Alert ────────────────────────────────

export function complianceScoreAlertEmail(params: {
  adminName: string
  currentScore: number
  previousScore: number
  whatChanged: string
}): { subject: string; html: string } {
  const content = `
    <div class="header urgent-header">
      <h1>🚨 Compliance Score Alert</h1>
    </div>
    <div class="content">
      <p>Hi ${params.adminName},</p>
      
      <p>Your organization's compliance score has dropped below 50%.</p>
      
      <div class="stat-box">
        <strong>Current Score:</strong> ${params.currentScore}%<br>
        <strong>Previous Score:</strong> ${params.previousScore}%<br>
        <strong>Change:</strong> ${params.whatChanged}
      </div>
      
      <a href="${APP_URL}/dashboard" class="cta urgent-cta">Review Dashboard →</a>
      
      <p>— EmployArmor</p>
    </div>`

  return {
    subject: `⚠️ Compliance score dropped to ${params.currentScore}%`,
    html: emailWrapper(content, `<p>You're receiving this because your compliance score needs attention.</p>`),
  }
}
