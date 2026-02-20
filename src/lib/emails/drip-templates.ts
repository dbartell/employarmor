// Drip campaign email templates for onboarding
import { emailWrapper, APP_URL } from '../email-templates'

// Day 1: Welcome + complete first document
export function welcomeDripEmail(params: {
  name: string
  company: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>Welcome to EmployArmor, ${params.name}! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>Thanks for starting your trial! You've taken the first step toward AI hiring compliance for <strong>${params.company}</strong>.</p>
      
      <h3>Your first 10 minutes:</h3>
      
      <div class="stat-box">
        <strong>✨ Complete your Impact Assessment</strong><br>
        This is the cornerstone of your compliance program. It takes about 20 minutes and covers everything you need for Colorado AI Act and beyond.<br><br>
        <a href="${APP_URL}/documents/impact-assessment" style="color: #1e40af; font-weight: 500;">Start now →</a>
      </div>
      
      <p>Most users who complete their first document in day 1 become fully compliant within a week.</p>
      
      <a href="${APP_URL}/dashboard" class="cta">Go to Dashboard →</a>
      
      <p>— The EmployArmor Team</p>
      
      <p style="color: #6b7280; font-size: 14px;">P.S. Reply to this email if you have any questions. We read every message.</p>
    </div>`

  return {
    subject: `Welcome to EmployArmor — let's get ${params.company} compliant`,
    html: emailWrapper(content),
  }
}

// Day 2: Incomplete impact assessment reminder
export function incompleteDocumentEmail(params: {
  name: string
  progressPercent: number
  documentName: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>You're ${params.progressPercent}% done — keep going! 📝</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>You started your <strong>${params.documentName}</strong> yesterday but haven't finished yet.</p>
      
      <div class="stat-box">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Progress:</strong> ${params.progressPercent}% complete</span>
          <span style="color: #059669;">Almost there!</span>
        </div>
        <div style="background: #e5e7eb; border-radius: 4px; height: 8px; margin-top: 8px;">
          <div style="background: #3b82f6; border-radius: 4px; height: 8px; width: ${params.progressPercent}%;"></div>
        </div>
      </div>
      
      <p>The ${params.documentName} is the foundation of your compliance program. Finishing it unlocks:</p>
      <ul>
        <li>Your compliance score update</li>
        <li>State-specific disclosure documents</li>
        <li>Clear next steps for your team</li>
      </ul>
      
      <a href="${APP_URL}/documents/impact-assessment" class="cta">Finish your ${params.documentName} →</a>
      
      <p>— The EmployArmor Team</p>
    </div>`

  return {
    subject: `You're ${params.progressPercent}% done with your ${params.documentName}`,
    html: emailWrapper(content),
  }
}

// Day 5: Team hasn't completed training
export function teamTrainingReminderEmail(params: {
  name: string
  totalInvited: number
  completedCount: number
  pendingNames: string[]
}): { subject: string; html: string } {
  const pendingList = params.pendingNames.slice(0, 5).map(n => `<li>${n}</li>`).join('')
  const moreCount = params.pendingNames.length > 5 ? `<li>...and ${params.pendingNames.length - 5} more</li>` : ''

  const content = `
    <div class="header">
      <h1>Your team is waiting on training 👥</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>You've invited <strong>${params.totalInvited} team members</strong> to complete AI hiring compliance training, but <strong>${params.totalInvited - params.completedCount}</strong> haven't started yet.</p>
      
      <div class="stat-box">
        <div style="display: flex; justify-content: space-between;">
          <span><strong>Completed:</strong></span>
          <span style="color: #059669;">${params.completedCount} of ${params.totalInvited}</span>
        </div>
      </div>
      
      <p><strong>Still pending:</strong></p>
      <ul>
        ${pendingList}
        ${moreCount}
      </ul>
      
      <p>Would you like us to send them a reminder? Or you can forward this email with a personal note:</p>
      
      <a href="${APP_URL}/settings/training" class="cta">Manage Training Assignments →</a>
      
      <p>— The EmployArmor Team</p>
      
      <p style="color: #6b7280; font-size: 14px;">Training takes 15-30 minutes and includes a certificate of completion.</p>
    </div>`

  return {
    subject: `${params.totalInvited - params.completedCount} team members still need to complete training`,
    html: emailWrapper(content),
  }
}

