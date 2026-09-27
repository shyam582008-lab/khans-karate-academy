document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const form = document.querySelector('#contactForm');
  document.querySelector('#year').textContent = new Date().getFullYear();
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  const senseiCard = document.querySelector('.sensei-card');
  const senseiProfile = document.querySelector('#senseiProfile');
  const profileClose = senseiProfile.querySelector('.profile-close');
  const openSenseiProfile = () => {
    senseiProfile.hidden = false;
    profileClose.focus();
    document.body.classList.add('modal-open');
  };
  const closeSenseiProfile = () => {
    senseiProfile.hidden = true;
    document.body.classList.remove('modal-open');
    senseiCard.focus();
  };
  senseiCard.addEventListener('click', openSenseiProfile);
  senseiCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openSenseiProfile();
    }
  });
  profileClose.addEventListener('click', closeSenseiProfile);
  senseiProfile.addEventListener('click', (event) => {
    if (event.target === senseiProfile) closeSenseiProfile();
  });
  const otherProfiles = [...document.querySelectorAll('.team-grid .member-card')]
    .filter((card) => card !== senseiCard);
  const instructorProfile = document.createElement('div');
  instructorProfile.id = 'instructorProfile';
  instructorProfile.className = 'profile-modal';
  instructorProfile.setAttribute('role', 'dialog');
  instructorProfile.setAttribute('aria-modal', 'true');
  instructorProfile.setAttribute('aria-labelledby', 'instructorProfileTitle');
  instructorProfile.hidden = true;
  instructorProfile.innerHTML = `
    <div class="profile-panel">
      <button class="profile-close" type="button" aria-label="Close instructor profile">×</button>
      <div class="profile-photo"></div>
      <div class="profile-content">
        <p class="kicker"><span></span> Instructor profile</p>
        <h2 id="instructorProfileTitle"></h2>
        <p class="profile-lead"></p>
        <p>Part of the Khan's Karate Academy instructor team. Contact the academy to learn more.</p>
        <a class="button button-red" href="#contact">Contact the academy <span>↗</span></a>
      </div>
    </div>`;
  document.body.append(instructorProfile);

  const instructorProfileClose = instructorProfile.querySelector('.profile-close');
  let activeInstructorCard;
  const openInstructorProfile = (card) => {
    activeInstructorCard = card;
    const name = card.querySelector('h3').textContent.trim();
    const role = card.querySelector('.member-info p').textContent
      .replace(/\s*·\s*View profile\s*↗?\s*$/, '').trim();
    const image = card.querySelector('img').cloneNode();
    image.alt = name;
    instructorProfile.querySelector('.profile-photo').replaceChildren(image);
    instructorProfile.querySelector('.kicker').lastChild.textContent = ` ${role}`;
    instructorProfile.querySelector('#instructorProfileTitle').textContent = name;
    instructorProfile.querySelector('.profile-lead').textContent = role;
    instructorProfile.querySelector('.profile-close').setAttribute('aria-label', `Close ${name} profile`);
    instructorProfile.hidden = false;
    document.body.classList.add('modal-open');
    instructorProfileClose.focus();
  };
  const closeInstructorProfile = () => {
    instructorProfile.hidden = true;
    document.body.classList.remove('modal-open');
    activeInstructorCard?.focus();
  };
  otherProfiles.forEach((card) => {
    const name = card.querySelector('h3').textContent.trim();
    const role = card.querySelector('.member-info p').textContent.trim();
    if (name.toUpperCase() === 'RISHIKANTH') {
      card.querySelector('img').src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80';
    }
    if (name.toUpperCase() === 'SHYAM') card.classList.add('shyam-card');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-controls', 'instructorProfile');
    card.setAttribute('aria-label', `View profile for ${name}`);
    card.querySelector('.member-info p').textContent = `${role} · View profile ↗`;
    card.addEventListener('click', () => openInstructorProfile(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openInstructorProfile(card);
      }
    });
  });
  instructorProfileClose.addEventListener('click', closeInstructorProfile);
  instructorProfile.addEventListener('click', (event) => {
    if (event.target === instructorProfile) closeInstructorProfile();
  });
  instructorProfile.querySelector('a[href="#contact"]').addEventListener('click', () => {
    instructorProfile.hidden = true;
    document.body.classList.remove('modal-open');
  });
  senseiProfile.querySelector('a[href="#contact"]').addEventListener('click', () => {
    senseiProfile.hidden = true;
    document.body.classList.remove('modal-open');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !senseiProfile.hidden) closeSenseiProfile();
    if (event.key === 'Escape' && !instructorProfile.hidden) closeInstructorProfile();
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  const fields = ['name', 'phone', 'email', 'age', 'message'].map((id) => document.getElementById(id));
  const showError = (field, message) => {
    field.closest('label').classList.add('has-error');
    field.closest('label').querySelector('.error-message').textContent = message;
  };
  const clearError = (field) => {
    field.closest('label').classList.remove('has-error');
    field.closest('label').querySelector('.error-message').textContent = '';
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    fields.forEach(clearError);
    const [name, phone, email, age, message] = fields;
    if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }
    if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 10) { showError(phone, 'Please enter a valid phone number.'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showError(email, 'Please enter a valid email.'); valid = false; }
    if (!age.value || Number(age.value) < 4 || Number(age.value) > 120) { showError(age, 'Please enter an age from 4 to 120.'); valid = false; }
    if (message.value.trim().length < 10) { showError(message, 'Please write at least 10 characters.'); valid = false; }
    if (valid) {
      form.reset();
      form.querySelector('.form-success').textContent = 'Thanks. We will be in touch soon.';
    }
  });
});
