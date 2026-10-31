document.querySelectorAll('[data-menu]').forEach(button => {
  const nav = button.closest('header').querySelector('nav');
  nav.id ||= 'primary-navigation';
  button.setAttribute('aria-controls', nav.id);
  const close = () => { nav.classList.remove('open'); button.setAttribute('aria-expanded', 'false'); };
  button.addEventListener('click', () => button.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { close(); button.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('header')) close(); });
  matchMedia('(min-width: 761px)').addEventListener('change', close);
});
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll('form[data-demo]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('[data-status]').textContent = 'Thanks for trying the demo! Your inquiry looks good. No message was sent and your details have not been saved.';
  });
});
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.querySelector('#project-dialog');
    dialog.querySelector('h2').textContent = button.dataset.project;
    dialog.querySelector('[data-project-description]').textContent = button.dataset.description;
    dialog.showModal();
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const b = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom)) dialog.close();
  });
});
