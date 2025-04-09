// ===== Extension Metadata =====
const extention = {
  name: "NovelBin",
  lang: "en",
  baseUrl: "https://novelbin.com",
  iconUrl: "https://www.google.com/s2/favicons?domain=novelbin.com",
  type: "single",
  target: "novel",
  version: "1.0.0",

  // ===== Parsing Functions =====
  // 1. Fetch popular novels
  popularNovels: async function(page) {
    const res = await fetch(`${this.baseUrl}/popular?page=${page}`);
    const html = await res.text();
    
    // Parse HTML (example using cheerio-like logic)
    const novels = [];
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll(".novel-item").forEach((item) => {
      novels.push({
        title: item.querySelector("h3").textContent.trim(),
        url: item.querySelector("a").href,
        cover: item.querySelector("img")?.src,
      });
    });
    return novels;
  },

  // 2. Fetch novel details (chapters, summary)
  parseNovel: async function(novelUrl) {
    const res = await fetch(novelUrl);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return {
      title: doc.querySelector("h1").textContent,
      author: doc.querySelector(".author").textContent,
      summary: doc.querySelector(".summary").textContent,
      chapters: Array.from(doc.querySelectorAll(".chapter-list li")).map((ch) => ({
        title: ch.textContent,
        url: ch.querySelector("a").href,
      })),
    };
  },

  // 3. Fetch chapter content
  parseChapter: async function(chapterUrl) {
    const res = await fetch(chapterUrl);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector(".chapter-content").innerHTML;
  },
};

// ===== Required Export =====
typeof exports !== 'undefined' ? exports.extention = extention : null;
