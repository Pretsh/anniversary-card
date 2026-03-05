import { useState, useEffect, useRef } from "react";

const poeticLines = [
  "Some loves are written quietly,",
  "not in grand gestures, but in years of standing by each other.",
  "Yours is that rare kind of love…",
  "the kind that grows deeper with every passing season.",
];

const photos = [
  "/photos/photo1.jpg",
  "/photos/photo2.jpg",
  "/photos/photo3.jpg",
  "/photos/photo4.jpg",
  "/photos/photo5.jpg",
  "/photos/photo6.jpg",
  "/photos/photo7.jpg",
  "/photos/photo8.jpg",
  "/photos/photo9.jpg",
  "/photos/photo10.jpg",
];

const messageLines = [
  { b: false, t: "To my Pyaari Mauci and Chachaji," },
  { b: false, t: "" },
  { b: false, t: "Some love stories feel like they belong in books or on a movie screen. Yours is one of them." },
  { b: false, t: "I've had the privilege of watching your story unfold since my childhood — filling every gathering with warmth, laughter, and a kind of love that quietly shaped how all of us understood what a true partnership looks like." },
  { b: false, t: "" },
  { b: true,  t: "Chachaji, your heart chose Mauci. And when you chose her, you chose her fully." },
  { b: false, t: "" },
  { b: false, t: "The road was not easy. There were pressures, questions, resistance. But you never wavered. Your faith in the love you shared stayed strong — and it led you exactly where it was meant to." },
  { b: false, t: "" },
  { b: false, t: "What makes your story so special isn't just how it began, but how beautifully it has continued. Year after year, you have nurtured your relationship with love, patience, care, and unwavering trust." },
  { b: false, t: "" },
  { b: true,  t: "Real love is not just about finding the right person — it is about choosing them again and again." },
  { b: false, t: "" },
  { b: false, t: "I am so proud to call you both mine. You've set an example that all of us cherish." },
  { b: false, t: "" },
  { b: true,  t: "Happy Anniversary to a truly special couple!! 💛" },
  { b: false, t: "May your story continue to be as beautiful as it has always been." },
];

