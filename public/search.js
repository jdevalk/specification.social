(function () {
  const input = document.querySelector("#search-input");
  const container = document.querySelector("#search-results");
  if (!input || !container) return;
  let pagefind;
  async function run() {
    const query = input.value.trim();
    if (query.length < 2) {
      container.innerHTML = "<p>Type at least two characters.</p>";
      return;
    }
    container.innerHTML = "<p>Searching…</p>";
    try {
      pagefind ||= await import("/pagefind/pagefind.js");
      const search = await pagefind.search(query);
      const results = await Promise.all(
        search.results.slice(0, 20).map((result) => result.data()),
      );
      container.innerHTML = results.length
        ? results
            .map(
              (result) =>
                `<article class="constraint"><h2><a href="${result.url}">${result.meta.title}</a></h2><p>${result.excerpt}</p></article>`,
            )
            .join("")
        : "<p>No requirements found.</p>";
    } catch {
      container.innerHTML = "<p>Search is available in the built site.</p>";
    }
  }
  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(run, 180);
  });
  const query = new URLSearchParams(location.search).get("q");
  if (query) {
    input.value = query;
    run();
  }
})();
