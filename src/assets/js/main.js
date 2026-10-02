// Inline SVG icon markup (no icon font — self-contained, no external request).
const ICON_COPY =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const ICON_CHECK =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

// Reading progress bar — only present on article pages (see base.njk).
(function () {
  const bar = document.getElementById("reading-progress");
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();

// Share button on article pages — Web Share API where available, clipboard fallback.
(function () {
  const btn = document.querySelector("[data-share-btn]");
  if (!btn) return;

  const label = btn.querySelector(".share-label");
  const original = label ? label.textContent : "";

  btn.addEventListener("click", async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        // User dismissed the share sheet, or it's unavailable — fall back to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    if (label) {
      label.textContent = "Link copied";
      setTimeout(() => {
        label.textContent = original;
      }, 1800);
    }
  });
})();

// Copy-to-clipboard button for code blocks in article content.
(function () {
  const blocks = document.querySelectorAll(".prose pre");
  if (!blocks.length) return;

  blocks.forEach((pre) => {
    // Wrap the <pre> so the button can be positioned relative to it.
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-btn";
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.innerHTML = ICON_COPY;

    wrapper.appendChild(button);

    button.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      const text = code ? code.innerText : pre.innerText;

      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        // Fallback for browsers without Clipboard API access (rare, e.g. insecure context)
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      button.innerHTML = ICON_CHECK;
      button.classList.add("copied");
      button.setAttribute("aria-label", "Copied");
      setTimeout(() => {
        button.innerHTML = ICON_COPY;
        button.classList.remove("copied");
        button.setAttribute("aria-label", "Copy code to clipboard");
      }, 1800);
    });
  });
})();
