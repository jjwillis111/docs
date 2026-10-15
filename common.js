// Shared helpers for index.html and add.html
(function () {
  // Display-only styling layered on top of the stored Word HTML.
  // It is added when showing a document, never to what gets copied.
  const VIEW_CSS =
    '<style id="docshare-view">' +
    "html{background:#e7e4dd !important}" +
    "body{background:#fff !important;color:#000;max-width:8.5in;margin:20px auto !important;" +
    "padding:1in !important;box-sizing:border-box;box-shadow:0 1px 3px rgba(0,0,0,.12),0 4px 14px rgba(0,0,0,.06);" +
    "overflow-wrap:break-word}" +
    "img{max-width:100%;height:auto}" +
    "table{max-width:100%}" +
    "@media (max-width:700px){body{margin:0 !important;padding:22px 18px !important;box-shadow:none}}" +
    "</style>";

  function viewHtml(stored) {
    if (/<\/head>/i.test(stored)) return stored.replace(/<\/head>/i, VIEW_CSS + "</head>");
    return VIEW_CSS + stored;
  }

  // Readable plain-text version for apps that don't accept formatting
  function plainText(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("style,script,head,title,meta,xml").forEach(n => n.remove());
    doc.querySelectorAll("br").forEach(n => n.replaceWith("\n"));
    doc.querySelectorAll("p,div,h1,h2,h3,h4,h5,h6,li,tr,blockquote").forEach(n => n.append("\n"));
    doc.querySelectorAll("td,th").forEach(n => n.append("\t"));
    const t = (doc.body ? doc.body.textContent : "").replace(/ /g, " ");
    return t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  // Puts the exact stored HTML on the clipboard. A copy-event handler writes the
  // bytes unchanged, which keeps Word's own markup (styles, footnote links) intact.
  async function copyRich(html, text) {
    let wrote = false;
    const onCopy = e => {
      e.clipboardData.setData("text/html", html);
      e.clipboardData.setData("text/plain", text);
      e.preventDefault();
      wrote = true;
    };
    const ta = document.createElement("textarea");
    ta.value = " ";
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
    document.body.appendChild(ta);
    const prevFocus = document.activeElement;
    ta.select();
    document.addEventListener("copy", onCopy);
    try { document.execCommand("copy"); } catch (e) { /* fall through */ }
    document.removeEventListener("copy", onCopy);
    ta.remove();
    if (prevFocus && prevFocus.focus) prevFocus.focus();
    if (wrote) return true;
    // Fallback: async clipboard (some browsers tidy the HTML a little on this path)
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      })]);
      return true;
    }
    return false;
  }

  function toast(msg, ms) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), ms || 2400);
  }

  function utf8ToB64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  }
  function b64ToUtf8(b64) {
    const bin = atob(b64.replace(/\s/g, ""));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  window.DocShare = { viewHtml, plainText, copyRich, toast, utf8ToB64, b64ToUtf8 };
})();
