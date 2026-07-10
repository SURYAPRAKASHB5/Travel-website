Partial loading approach (client-side)

- Place shared HTML in /partials/\*.html
- On each page, replace duplicate markup with a placeholder like:
  <div data-include="partials/header.html"></div>
- Add:
  <script src="js/include-partials.js"></script>

This keeps current UI/output identical while removing duplicate header/menu HTML.
