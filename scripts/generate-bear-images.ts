import fs from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/chromium",
  // devtools: true,
});

interface Emoji {
  id: string;
  ref: string;
  src: string;
}

async function getEmojis(url: string): Promise<Emoji[]> {
  console.log("Visiting", url);
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "commit" });
  const selector = "css=[class*=emoji-version]";
  await page.waitForSelector(selector);

  return page.locator(selector).evaluateAll((emojis) =>
    emojis
      .map((emoji) => {
        const url = new URL(
          emoji.getAttribute("href") ?? "",
          window.location.origin,
        );

        return {
          id: url.pathname.slice(1),
          ref: url.href,
          src: emoji.querySelector("img")?.getAttribute("src"),
        };
      })
      .filter((emoji): emoji is Emoji => !!emoji.ref && !!emoji.src),
  );
}

const urls = [
  "https://emojipedia.org/bear#designs",
  "https://emojipedia.org/polar-bear#designs",
  "https://emojipedia.org/panda#designs",
  "https://emojipedia.org/teddy-bear#designs",
];

const data = (await Promise.all(urls.map(getEmojis)))
  .flat()
  .toSorted((a, z) => a.id.localeCompare(z.id));

await fs.writeFile(
  __dirname + "/../assets/bear-images.json",
  JSON.stringify(data, null, 2),
);

await browser.close();
