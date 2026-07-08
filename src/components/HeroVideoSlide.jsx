import BulletList from "../components/BulletList";
import MetricsGrid from "../components/MetricsGrid";

export default function HeroVideoSlide({ slide }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="rounded-xl border-4 border-white shadow-[8px_8px_0_0_rgba(255,255,255,0.3)] overflow-hidden bg-black">
        <video
          src={slide.video}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="w-full h-full max-h-[26rem] object-cover"
        />
      </div>

      <div className="space-y-6">
        {slide.bullets?.length > 0 && <BulletList bullets={slide.bullets} />}
        {slide.metrics?.length > 0 && <MetricsGrid metrics={slide.metrics} />}
      </div>
    </div>
  );
}