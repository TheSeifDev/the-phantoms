import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center">
      <span className="jp pointer-events-none absolute select-none text-[min(70vw,40rem)] leading-none text-fg/[0.04]">消</span>
      <div className="relative">
        <div className="font-display text-[clamp(6rem,22vw,18rem)] font-extrabold leading-[0.85] tracking-[-0.06em]">
          4<span className="text-red">0</span>4
        </div>
        <p className="mt-4 text-xl">This page vanished like a phantom.</p>
        <p className="ar mt-1 text-lg text-muted">الصفحة دي اختفت.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/">Back home</Button>
        </div>
      </div>
    </section>
  );
}
