/**
 * Tango Garden registration confirmation.
 *
 * Bound to the Google Form (Extensions > Apps Script). On every submission it
 * asks the render Worker for the confirmation email, then sends it from the
 * Workspace bookings@ address with the .ics attached.
 *
 * One-time setup:
 *   1. Project Settings > Script Properties:
 *        WORKER_URL     = https://tango-garden-registration.<subdomain>.workers.dev
 *        SHARED_SECRET  = (the same value set with `wrangler secret put SHARED_SECRET`)
 *        COURSE_SLUG    = growth-sessions  (improvers form only; leave it out on
 *                         the beginner form, which defaults to regular-classes)
 *        GA_MEASUREMENT_ID = G-...  (optional, with GA_API_SECRET: counts each
 *        GA_API_SECRET     = ...     submission in GA4 as `registration_submit`)
 *   2. Triggers (clock icon) > Add Trigger:
 *        function: onFormSubmit, event source: From form, type: On form submit.
 *   3. bookings@tangogarden.de must be a verified "Send mail as" alias on the
 *      account that owns this script, or GmailApp will reject the `from`.
 */

function onFormSubmit(e) {
  var props = PropertiesService.getScriptProperties();
  var WORKER_URL = props.getProperty('WORKER_URL');
  var SHARED_SECRET = props.getProperty('SHARED_SECRET');
  var COURSE_SLUG = props.getProperty('COURSE_SLUG') || 'regular-classes';

  // Every submission counts, even one the email step below cannot handle.
  trackSubmission_(props, COURSE_SLUG);

  var answers = extractAnswers_(e);
  if (!answers.email) {
    console.warn('No email address in submission; nothing sent.');
    return;
  }

  var res = UrlFetchApp.fetch(WORKER_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-tg-secret': SHARED_SECRET },
    payload: JSON.stringify({ name: answers.name, courseSlug: COURSE_SLUG }),
    muteHttpExceptions: true,
  });

  if (res.getResponseCode() !== 200) {
    console.error('Render Worker error ' + res.getResponseCode() + ': ' + res.getContentText('UTF-8'));
    return;
  }

  // getContentText() with no charset argument can mis-decode multi-byte
  // UTF-8 (emoji, four bytes each) even though the response declares
  // charset=utf-8; forcing 'UTF-8' here fixes it.
  var email = JSON.parse(res.getContentText('UTF-8'));

  var attachments = (email.attachments || []).map(function (a) {
    // text/calendar Blob so mail clients offer "Add to calendar".
    return Utilities.newBlob(a.content, 'text/calendar', a.filename);
  });

  GmailApp.sendEmail(answers.email, email.subject, plainTextFallback_(), {
    htmlBody: email.html,
    attachments: attachments,
    name: 'Tango Garden',
    from: 'bookings@tangogarden.de',
    replyTo: 'hello@tangogarden.de',
  });
}

/**
 * Pulls name/email out of the submit event. Matches question titles loosely so
 * it keeps working if the wording changes. Handles both trigger shapes:
 * form-bound (e.response, a FormResponse) and spreadsheet-bound (e.namedValues).
 */
function extractAnswers_(e) {
  var matches = function (title, terms) {
    title = String(title).toLowerCase();
    for (var t = 0; t < terms.length; t++) if (title.indexOf(terms[t]) !== -1) return true;
    return false;
  };
  var NAME = ['name', 'vorname'];
  var MAIL = ['email', 'e-mail', 'mail'];
  var name = '';
  var email = '';

  if (e && e.response && e.response.getItemResponses) {
    // Form-bound trigger: iterate the FormResponse item answers.
    var items = e.response.getItemResponses();
    for (var i = 0; i < items.length; i++) {
      var title = items[i].getItem().getTitle();
      var ans = String(items[i].getResponse() || '').trim();
      if (!ans) continue;
      if (!name && matches(title, NAME)) name = ans;
      if (!email && matches(title, MAIL)) email = ans;
    }
    // If "Collect email addresses" is on, the address is on the response itself.
    if (!email && e.response.getRespondentEmail) {
      email = String(e.response.getRespondentEmail() || '').trim();
    }
  } else if (e && e.namedValues) {
    // Spreadsheet-bound trigger: { 'Question title': ['answer'] }.
    var nv = e.namedValues;
    var keys = Object.keys(nv);
    for (var k = 0; k < keys.length; k++) {
      var val = nv[keys[k]] && nv[keys[k]][0];
      if (!val) continue;
      val = String(val).trim();
      if (!name && matches(keys[k], NAME)) name = val;
      if (!email && matches(keys[k], MAIL)) email = val;
    }
  }

  return { name: name, email: email };
}

/**
 * Sends a `registration_submit` event to GA4 (Measurement Protocol), carrying
 * only the course slug: no name, email or phone. Each submission gets a fresh
 * random client_id, so it is counted but not linked to a website visitor.
 * Skipped when the GA properties are not set; a failure is logged and never
 * stops the confirmation email.
 */
function trackSubmission_(props, courseSlug) {
  var measurementId = props.getProperty('GA_MEASUREMENT_ID');
  var apiSecret = props.getProperty('GA_API_SECRET');
  if (!measurementId || !apiSecret) return;
  // GA4 names a course by its page slug, the same value the website's
  // register_click event sends, so both steps of one course match.
  var course = { 'regular-classes': 'beginner-course' }[courseSlug] || courseSlug;
  try {
    var url = 'https://www.google-analytics.com/mp/collect'
      + '?measurement_id=' + encodeURIComponent(measurementId)
      + '&api_secret=' + encodeURIComponent(apiSecret);
    var now = Date.now();
    var res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        client_id: Math.floor(Math.random() * 2147483647) + '.' + Math.floor(now / 1000),
        events: [{
          name: 'registration_submit',
          // session_id + engagement_time_msec make the event show in Realtime.
          params: { course: course, session_id: String(now), engagement_time_msec: 1 },
        }],
      }),
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() >= 300) {
      console.warn('GA4 event not accepted: ' + res.getResponseCode());
    }
  } catch (err) {
    console.warn('GA4 event failed: ' + err);
  }
}

function plainTextFallback_() {
  return 'Your place is confirmed. This email is best viewed in a mail app that '
    + 'supports HTML. Questions? Just reply, or write to hello@tangogarden.de';
}
