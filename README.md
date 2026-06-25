# Gwinnett & Beyond Weekly Newsletter Builder

The finished email is `dist/newsletter.html`. `index.html` is an identical browser-preview copy.

## Build this week's newsletter

1. Open `newsletter-data.json`.
2. Replace the weekly text, links, and image URLs.
3. Set `quiz.include` to `true` only for the first issue of a month.
4. Advance `themeIndex` and `footerImageIndex` by one. Both indexes start at `0`; they wrap automatically.
5. Double-click `build-newsletter.cmd`. If Node.js is already installed, you can instead run `node generate.js`.

The generator creates:

- `dist/newsletter.html` as the latest issue
- A separately dated HTML file such as `dist/gwinnett-and-beyond-wednesday-july-15-2026.html`
- `index.html` as the local browser preview

Each dated HTML file is a complete standalone email file beginning with `<!DOCTYPE html>` and can be retained as the permanent archive or uploaded to Command.

## Cloudinary image hosting

`upload-cloudinary.js` uploads the five footer images and the current cartoon, then writes their public HTTPS URLs into `newsletter-data.json`.

Only the Cloud Name and an **unsigned upload preset** are used. API keys and API secrets are not stored in this project.

## Rotation indexes

Background themes:

- `0` Light Blue
- `1` Soft Peach
- `2` Pale Green
- `3` Soft Lavender
- `4` Light Cream

The five Around Gwinnett footer designs rotate automatically:

- Issue 1: footer 1
- Issue 2: footer 2
- Issue 3: footer 3
- Issue 4: footer 4
- Issue 5: footer 5
- Issue 6: footer 1 again

Set `footerImageIndex` to `0` through `4`; the generator wraps the rotation automatically. Local image paths support the browser preview. Before sending email, replace them with public hosted image URLs.

## Copy into Keller Williams Command

1. Generate the newsletter.
2. Open `dist/newsletter.html` in a plain-text editor and select all.
3. Copy only the HTML, beginning with `<!DOCTYPE html>`.
4. Paste it into Command's HTML/source editor.
5. Confirm the cartoon and footer image URLs are hosted and publicly accessible.
6. Remove the orange market verification reminder only after checking the May 2026 references.
7. Verify the event page, date, time, location, buttons, brokerage address, and unsubscribe footer.
8. Send a test to Danny and check it on desktop and mobile before scheduling Wednesday at 12:00 PM.

## Quiz tracking

Track replies in a sheet with: Date, Name, Email, Answer, Correct?, Winner?, Follow-Up Needed?

## Permanent market coverage

The newsletter's primary market is **Gwinnett County, Georgia**.

The surrounding research area includes:

- Barrow County
- Walton County
- Rockdale County
- DeKalb County
- Jackson County

Research should lead with Gwinnett and use the surrounding counties when they provide a useful comparison, local story, event, homeowner issue, or referral opportunity. It is not necessary to mention all six counties every week.

The detailed source hierarchy, preferred metrics, and research rules are stored in `market-research-config.json`.