// Day 10: Trial ending soon
export function trialEndingSoonEmail(params: {
  name: string
  daysLeft: number
  progressPercent: number
  completedTasks: number
  totalTasks: number
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>⏰ ${params.daysLeft} days left in your trial</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>Your EmployArmor trial ends in <strong>${params.daysLeft} days</strong>. Here's where you stand:</p>
      
      <div class="stat-box">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Compliance Progress:</strong></span>
          <span style="color: ${params.progressPercent >= 75 ? '#059669' : params.progressPercent >= 50 ? '#d97706' : '#dc2626'}; font-weight: 600;">
            ${params.progressPercent}%
          </span>
        </div>
        <div style="background: #e5e7eb; border-radius: 4px; height: 8px; margin-top: 8px;">
          <div style="background: ${params.progressPercent >= 75 ? '#059669' : params.progressPercent >= 50 ? '#d97706' : '#dc2626'}; border-radius: 4px; height: 8px; width: ${params.progressPercent}%;"></div>
        </div>
        <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">
          ${params.completedTasks} of ${params.totalTasks} tasks complete
        </div>
      </div>
      
      ${params.progressPercent < 75 ? `
      <p><strong>Recommended next steps:</strong></p>
      <ol>
        <li>Finish your Impact Assessment (if not done)</li>
        <li>Generate your disclosure notice</li>
        <li>Invite your team to training</li>
      </ol>
      ` : `
      <p>Great progress! You're well on your way to full compliance. 🎉</p>
      `}
      
      <a href="${APP_URL}/dashboard" class="cta">Continue where you left off →</a>
      
      <p>— The EmployArmor Team</p>
      
      <p style="color: #6b7280; font-size: 14px;">Want to keep your progress? <a href="${APP_URL}/settings/billing" style="color: #1e40af;">Upgrade anytime</a> to lock in your compliance work.</p>
    </div>`

  return {
    subject: `⏰ ${params.daysLeft} days left in your trial — you're ${params.progressPercent}% compliant`,
    html: emailWrapper(content),
  }
}

// Day 13: Trial ends tomorrow
export function trialEndsTomorrowEmail(params: {
  name: string
  progressPercent: number
  completedTasks: number
  totalTasks: number
}): { subject: string; html: string } {
  const isHighProgress = params.progressPercent >= 75

  const content = `
    <div class="header urgent-header">
      <h1>🚨 Your trial ends tomorrow</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>This is your final reminder — your EmployArmor trial expires <strong>tomorrow</strong>.</p>
      
      <div class="stat-box">
        <div style="font-size: 48px; font-weight: bold; text-align: center; color: ${isHighProgress ? '#059669' : '#3b82f6'};">
          ${params.progressPercent}%
        </div>
        <div style="text-align: center; color: #6b7280;">
          ${params.completedTasks}/${params.totalTasks} compliance tasks complete
        </div>
      </div>
      
      ${isHighProgress ? `
      <p>You've made <strong>excellent progress</strong>! Don't let it go to waste. Upgrade now to:</p>
      <ul>
        <li>Keep all your documents and settings</li>
        <li>Maintain your team's training certificates</li>
        <li>Stay protected as laws evolve</li>
      </ul>
      ` : `
      <p>You still have time to finish your compliance setup. Even after tomorrow, your work is saved — just upgrade when you're ready.</p>
      `}
      
      <a href="${APP_URL}/settings/billing" class="cta urgent-cta">Upgrade Now →</a>
      
      <p>Questions? Reply to this email and we'll help you out.</p>
      
      <p>— The EmployArmor Team</p>
    </div>`

  return {
    subject: `🚨 Trial ends tomorrow — you're ${params.progressPercent}% compliant`,
    html: emailWrapper(content),
  }
}
