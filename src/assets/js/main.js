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
    button.textContent = "copy";
    button.setAttribute("aria-label", "Copy code to clipboard");
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

      button.textContent = "copied";
      button.classList.add("copied");
      setTimeout(() => {
        button.textContent = "copy";
        button.classList.remove("copied");
      }, 1800);
    });
  });
})();
