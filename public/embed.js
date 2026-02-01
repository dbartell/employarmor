/**
 * HireShield Disclosure Widget
 * Embeddable script for careers pages
 * 
 * Usage:
 * <div id="hireshield-disclosure"></div>
 * <script src="https://aihirelaw.com/embed.js" 
 *         data-company="your-slug"
 *         data-style="compact|card|full">
 * </script>
 */

(function() {
  'use strict';

  // Get script configuration
  var currentScript = document.currentScript;
  var companySlug = currentScript ? currentScript.getAttribute('data-company') : null;
  var style = currentScript ? currentScript.getAttribute('data-style') || 'card' : 'card';
  
  if (!companySlug) {
    console.error('[HireShield] Missing data-company attribute');
    return;
  }

  // Get base URL from script src
  var scriptSrc = currentScript ? currentScript.src : '';
  var baseUrl = scriptSrc.replace('/embed.js', '');
  
  // API endpoint for disclosure data
  var apiUrl = baseUrl + '/api/disclosure/' + encodeURIComponent(companySlug);
  
  // Find container
  var container = document.getElementById('hireshield-disclosure');
  if (!container) {
    console.error('[HireShield] Container #hireshield-disclosure not found');
    return;
  }

  // Styles
  var styles = {
    compact: '\
      .hs-widget { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
      .hs-compact { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #475569; text-decoration: none; transition: all 0.2s; }\
      .hs-compact:hover { background: #f1f5f9; border-color: #cbd5e1; }\
      .hs-compact svg { width: 16px; height: 16px; }\
      .hs-compact span { color: inherit; }\
    ',
    card: '\
      .hs-widget { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
      .hs-card { max-width: 400px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\
      .hs-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }\
      .hs-card-logo { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; }\
      .hs-card-logo img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }\
      .hs-card-title { font-size: 16px; font-weight: 600; color: #1e293b; margin: 0; }\
      .hs-card-subtitle { font-size: 12px; color: #64748b; margin: 4px 0 0; }\
      .hs-card-tools { margin-bottom: 16px; }\
      .hs-card-tools-label { font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 8px; }\
      .hs-card-tools-list { display: flex; flex-wrap: wrap; gap: 6px; }\
      .hs-card-tool { font-size: 12px; background: #f1f5f9; padding: 4px 10px; border-radius: 12px; color: #475569; }\
      .hs-card-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; color: inherit; text-decoration: none; }\
      .hs-card-link:hover { text-decoration: underline; }\
      .hs-card-link svg { width: 14px; height: 14px; }\
      .hs-card-footer { padding-top: 12px; border-top: 1px solid #e2e8f0; margin-top: 16px; }\
      .hs-card-powered { font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }\
      .hs-card-powered svg { width: 12px; height: 12px; }\
    ',
    full: '\
      .hs-widget { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
      .hs-full { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\
      .hs-full-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }\
      .hs-full-logo { width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; }\
      .hs-full-logo img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }\
      .hs-full-title { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0; }\
      .hs-full-intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px; }\
      .hs-full-section { margin-bottom: 20px; }\
      .hs-full-section-title { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }\
      .hs-full-section-title svg { width: 16px; height: 16px; }\
      .hs-full-tool { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; }\
      .hs-full-tool-name { font-weight: 500; color: #1e293b; margin-bottom: 4px; }\
      .hs-full-tool-desc { font-size: 13px; color: #64748b; }\
      .hs-full-rights { background: #f8fafc; border-radius: 8px; padding: 16px; }\
      .hs-full-rights p { margin: 8px 0; font-size: 13px; color: #475569; display: flex; align-items: flex-start; gap: 8px; }\
      .hs-full-rights .bullet { width: 6px; height: 6px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }\
      .hs-full-contact { font-size: 14px; color: #475569; }\
      .hs-full-contact a { color: inherit; font-weight: 500; }\
      .hs-full-footer { padding-top: 16px; border-top: 1px solid #e2e8f0; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }\
      .hs-full-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; color: inherit; text-decoration: none; padding: 8px 16px; background: #f1f5f9; border-radius: 6px; transition: background 0.2s; }\
      .hs-full-link:hover { background: #e2e8f0; }\
      .hs-full-link svg { width: 14px; height: 14px; }\
      .hs-full-powered { font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }\
      .hs-full-powered svg { width: 12px; height: 12px; }\
    '
  };

  // Icons
  var icons = {
    shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    externalLink: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
    bot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
  };

  // Inject styles
  var styleEl = document.createElement('style');
  styleEl.textContent = styles[style] || styles.card;
  document.head.appendChild(styleEl);

  // Show loading state
  container.innerHTML = '<div class="hs-widget" style="opacity: 0.6;">Loading...</div>';

  // Fetch disclosure data
  fetch(apiUrl)
    .then(function(response) {
      if (!response.ok) throw new Error('Not found');
      return response.json();
    })
    .then(function(data) {
      renderWidget(data);
    })
    .catch(function(error) {
      console.error('[HireShield] Error loading disclosure:', error);
      container.innerHTML = '';
    });

  function renderWidget(data) {
    var brandColor = data.brand_color || '#3B82F6';
    var companyName = data.organizations?.name || 'Company';
    var pageUrl = baseUrl + '/d/' + companySlug;
    var tools = data.tools || [];
    
    var html = '';
    
    if (style === 'compact') {
      html = '\
        <div class="hs-widget">\
          <a href="' + pageUrl + '" target="_blank" rel="noopener noreferrer" class="hs-compact">\
            ' + icons.shield + '\
            <span>View AI Hiring Disclosure</span>\
            ' + icons.externalLink + '\
          </a>\
        </div>';
    } else if (style === 'card') {
      var toolsHtml = tools.slice(0, 3).map(function(t) {
        return '<span class="hs-card-tool">' + escapeHtml(t.name) + '</span>';
      }).join('');
      
      html = '\
        <div class="hs-widget">\
          <div class="hs-card">\
            <div class="hs-card-header">\
              ' + (data.logo_url 
                ? '<div class="hs-card-logo"><img src="' + escapeHtml(data.logo_url) + '" alt=""></div>'
                : '<div class="hs-card-logo" style="background: ' + brandColor + '">' + companyName.charAt(0) + '</div>'
              ) + '\
              <div>\
                <h3 class="hs-card-title">AI Hiring Practices</h3>\
                <p class="hs-card-subtitle">' + escapeHtml(companyName) + '</p>\
              </div>\
            </div>\
            ' + (toolsHtml ? '\
            <div class="hs-card-tools">\
              <div class="hs-card-tools-label">AI Tools Used</div>\
              <div class="hs-card-tools-list">' + toolsHtml + '</div>\
            </div>' : '') + '\
            <a href="' + pageUrl + '" target="_blank" rel="noopener noreferrer" class="hs-card-link" style="color: ' + brandColor + '">\
              View Full Disclosure ' + icons.externalLink + '\
            </a>\
            ' + (!data.hide_powered_by ? '\
            <div class="hs-card-footer">\
              <span class="hs-card-powered">' + icons.shield + ' Powered by HireShield</span>\
            </div>' : '') + '\
          </div>\
        </div>';
    } else if (style === 'full') {
      var toolsFullHtml = tools.map(function(t) {
        return '\
          <div class="hs-full-tool">\
            <div class="hs-full-tool-name">' + escapeHtml(t.name) + '</div>\
            <div class="hs-full-tool-desc">' + escapeHtml(t.purpose) + '</div>\
          </div>';
      }).join('');
      
      var rightsHtml = '';
      if (data.rights_section_enabled) {
        var rightsText = data.rights_custom_text || 'You may request an alternative selection process\nYou may request human review of decisions';
        rightsHtml = rightsText.split('\n').map(function(line) {
          var text = line.trim().replace(/^[•\-]\s*/, '');
          if (!text) return '';
          return '<p><span class="bullet" style="background: ' + brandColor + '"></span><span>' + escapeHtml(text) + '</span></p>';
        }).join('');
      }
      
      html = '\
        <div class="hs-widget">\
          <div class="hs-full">\
            <div class="hs-full-header">\
              ' + (data.logo_url 
                ? '<div class="hs-full-logo"><img src="' + escapeHtml(data.logo_url) + '" alt=""></div>'
                : '<div class="hs-full-logo" style="background: ' + brandColor + '">' + companyName.charAt(0) + '</div>'
              ) + '\
              <h3 class="hs-full-title">' + escapeHtml(data.header_text || 'How ' + companyName + ' Uses AI in Hiring') + '</h3>\
            </div>\
            ' + (data.intro_text ? '<p class="hs-full-intro">' + escapeHtml(data.intro_text.substring(0, 300)) + (data.intro_text.length > 300 ? '...' : '') + '</p>' : '') + '\
            ' + (toolsFullHtml ? '\
            <div class="hs-full-section">\
              <div class="hs-full-section-title" style="color: ' + brandColor + '">' + icons.bot + ' AI Tools We Use</div>\
              ' + toolsFullHtml + '\
            </div>' : '') + '\
            ' + (rightsHtml ? '\
            <div class="hs-full-section">\
              <div class="hs-full-section-title" style="color: ' + brandColor + '">' + icons.check + ' Your Rights</div>\
              <div class="hs-full-rights">' + rightsHtml + '</div>\
            </div>' : '') + '\
            <div class="hs-full-contact">\
              Questions? Contact us at <a href="mailto:' + escapeHtml(data.contact_email) + '">' + escapeHtml(data.contact_email) + '</a>\
            </div>\
            <div class="hs-full-footer">\
              <a href="' + pageUrl + '" target="_blank" rel="noopener noreferrer" class="hs-full-link" style="color: ' + brandColor + '">\
                View Full Disclosure ' + icons.externalLink + '\
              </a>\
              ' + (!data.hide_powered_by ? '<span class="hs-full-powered">' + icons.shield + ' Powered by HireShield</span>' : '') + '\
            </div>\
          </div>\
        </div>';
    }
    
    container.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
