import { CanvasImage } from "remotion";
import {
  Art,
  Base,
  Brow,
  k,
  lin,
  Note,
  P,
  Surface,
  SurfaceHeader,
  useTime,
  Word,
} from "../design";

export const CreationMorph = () => {
  const t = useTime();
  const image = k(t, 0.65, 1.7);
  const video = k(t, 2.8, 3.65);
  const voiceProgress = lin(t, 4.8, 5.8);
  const voice = voiceProgress * voiceProgress * (3 - 2 * voiceProgress);
  const drift = lin(t, 1.7, 5.5);
  const end = lin(t, 6.75, 7);
  const width = 720 + video * 220;
  const height = 820 - video * 150;
  const artTop = 600 + video * 80;
  return (
    <Base
      style={{
        background: `rgb(${5 + end * 229},${7 + end * 240},${10 + end * 242})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: image * (1 - voice) * 0.38,
          filter: "blur(55px)",
          scale: 1.3,
        }}
      >
        <CanvasImage
          src={Art()}
          style={{ width: 1080, height: 1920, objectFit: "cover" }}
        />
      </div>
      <Brow style={{ left: 74, top: 125 }}>ONE IDEA. EVERY DIRECTION.</Brow>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 225,
          opacity: 1 - k(t, 1.15, 1.8),
        }}
      >
        <Word t={t} size={154}>
          Imagine
        </Word>
        <Word t={t} at={0.1} size={181} color={P.cyan}>
          more.
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          left: 65,
          top: 238,
          fontSize: 153,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: -10,
          opacity: k(t, 1.15, 1.8),
          transform: `translateX(${k(t, 1.15, 1.7, 150, 0)}px)`,
        }}
      >
        {t < 3.1 ? "Make it" : "Bring it"}
        <br />
        <span style={{ color: P.cyan }}>
          {t < 3.1 ? "visible." : t < 5 ? "to life." : "to voice."}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 860,
          width: 940,
          opacity: 1 - image,
          transform: `scale(${1 + image * 0.15}) translateY(${-image * 100}px)`,
        }}
      >
        <Surface>
          <SurfaceHeader title="Models Suite" />
          <div style={{ padding: 40, fontSize: 43, lineHeight: 1.3 }}>
            Your ideas. One workspace.
          </div>
          <div style={{ padding: "0 40px 35px", fontSize: 27, color: P.cyan }}>
            Ask anything… <span style={{ float: "right" }}>↗</span>
          </div>
        </Surface>
      </div>
      <div
        style={{
          position: "absolute",
          left: (1080 - width) / 2,
          top: artTop,
          width,
          height,
          opacity: image * (1 - k(t, 5.5, 5.8)),
          transform: `perspective(1600px) translate3d(${Math.sin(drift * Math.PI) * 12}px,${-drift * 12}px,0) rotateX(${Math.sin(drift * Math.PI) * 2.5}deg) rotateY(${k(t, 0.65, 1.9, 32, 0) + video * -3 + Math.sin(drift * Math.PI * 1.4) * 2}deg) rotateZ(${k(t, 0.65, 1.9, -8, 0) + video * 2}deg) scale(${k(t, 0.65, 1.65, 0.45, 1)})`,
          borderRadius: 38,
          border: "1px solid #C3E8FF66",
          overflow: "hidden",
          boxShadow: "0 60px 160px #0009",
        }}
      >
        <CanvasImage
          src={Art()}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${1.065 + video * 0.15}) translate(${-Math.sin(drift * Math.PI) * 16}px,${-drift * 22}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              `linear-gradient(${130 + drift * 15}deg,#FFFFFF28,transparent 25%,transparent 72%,#8FA7FF22)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            fontSize: 25,
            letterSpacing: 3,
            color: P.white,
            background: "#05070AB8",
            borderRadius: 50,
            padding: "10px 18px",
          }}
        >
          {video > 0.5 ? "MOTION CONCEPT" : "ORIGINAL CAMPAIGN ART"}
        </div>
        {video > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              bottom: 30,
              opacity: video,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ fontSize: 29 }}>Ⅱ</span>
            <div style={{ height: 4, flex: 1, background: "#FFFFFF44" }}>
              <div
                style={{
                  width: `${lin(t, 3.3, 5.1) * 100}%`,
                  height: "100%",
                  background: P.cyan,
                }}
              />
            </div>
            <span style={{ fontSize: 26 }}>00:05</span>
          </div>
        ) : null}
      </div>
      {voice > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 150,
            top: artTop,
            width: 780,
            height: 780,
            perspective: 1200,
          }}
        >
          {Array.from({ length: 78 }, (_, i) => {
            const barHeight =
              45 +
              Math.abs(Math.sin(i * 0.48 + t * 4.5)) *
                235 *
                Math.sin(((i + 1) / 79) * Math.PI);
            const h = 780 + (barHeight - 780) * voice;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: i * 10,
                  top: (780 - h) / 2,
                  width: 7 + 3 * (1 - voice),
                  height: h,
                  borderRadius: voice * 8,
                  backgroundImage: `linear-gradient(${voice > 0.8 ? P.cyan + "DD" : "transparent"},${voice > 0.8 ? P.violet + "DD" : "transparent"}),url(${Art()})`,
                  backgroundSize: `780px 1040px`,
                  backgroundPosition: `${-i * 10}px center`,
                  transform: `translateY(${Math.sin(i * 0.25) * voice * 9}px) rotateX(${voice * 5}deg)`,
                  opacity: 1 - end,
                }}
              />
            );
          })}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 75,
          right: 85,
          top: 1430,
          display: "flex",
          gap: 28,
          fontSize: 39,
          fontWeight: 650,
          letterSpacing: -1,
          color: "#829AAE",
        }}
      >
        {["Chat", "Image", "Video", "Voice"].map((name, i) => {
          const active = i === (t < 1.3 ? 0 : t < 3.1 ? 1 : t < 5 ? 2 : 3);
          return (
            <div
              key={name}
              style={{
                color: active ? P.cyan : undefined,
                transform: `translateY(${active ? -12 : 0}px)`,
              }}
            >
              {name}
              {i < 3 ? (
                <span style={{ marginLeft: 25, opacity: 0.45 }}>→</span>
              ) : null}
            </div>
          );
        })}
      </div>
      <Note style={{ bottom: 320, right: 180, fontSize: 29 }}>
        Illustrative creative concept · not a Models Suite generation
      </Note>
    </Base>
  );
};
