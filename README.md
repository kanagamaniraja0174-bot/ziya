# Ziya Digital Solution — Website

A complete static website built with plain **HTML5, CSS3 and vanilla JavaScript**. No frameworks, no build tools, no paid libraries.

## Project structure

```
index.html        Home page
about.html        About Us
services.html     Services
portfolio.html    Portfolio (with category filters)
contact.html      Contact page + enquiry form
css/style.css     All styles (colours at the top)
js/script.js      Mobile menu, FAQ, filters, form, footer year
assets/images/    Logo and images
```

## 1. Download
Download the ZIP file and extract it to a folder on your computer.

## 2. Open in Visual Studio Code
Open VS Code → **File → Open Folder** → choose the extracted folder.

## 3. Editing
- **Text:** open any `.html` file and change the text between the tags.
- **Logo / images:** replace `assets/images/logo.jpeg` with your file (same name), or update the `src="..."` paths.
- **Colours:** edit the variables at the top of `css/style.css` (`--navy`, `--gold`, etc.).
- **Phone number:** search all files for `9751205260` and replace it (including the `tel:` and `wa.me/` links).
- **Email:** search for `info@ziyadigitalsolution.com` and replace it.
- **Social media:** add your real Instagram / Facebook / LinkedIn links in the footer "Contact" column of each page when ready.
- **Portfolio:** replace the sample concepts in `portfolio.html` with real projects. Keep the `data-category` value (`web`, `marketing`, `social`, `seo`, `branding`) so filters work.

## 4. Test locally
Double-click `index.html` to open it in your browser. For a live-reloading preview, install the **Live Server** extension in VS Code and click **Go Live**.

## 5. Publish for free (GitHub Pages)
1. Create a free account at github.com and create a new public repository.
2. Upload all files (keep `index.html` at the top level).
3. Go to **Settings → Pages**, choose branch `main` and folder `/ (root)`, then **Save**.
4. Your site will be live at `https://<username>.github.io/<repository>/` in a minute or two.
5. To use `ziyadigitalsolution.com`, add it under **Custom domain** and follow GitHub's DNS instructions.

Alternatives: Netlify or Cloudflare Pages — drag and drop the folder.

## 6. Make the enquiry form send emails
A static HTML form **cannot send emails by itself**. Right now, the form checks the inputs and asks visitors to call or WhatsApp instead — it never shows a fake success message.

Simple setup with **Formspree** (free plan available):
1. Sign up at https://formspree.io and create a form using `info@ziyadigitalsolution.com`.
2. Copy your endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `contact.html`, change `<form id="enquiry-form" novalidate>` to:
   `<form id="enquiry-form" action="https://formspree.io/f/abcdwxyz" method="POST" novalidate>`
4. In `js/script.js`, replace the "No backend connected yet" block with:

```js
fetch(form.action, {
  method: "POST",
  body: new FormData(form),
  headers: { Accept: "application/json" }
}).then(function (res) {
  if (res.ok) {
    status.textContent = "Thank you! Your enquiry has been sent.";
    status.className = "form-status";
    form.reset();
  } else {
    throw new Error();
  }
}).catch(function () {
  status.textContent = "Sorry, sending failed. Please call +91 9751205260 or use WhatsApp.";
  status.className = "form-status error";
});
```

Other options: Web3Forms, Getform, Netlify Forms, or your own backend.

## Notes
- No achievements, client numbers or reviews are shown. Add genuine ones only.
- Portfolio items are labelled as sample concepts until real work is added.
