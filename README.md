# Bright Minds Maths Grinds — Website

A single-page, static lead-generation website for a maths grinds (tutoring) business. Plain HTML/CSS/JS, no build step, no framework.

## File Structure

```
/
├── index.html      Page markup (all sections)
├── styles.css      Design system + layout + responsive rules
├── script.js       Mobile nav toggle, smooth scroll, FAQ accordion, form validation + Formspree AJAX submit
├── /images         Favicon + placeholder image references (hero/about images currently load from placehold.co)
└── README.md       This file
```

Open `index.html` directly in a browser, or serve the folder with any static file server — no build tools required.

## 1. Set Up Formspree (required before the form will work)

The Expression of Interest form currently points at a placeholder Formspree endpoint. To make it live:

1. Go to [formspree.io](https://formspree.io) and create a free account (50 submissions/month on the free tier).
2. Create a new form and copy its **form ID** (looks like `xxxxaaaa` in `https://formspree.io/f/xxxxaaaa`).
3. Open `index.html` and find the form tag (search for `YOUR_FORM_ID`):

   ```html
   <form id="enquiryForm" class="enquiry-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```

4. Replace `YOUR_FORM_ID` with your real form ID.
5. Submit a test enquiry through the live page — Formspree will ask you to confirm the first submission by email before it starts forwarding leads.

The form already includes a hidden honeypot field (`_gotcha`) for basic spam protection, which Formspree recognizes natively — no extra config needed.

## 2. Replace Placeholder Content

All business details, copy, and images are placeholders so they're easy to find and swap out. Search `index.html` for `[PLACEHOLDER` (in HTML comments) to find every spot that needs real content, including:

- Business name ("Bright Minds Maths Grinds") — appears in the header logo, footer, and page `<title>`
- Phone number, email address, and service area (footer)
- Tutor bio (About section)
- Testimonial quotes and names
- Pricing details in the FAQ ("How much do grinds cost?")
- Social media links (footer)
- Trust stat in the hero ("Over 200 students helped since 2019")

## 3. Replace Placeholder Images

Images currently use [placehold.co](https://placehold.co) placeholder URLs so the layout renders without any real assets:

- Hero image (`index.html`, hero section)
- Tutor photo (`index.html`, About section)

Drop real images into `/images` and update the corresponding `src` attributes in `index.html`. Recommended sizes:

- Hero image: ~560×420px (or similar aspect ratio)
- Tutor photo: ~480×480px (square)

The favicon (`images/favicon.svg`) is a simple placeholder — swap it for a real logo mark when available.

## 4. Deploy

Any static host works — no server-side code or database required:

- **Netlify / Vercel**: drag-and-drop the folder, or connect the git repo for automatic deploys.
- **GitHub Pages**: push to a repo and enable Pages on the branch.

## Post-Build Checklist

- [ ] Page renders correctly on mobile and desktop widths
- [ ] All nav anchor links scroll to the correct section
- [ ] Form validates required fields and email format client-side
- [ ] Formspree form ID replaced and form submits successfully with a success message
- [ ] Placeholder business name, contact details, testimonials, and images replaced
- [ ] Favicon and page title/meta description reviewed
- [ ] No console errors
