/**
 * Apex Voyages - Header / Mobile Drawer Menu
 * Minimal, non-repetitive logic to control the mobile side drawer and dropdown accordions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggle || !navMenu) return;

  // If any other code ever adds click handlers to links in the header,
  // this small guard prevents the drawer logic from blocking navigation.
  const isPlanTripLink = (el) => {
    if (!(el instanceof Element)) return false;
    return !!el.closest('[data-apex-plan-trip], .btn-nav, a.btn-nav, a[href="#"], a');
  };


  const dropdownParents = Array.from(navMenu.querySelectorAll('.nav-item.has-dropdown'));

  const isOpen = () => navMenu.classList.contains('is-open');

  const setOpen = (open) => {
    toggle.classList.toggle('is-open', open);
    navMenu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';

    if (!open) {
      dropdownParents.forEach((p) => p.classList.remove('is-active'));
    }
  };

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!isOpen());
  });

  // Mobile accordion behavior: only on compact viewports
  const onDropdownToggle = (parent, e) => {
    if (window.innerWidth >= 1024) return;

    e.preventDefault();
    e.stopPropagation();

    // Toggle current parent; close others.
    const willOpen = !parent.classList.contains('is-active');
    dropdownParents.forEach((p) => p.classList.remove('is-active'));
    if (willOpen) parent.classList.add('is-active');
  };

  dropdownParents.forEach((parent) => {
    const link = parent.querySelector(':scope > .nav-link');
    if (!link) return;
    link.addEventListener('click', (e) => onDropdownToggle(parent, e));
  });

  // Close when tapping outside (works for both drawer + dropdown areas)
  const onDocumentPointerDown = (e) => {
    if (!isOpen()) return;

    const target = e.target;
    if (!(target instanceof Element)) return;

    if (navMenu.contains(target)) return;
    if (toggle.contains(target)) return;

    closeMenu();
  };
  document.addEventListener('click', onDocumentPointerDown);

  // Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Close if switching to desktop
  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth >= 1024 && isOpen()) closeMenu();
    },
    { passive: true }
  );

  // Close on click of a direct nav link (not dropdown toggles)
  navMenu.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('.nav-link');
    if (!link) return;

    // Never block simple navigation actions like "Plan Trip".
    if (isPlanTripLink(link) || isPlanTripLink(target)) return;

    const parent = link.closest('.nav-item.has-dropdown');
    if (!parent) closeMenu();
  });

});


