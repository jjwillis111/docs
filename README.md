# Shared Documents

A static site for sharing Word documents without file downloads. You paste a document in from Word; readers see it on the site and press Copy to paste the whole thing, formatting and footnotes included, into their own Word.

How it works: when you copy from Word, Word puts a formatted (HTML) version of the document on the clipboard. The add page captures that exact data and saves it to this repository. The Copy button on the site puts the identical data back on the reader's clipboard, so Word receives the same thing it would from a direct copy and paste.

## Files

```
index.html       the public site
add.html         your page for pasting and publishing documents
common.js        shared code
site.css         shared styling
documents.json   the list of published documents (managed by add.html)
docs/            the stored documents (managed by add.html)
.nojekyll        tells GitHub Pages to serve files as-is
```

## One-time setup

1. Create a public repository on GitHub and upload everything in this folder (the files themselves, not the enclosing folder).
2. Turn on Pages: Settings, then Pages, then Source "Deploy from a branch," branch `main`, folder `/ (root)`, Save. The site will be at `https://<username>.github.io/<repo>/`.
3. Create a token so the add page can save to the repository:
   1. On GitHub: your profile picture, then Settings, then Developer settings (bottom of the left sidebar), then Personal access tokens, then Fine-grained tokens, then Generate new token.
   2. Name it, pick an expiration, choose "Only select repositories," and select this repository.
   3. Under Permissions, set Contents to "Read and write."
   4. Generate it and copy it right away (GitHub shows it once).
4. Open `https://<username>.github.io/<repo>/add.html`, expand "GitHub connection," paste the token (your username and repository name fill in automatically), and click Connect. The browser remembers it, so you only do this once per computer.

## Adding a document

1. In the Word desktop app, press Ctrl+A then Ctrl+C (Mac: Cmd+A, Cmd+C).
2. On the add page, in Chrome, Edge, or Firefox, click the paste box and press Ctrl+V (Mac: Cmd+V).
3. Check the word and footnote counts and the preview, set the title, and click Publish to site.
4. Click "Test the Copy button," paste into a blank Word document, and confirm it came through as expected.

The site updates a minute or two after publishing. Publishing again with the same title replaces that document. The list at the bottom of the add page lets you remove documents.

Each document has its own link: add `#doc=0` to the site address for the first, `#doc=1` for the second, and so on.

## Without a token

If you'd rather not create a token, click "Download file instead" after pasting. Upload that file into the `docs` folder on GitHub, then edit `documents.json` and add the entry the page shows you.

## Things to know

1. **Use the Word desktop app** for copying, and Chrome, Edge, or Firefox for pasting. Word on the web and Safari may not pass along the full formatting.
2. **Images** in a document won't carry over, because Word's clipboard data points to files on your computer. Text, styles, and footnotes are unaffected.
3. **Footnotes** show on the site as numbered links with the notes collected at the end. How Word rebuilds them on paste depends on the reader's Word version; test with your first document.
4. **Privacy**: everything published is public, including to anyone who looks through the repository. The add page is publicly reachable but cannot change anything without your token, which is stored only in your browser.
5. **Token safety**: never paste the token anywhere but the add page. If it leaks, delete it on GitHub and create a new one.
