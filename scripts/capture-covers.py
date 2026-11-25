"""Capture live project screenshots used as work covers.

Usage: python3 scripts/capture-covers.py
Requires: pip install playwright pillow && python3 -m playwright install chromium
"""
import asyncio
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parent.parent / "public" / "work"

SITES = {
    "rafiq": "https://rafiq-tech.vercel.app/",
    "it-sum": "https://it-sum-seven.vercel.app/",
    "trackup": "https://trakeup.vercel.app/",
}


async def shoot(browser, slug: str, url: str) -> None:
    page = await browser.new_page(viewport={"width": 1440, "height": 960}, device_scale_factor=1)
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
    except Exception as exc:  # noqa: BLE001
        print(f"[warn] {slug}: {exc}")
    await page.wait_for_timeout(4500)
    png = OUT / f"{slug}.png"
    await page.screenshot(path=str(png))
    Image.open(png).convert("RGB").save(OUT / f"{slug}.webp", "WEBP", quality=82)
    png.unlink()
    print(f"[ok] {slug}")
    await page.close()


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        await asyncio.gather(*(shoot(browser, s, u) for s, u in SITES.items()))
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