export default function AnniversaryCard() {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [fade, setFade] = useState(true);
  const [showPoetic, setShowPoetic] = useState(false);
  const [pIdx, setPIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const timer = useRef(null);
  const startTimeRef = useRef(0);
  const offsetRef = useRef(0);
  const audioBufferRef = useRef(null);

  // Load audio from public folder
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctxRef.current = ctx;
        gainRef.current = ctx.createGain();
        gainRef.current.connect(ctx.destination);
        const res = await fetch("/music/fana.mp3");
        const arrayBuffer = await res.arrayBuffer();
        audioBufferRef.current = await ctx.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.error("Audio load error:", err);
      }
    };
    loadAudio();
  }, []);

  const startMusic = (fromOffset = 0) => {
    if (!audioBufferRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    if (sourceRef.current) { try { sourceRef.current.stop(); } catch (e) {} }
    const source = ctx.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.loop = true;
    source.connect(gainRef.current);
    gainRef.current.gain.value = muted ? 0 : 0.85;
    source.start(0, fromOffset % audioBufferRef.current.duration);
    sourceRef.current = source;
    startTimeRef.current = ctx.currentTime - fromOffset;
    setMusicPlaying(true);
  };

  const pauseMusic = () => {
    if (sourceRef.current && ctxRef.current && audioBufferRef.current) {
      offsetRef.current = (ctxRef.current.currentTime - startTimeRef.current) % audioBufferRef.current.duration;
      try { sourceRef.current.stop(); } catch (e) {}
      sourceRef.current = null;
      setMusicPlaying(false);
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (gainRef.current) gainRef.current.gain.value = newMuted ? 0 : 0.85;
  };

  const advance = () => {
    setFade(false);
    setTimeout(() => {
      setSlide(p => {
        const n = p + 1;
        if (n >= photos.length) { setPlaying(false); setShowMsg(true); return p; }
        return n;
      });
      setFade(true);
    }, 600);
  };

  useEffect(() => {
    if (playing) { timer.current = setInterval(advance, 5000); }
    else { clearInterval(timer.current); }
    return () => clearInterval(timer.current);
  }, [playing, photos.length]);

  const togglePlay = () => {
    if (!playing) { setPlaying(true); if (audioBufferRef.current) startMusic(offsetRef.current); }
    else { setPlaying(false); pauseMusic(); }
  };

  const startShow = () => {
    setSlide(0); setShowMsg(false); setShowPoetic(true); setPIdx(0); setStarted(true);
    offsetRef.current = 0;
    startMusic(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i < poeticLines.length) { setPIdx(i); }
      else { clearInterval(t); setShowPoetic(false); setPlaying(true); }
    }, 2200);
  };

  const gold = "linear-gradient(135deg,#b8860b,#ffd700,#daa520,#b8860b)";
  const btn = { padding:"10px 22px", background:"rgba(255,215,0,0.08)", border:"1px solid rgba(255,215,0,0.35)", color:"rgba(255,215,0,0.9)", borderRadius:"50px", cursor:"pointer", fontSize:"14px", letterSpacing:"1px" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#060610 0%,#150a25 50%,#0a1520 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:"20px", overflow:"hidden" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes zoom { from{transform:scale(1)} to{transform:scale(1.07)} }
        @keyframes twinkle { from{opacity:0.1} to{opacity:0.9} }
        .fade-in { animation: fadeUp 0.8s ease both }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
      `}</style>

      {/* Stars */}
      {[...Array(18)].map((_,i) => (
        <div key={i} style={{ position:"fixed", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(255,215,0,0.5)", top:`${(i*17+13)%100}%`, left:`${(i*23+7)%100}%`, animation:`twinkle ${1.5+(i%3)}s ease-in-out infinite alternate`, animationDelay:`${i*0.2}s` }}/>
      ))}

      {/* Mute button */}
      {musicPlaying && (
        <button onClick={toggleMute} style={{ position:"fixed", top:"16px", right:"16px", zIndex:100, background:"rgba(255,215,0,0.1)", border:"1px solid rgba(255,215,0,0.3)", color:"rgba(255,215,0,0.9)", borderRadius:"50px", padding:"6px 14px", cursor:"pointer", fontSize:"13px" }}>
          {muted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      )}

      {/* Title */}
      <div style={{ textAlign:"center", marginBottom:"28px", zIndex:10 }} className="fade-in">
        <div style={{ fontSize:"11px", letterSpacing:"6px", color:"#ffd700", textTransform:"uppercase", marginBottom:"6px", opacity:0.8 }}>✦ A Celebration of Love ✦</div>
        <h1 style={{ fontSize:"clamp(26px,5vw,50px)", background:gold, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", backgroundSize:"300% 300%", animation:"shimmer 4s ease infinite", letterSpacing:"2px" }}>Happy Anniversary</h1>
        <div style={{ color:"rgba(255,215,0,0.75)", fontSize:"17px", marginTop:"6px", letterSpacing:"3px" }}>Mauci & Chachaji</div>
        <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", marginTop:"4px" }}>❤️ A Love Story Through the Years ❤️</div>
      </div>

      {/* Begin button */}
      {!started && !showPoetic && (
        <div className="fade-in" style={{ textAlign:"center" }}>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", marginBottom:"24px", letterSpacing:"1px" }}>A slideshow made with love ✦ with music</div>
          <button onClick={startShow} style={{ padding:"18px 52px", background:gold, color:"#0a0a1a", border:"none", borderRadius:"50px", fontSize:"17px", fontWeight:"bold", cursor:"pointer", letterSpacing:"2px", boxShadow:"0 0 40px rgba(255,215,0,0.4)", animation:"float 3s ease-in-out infinite" }}>
            ▶ BEGIN THE STORY
          </button>
        </div>
      )}

      {/* Poetic intro */}
      {showPoetic && (
        <div style={{ textAlign:"center", maxWidth:"600px", padding:"40px", zIndex:10 }} className="fade-in">
          {poeticLines.slice(0, pIdx+1).map((line, i) => (
            <p key={i} style={{ color:i===pIdx?"#ffd700":"rgba(255,215,0,0.45)", fontSize:i===pIdx?"22px":"18px", fontStyle:"italic", lineHeight:"1.9", marginBottom:"6px", animation:i===pIdx?"fadeUp 0.8s ease":"none" }}>{line}</p>
          ))}
        </div>
      )}

      {/* Slideshow */}
      {started && !showPoetic && !showMsg && (
        <div style={{ width:"100%", maxWidth:"680px", zIndex:10 }}>
          <div style={{ opacity:fade?1:0, transform:fade?"scale(1)":"scale(0.97)", transition:"opacity 0.6s ease,transform 0.6s ease", borderRadius:"20px", overflow:"hidden", boxShadow:"0 0 60px rgba(255,215,0,0.2),0 20px 60px rgba(0,0,0,0.8)", position:"relative" }}>
            <img src={photos[slide]} alt="" style={{ width:"100%", height:"460px", objectFit:"cover", display:"block", animation:"zoom 5s ease forwards" }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.3) 0%,transparent 40%)" }}/>
            <div style={{ position:"absolute", top:"16px", right:"18px", color:"rgba(255,215,0,0.7)", fontSize:"20px", animation:"float 3s ease-in-out infinite" }}>💛</div>
          </div>

          {/* Dot indicators */}
          <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"16px" }}>
            {photos.map((_,i) => (
              <div key={i} onClick={() => { setSlide(i); setFade(true); }} style={{ width:i===slide?"24px":"8px", height:"8px", borderRadius:"4px", background:i===slide?"#ffd700":"rgba(255,215,0,0.25)", cursor:"pointer", transition:"all 0.3s ease" }}/>
            ))}
          </div>

          <div style={{ display:"flex", justifyContent:"center", gap:"14px", marginTop:"16px" }}>
            <button onClick={() => { setSlide(Math.max(0,slide-1)); setFade(true); }} style={btn}>‹ Prev</button>
            <button onClick={togglePlay} style={{ ...btn, background:gold, color:"#0a0a1a", minWidth:"110px" }}>{playing?"⏸ Pause":"▶ Play"}</button>
            <button onClick={() => { setSlide(Math.min(photos.length-1,slide+1)); setFade(true); }} style={btn}>Next ›</button>
          </div>
          <div style={{ textAlign:"center", marginTop:"18px" }}>
            <button onClick={() => { setPlaying(false); pauseMusic(); setShowMsg(true); }} style={{ ...btn, fontSize:"12px", letterSpacing:"2px" }}>READ THE MESSAGE ✉️</button>
          </div>
        </div>
      )}

      {/* Message */}
      {showMsg && (
        <div style={{ maxWidth:"680px", width:"100%", zIndex:10 }} className="fade-in">
          <div style={{ background:"linear-gradient(160deg,rgba(28,18,48,0.97),rgba(12,8,28,0.99))", border:"1px solid rgba(255,215,0,0.28)", borderRadius:"24px", padding:"clamp(24px,5vw,48px)", boxShadow:"0 0 80px rgba(255,215,0,0.08),inset 0 0 40px rgba(255,215,0,0.02)", position:"relative" }}>
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i) => (
              <div key={i} style={{ position:"absolute", [v]:"16px", [h]:"16px", color:"rgba(255,215,0,0.28)", fontSize:"18px" }}>✦</div>
            ))}
            <div style={{ textAlign:"center", marginBottom:"30px" }}>
              <div style={{ fontSize:"34px", marginBottom:"8px" }}>💛</div>
              <div style={{ color:"rgba(255,215,0,0.45)", fontSize:"11px", letterSpacing:"5px", textTransform:"uppercase" }}>A Message From The Heart</div>
            </div>
            <div style={{ lineHeight:"1.95" }}>
              {messageLines.map((line,i) =>
                line.t===""
                  ? <div key={i} style={{ height:"10px" }}/>
                  : <p key={i} style={{ color:line.b?"#ffd700":"rgba(255,255,255,0.82)", fontSize:line.b?"16px":"14.5px", fontWeight:line.b?"bold":"normal", marginBottom:"4px" }}>{line.t}</p>
              )}
            </div>
            <div style={{ marginTop:"34px", paddingTop:"22px", borderTop:"1px solid rgba(255,215,0,0.18)", textAlign:"center" }}>
              <div style={{ color:"rgba(255,215,0,0.85)", fontSize:"17px", fontStyle:"italic", marginBottom:"8px" }}>"the kind that grows deeper with every passing season."</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px", letterSpacing:"3px" }}>✦ WITH LOVE ✦</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"14px", marginTop:"22px" }}>
            <button onClick={() => setShowMsg(false)} style={btn}>← Back to Photos</button>
            <button onClick={startShow} style={{ ...btn, background:gold, color:"#0a0a1a" }}>▶ Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
