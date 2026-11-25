import sys, asyncio, os
from playwright.async_api import async_playwright

URL = "http://localhost:3000"
OUT = "/tmp/shots"
os.makedirs(OUT, exist_ok=True)

async def main(path="/", w=1440, h=900, steps=30, tag="d", step_px=800):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
        ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=1)
        page = await ctx.new_page()
        errs = []
        page.on("console", lambda m: errs.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
        page.on("pageerror", lambda e: errs.append(f"PAGEERROR: {e}"))
        await page.goto(URL + path, wait_until="load")
        if path == "/":
            for i, t in enumerate([500, 1200, 1500]):
                await page.wait_for_timeout(t)
                await page.screenshot(path=f"{OUT}/{tag}_pre{i}.png")
            await page.wait_for_timeout(3500)
        else:
            await page.wait_for_timeout(2500)
        await page.mouse.move(w / 2, h / 2)
        for i in range(steps):
            await page.screenshot(path=f"{OUT}/{tag}_{path.strip('/').replace('/','-') or 'home'}_{i:02d}.png")
            before = await page.evaluate("window.scrollY")
            await page.mouse.wheel(0, step_px)
            await page.wait_for_timeout(1300)
            after = await page.evaluate("window.scrollY")
            if after == before:
                break
        print("scrollY end", after, "docH", await page.evaluate("document.documentElement.scrollHeight"))
        print("\n".join(errs[:20]))
        await b.close()

if __name__ == "__main__":
    a = sys.argv
    asyncio.run(main(a[1], int(a[2]), int(a[3]), int(a[4]), a[5], int(a[6])))
