/**
 * Surveil Technologies — site script
 * 1. Mobile navigation toggle
 * 2. Contact form: validation, submission, and honest status messages
 * No dependencies. No credentials: the form only posts to a public endpoint URL.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. Mobile navigation                                               */
  /* ------------------------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) setNav(false);
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Contact form                                                    */
  /* ------------------------------------------------------------------ */
  var form = document.getElementById('request-form');
  if (!form) return;

  var endpoint = (form.getAttribute('data-endpoint') || '').trim();
  var statusEl = document.getElementById('form-status');
  var summary = document.getElementById('form-summary');
  var success = document.getElementById('form-success');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.querySelector('.btn-label');
  var sending = false;

  // Adjust heading and preselect a service from the link that brought the visitor here.
  var params = new URLSearchParams(window.location.search);
  var heading = document.querySelector('[data-request-heading]');
  if (params.get('request') === 'project') {
    if (heading) heading.textContent = 'Discuss Your Project';
    document.getElementById('requestType').value = 'Project discussion';
    document.title = document.title.replace('Request a Site Walk', 'Discuss Your Project');
  }
  var serviceParam = params.get('service');
  if (serviceParam) {
    var opt = form.querySelector('#service option[data-id="' + serviceParam.replace(/[^a-z0-9-]/gi, '') + '"]');
    if (opt) opt.selected = true;
  }

  var labels = {
    name: 'Name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    location: 'Project location',
    service: 'Service needed',
    timeline: 'Project timeline',
    description: 'Project description',
  };
  var fieldIds = Object.keys(labels);
  var touched = {};

  function value(id) {
    return (form.elements[id].value || '').trim();
  }

  function validateField(id) {
    var v = value(id);
    switch (id) {
      case 'name':
      case 'company':
      case 'location':
        return v ? '' : 'Enter your ' + labels[id].toLowerCase() + '.';
      case 'email':
        if (!v) return 'Enter your email address.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter an email address in the format name@company.com.';
      case 'phone':
        if (!v) return '';
        return v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with area code, or leave this blank.';
      case 'service':
        return v ? '' : 'Select the service you need.';
      case 'timeline':
        return v ? '' : 'Select a project timeline.';
      case 'description':
        if (!v) return 'Describe your project.';
        return v.length >= 20 ? '' : 'Add a little more detail (at least 20 characters).';
    }
    return '';
  }

  function showError(id, message) {
    var input = form.elements[id];
    var err = document.getElementById(id + '-error');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      err.textContent = message;
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      err.textContent = '';
      err.hidden = true;
    }
  }

  fieldIds.forEach(function (id) {
    var input = form.elements[id];
    input.addEventListener('blur', function () {
      touched[id] = true;
      if (value(id) || id === 'phone') showError(id, validateField(id));
    });
    input.addEventListener('input', function () {
      if (touched[id] && input.getAttribute('aria-invalid') === 'true') showError(id, validateField(id));
    });
    input.addEventListener('change', function () {
      if (input.tagName === 'SELECT') showError(id, validateField(id));
    });
  });

  function showSummary(errors) {
    var list = summary.querySelector('ul');
    list.innerHTML = '';
    errors.forEach(function (e) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + e.id;
      a.textContent = e.message;
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        form.elements[e.id].focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    summary.hidden = false;
    summary.focus();
  }

  function contactFallbackHTML() {
    var email = form.getAttribute('data-contact-email');
    var phone = form.getAttribute('data-contact-phone');
    var tel = form.getAttribute('data-contact-tel');
    var parts = [];
    if (phone) parts.push('call <a href="tel:' + tel + '">' + phone + '</a>');
    if (email) parts.push('email <a href="mailto:' + email + '">' + email + '</a>');
    return parts.length ? ' You can also ' + parts.join(' or ') + '.' : '';
  }

  function setStatus(kind, html) {
    statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
    statusEl.innerHTML = html || '';
  }

  function setSending(on) {
    sending = on;
    submitBtn.disabled = on;
    submitLabel.textContent = on ? 'Sending…' : 'Send Request';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;

    setStatus('', '');
    var errors = [];
    fieldIds.forEach(function (id) {
      touched[id] = true;
      var msg = validateField(id);
      showError(id, msg);
      if (msg) errors.push({ id: id, message: msg });
    });
    if (errors.length) {
      showSummary(errors);
      return;
    }
    summary.hidden = true;

    if (!endpoint) {
      setStatus(
        'error',
        'Your message was <strong>not sent</strong>. The online form has not been connected yet.' + contactFallbackHTML(),
      );
      statusEl.setAttribute('tabindex', '-1');
      statusEl.focus();
      return;
    }

    var payload = { requestType: form.elements.requestType.value, website: form.elements.website.value };
    fieldIds.forEach(function (id) {
      payload[id] = value(id);
    });
    // Formspree: email subject line, and its spam trap reads `_gotcha`.
    payload._subject = 'Website: ' + payload.requestType + (payload.name ? ' from ' + payload.name : '');
    payload._gotcha = payload.website;

    setSending(true);
    setStatus('pending', 'Sending your request…');

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) controller.abort();
    }, 20000);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (res) {
        return res
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            return { res: res, data: data };
          });
      })
      .then(function (r) {
        clearTimeout(timer);
        // Only a 2xx response that explicitly says ok counts as success.
        if (r.res.ok && r.data && r.data.ok === true) {
          form.hidden = true;
          success.hidden = false;
          success.focus({ preventScroll: true });
          success.scrollIntoView({ block: 'start' });
          return;
        }
        setSending(false);
        if (r.res.status === 400 && r.data && r.data.errors) {
          var list = [];
          Object.keys(r.data.errors).forEach(function (id) {
            if (form.elements[id]) {
              showError(id, r.data.errors[id]);
              list.push({ id: id, message: r.data.errors[id] });
            }
          });
          setStatus('', '');
          if (list.length) return showSummary(list);
        }
        failed(r.res.status === 429 ? 'Too many requests were sent in a short time. Please wait a minute and try again.' : null);
      })
      .catch(function () {
        clearTimeout(timer);
        setSending(false);
        failed(null);
      });
  });

  function failed(reason) {
    setStatus(
      'error',
      'Your message was <strong>not sent</strong>. ' +
        (reason || 'Something went wrong on our end or with the connection. Your entries are still here, so please try again.') +
        contactFallbackHTML(),
    );
    statusEl.setAttribute('tabindex', '-1');
    statusEl.focus();
  }
})();
