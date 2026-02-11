import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, MotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

// Import scene images
import scene1Img from "@/assets/scn1.png";
import scene3Img from "@/assets/scn3.png";
import scene4Img from "@/assets/scn4.png";

// Smooth parallax hook
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Cosmic particle component - enhanced
const CosmicParticles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(43, 55%, 55%) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Individual Teaching Component with its own scroll trigger
const TeachingReveal = ({
  symbol,
  sanskrit,
  title,
  subtitle,
  desc,
  color,
  isReversed = false,
}: {
  symbol: string;
  sanskrit: string;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  isReversed?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-[70vh] flex items-center justify-center py-20"
    >
      <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-4xl mx-auto px-6 ${isReversed ? "md:flex-row-reverse" : ""}`}>
        {/* Symbol Side */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isReversed ? 60 : -60 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: color, opacity: 0.25 }}
              animate={isInView ? { scale: [1, 1.4, 1], opacity: [0.15, 0.35, 0.15] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-7xl md:text-8xl block relative z-10">{symbol}</span>
          </motion.div>
          <motion.span 
            className="text-5xl md:text-6xl font-serif mt-6 opacity-25"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.25 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {sanskrit}
          </motion.span>
        </motion.div>

        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? -60 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isReversed ? -60 : 60 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`text-center md:text-${isReversed ? "right" : "left"}`}
        >
          <h3 
            className="text-4xl md:text-5xl font-serif mb-2"
            style={{ color }}
          >
            {title}
          </h3>
          <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground/50 mb-6">
            {subtitle}
          </p>
          <p className="text-foreground/70 leading-relaxed text-lg md:text-xl max-w-md">
            {desc}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Goal Statement with its own scroll trigger
const GoalStatement = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="min-h-[80vh] flex items-center justify-center py-32 text-center relative"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(43, 55%, 55%, 0.08) 0%, transparent 70%)"
        }}
        animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 px-6">
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          The ultimate goal is not heaven.
        </motion.p>
        
        <motion.p 
          className="text-4xl md:text-6xl font-serif text-primary leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          It is freedom<br />from ignorance.
        </motion.p>
        
        <motion.div 
          className="mt-12 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.div 
            className="h-px w-24 bg-gradient-to-r from-transparent to-primary/40"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 1 }}
          />
          <span className="text-primary/60 text-xl">॥</span>
          <motion.div 
            className="h-px w-24 bg-gradient-to-l from-transparent to-primary/40"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </motion.div>
        
        <motion.p 
          className="mt-10 text-lg md:text-xl text-foreground/60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          The divine is not outside you.<br/>
          <span className="text-primary text-2xl font-serif mt-2 block">It is within.</span>
        </motion.p>
      </div>
    </motion.div>
  );
};

// Scene section with cinematic background
const SceneSection = ({
  children,
  backgroundImage,
  overlayOpacity = 0.7,
  id,
  className = "",
}: {
  children: React.ReactNode;
  backgroundImage?: string;
  overlayOpacity?: number;
  id?: string;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useParallax(scrollYProgress, 80);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {backgroundImage && (
        <>
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={isInView ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 1.1 }}
            transition={{ 
              duration: 2.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover opacity-70"
              animate={isInView ? { scale: [1, 1.03] } : { scale: 1 }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              background: `linear-gradient(to bottom, 
                hsl(240, 10%, 4%, ${overlayOpacity}) 0%, 
                hsl(240, 10%, 4%, ${overlayOpacity * 0.85}) 20%,
                hsl(240, 10%, 4%, ${overlayOpacity * 0.75}) 50%,
                hsl(240, 10%, 4%, ${overlayOpacity * 0.85}) 80%,
                hsl(240, 10%, 4%, ${overlayOpacity}) 100%)`,
            }}
          />
        </>
      )}
      {/* Section divider - top */}
      {!backgroundImage && (
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-[2]" />
      )}
      <motion.div
        className="relative z-10 w-full"
        style={{ y, opacity: contentOpacity }}
      >
        {children}
      </motion.div>
      
      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-[2] pointer-events-none" />
    </section>
  );
};

// Animated text reveal - word by word with stagger
const RevealText = ({ 
  text, 
  className = "", 
  delay = 0,
  stagger = 0.05,
}: { 
  text: string; 
  className?: string; 
  delay?: number;
  stagger?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: -90 }}
          transition={{
            duration: 0.8,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
          style={{ transformOrigin: "bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Glowing Om symbol - enhanced
const OmSymbol = ({ isVisible }: { isVisible: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.3 }}
    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
    className="relative inline-block"
  >
    {/* Outer glow rings */}
    {[1, 2, 3].map((ring) => (
      <motion.div
        key={ring}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(43, 55%, 55%, ${0.1 / ring}) 0%, transparent 70%)`,
          transform: `scale(${1 + ring * 0.5})`,
        }}
        animate={{
          scale: [1 + ring * 0.5, 1.2 + ring * 0.5, 1 + ring * 0.5],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3 + ring,
          repeat: Infinity,
          ease: "easeInOut",
          delay: ring * 0.3,
        }}
      />
    ))}
    
    <motion.span
      className="relative text-[100px] sm:text-[140px] md:text-[200px] font-serif text-primary block"
      style={{
        textShadow: "0 0 60px hsl(43, 55%, 55%), 0 0 120px hsl(43, 55%, 55%, 0.5)",
      }}
      animate={{
        textShadow: [
          "0 0 30px hsl(43, 55%, 55%), 0 0 60px hsl(43, 55%, 55%, 0.5)",
          "0 0 80px hsl(43, 55%, 55%), 0 0 160px hsl(43, 55%, 55%, 0.5)",
          "0 0 30px hsl(43, 55%, 55%), 0 0 60px hsl(43, 55%, 55%, 0.5)",
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      ॐ
    </motion.span>
  </motion.div>
);

// Animated line divider
const AnimatedDivider = ({ isVisible, width = "w-24" }: { isVisible: boolean; width?: string }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={isVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className={`h-px ${width} bg-gradient-to-r from-transparent via-primary to-transparent mx-auto origin-center`}
  />
);

// Floating Sanskrit text
const SanskritFloat = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <motion.span
    className="absolute text-primary/10 text-[200px] font-serif pointer-events-none select-none"
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0, 0.1, 0],
      y: [50, -50],
      x: [0, 20, 0],
    }}
    transition={{
      duration: 20,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {text}
  </motion.span>
);

// Section spacer for breathing room
const SectionSpacer = () => (
  <div className="relative h-32 md:h-48 bg-background">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />
    </div>
  </div>
);

export default function OurStory() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Smooth progress for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Section refs for visibility detection
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  const section6Ref = useRef(null);
  const section7Ref = useRef(null);

  const section1InView = useInView(section1Ref, { amount: 0.4 });
  const section2InView = useInView(section2Ref, { amount: 0.4 });
  const section3InView = useInView(section3Ref, { amount: 0.4 });
  const section4InView = useInView(section4Ref, { amount: 0.4 });
  const section5InView = useInView(section5Ref, { amount: 0.4 });
  const section6InView = useInView(section6Ref, { amount: 0.4 });
  const section7InView = useInView(section7Ref, { amount: 0.4 });

  return (
    <Layout>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary to-primary/50 z-50 origin-left"
        style={{ scaleX }}
      />

      <CosmicParticles />

      <div ref={containerRef} className="relative">
        
        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 1 — The Beginning (Cosmic Opening)
            ═══════════════════════════════════════════════════════════════════ */}
        <SceneSection backgroundImage={scene1Img} overlayOpacity={0.85} id="beginning">
          <div ref={section1Ref} className="text-center px-6 max-w-5xl mx-auto py-32">
            
            {/* Floating Sanskrit */}
            <div className="absolute inset-0 overflow-hidden">
              <SanskritFloat text="सत्यम्" delay={0} />
              <SanskritFloat text="शिवम्" delay={5} />
              <SanskritFloat text="सुन्दरम्" delay={10} />
            </div>

            <OmSymbol isVisible={section1InView} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={section1InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 2, delay: 0.8 }}
              className="mt-16 space-y-8"
            >
              <div className="space-y-4">
                <p className="text-xl md:text-3xl font-serif text-foreground/90 italic leading-relaxed">
                  <RevealText text="Before time had a name…" delay={1} />
                </p>
                <p className="text-xl md:text-3xl font-serif text-foreground/90 italic leading-relaxed">
                  <RevealText text="Before the sun knew how to rise…" delay={1.5} />
                </p>
              </div>

              <AnimatedDivider isVisible={section1InView} />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={section1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 1.5, delay: 2.5 }}
                className="space-y-4"
              >
                <p className="text-lg md:text-2xl text-muted-foreground">
                  There was vibration. There was consciousness.
                </p>
                <p className="text-3xl md:text-5xl font-serif text-primary">
                  There was Om.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={section1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1, delay: 3.5 }}
                className="pt-8"
              >
                <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                  Hindu Dharma does not begin with a date.
                  <br />
                  It begins with the cosmos.
                </p>
                <p className="mt-4 text-lg md:text-xl text-primary font-serif">
                  It calls itself Sanātana Dharma — The Eternal Way.
                </p>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60">
                  Scroll to journey
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
              </motion.div>
            </motion.div>
          </div>
        </SceneSection>

        <SectionSpacer />

        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 2 — The Concept of Dharma
            ═══════════════════════════════════════════════════════════════════ */}
        <SceneSection backgroundImage={scene3Img} overlayOpacity={0.88} id="dharma">
          <div ref={section2Ref} className="text-center px-6 max-w-4xl mx-auto py-32">
            
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={section2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="text-[9px] tracking-[0.5em] uppercase text-primary block mb-8"
            >
              The Cosmic Order
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={section2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-7xl font-serif mb-12"
            >
              What is <span className="text-primary italic">Dharma</span>?
            </motion.h2>

            <div className="space-y-8 text-lg md:text-xl leading-relaxed">
              <motion.div
                initial={{ opacity: 0 }}
                animate={section2InView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="space-y-2 text-muted-foreground"
              >
                <p>Dharma is not religion.</p>
                <p>It is not a rulebook.</p>
                <p>It is not blind belief.</p>
              </motion.div>

              <AnimatedDivider isVisible={section2InView} width="w-32" />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={section2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-2xl md:text-3xl font-serif text-primary"
              >
                Dharma means cosmic order.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={section2InView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1.3 }}
                className="text-foreground/80"
              >
                The law that keeps stars in orbit…
                <br />
                And hearts in balance.
              </motion.p>

              <motion.blockquote
                initial={{ opacity: 0, y: 30 }}
                animate={section2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1.2, delay: 1.8 }}
                className="mt-20 max-w-2xl mx-auto text-center"
              >
                <motion.span
                  className="text-8xl md:text-9xl font-serif text-primary/10 block leading-none select-none"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  "
                </motion.span>
                <p className="text-xl md:text-2xl font-serif italic text-foreground/90 -mt-12 md:-mt-16 relative z-10">
                  In the Bhagavad Gita, Krishna does not command Arjuna.
                  <br />
                  <span className="text-primary">He awakens him.</span>
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
                  <span className="text-xs tracking-[0.3em] uppercase text-primary/60">
                    Dharma is realized, not imposed
                  </span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
                </div>
              </motion.blockquote>
            </div>
          </div>
        </SceneSection>

        <SectionSpacer />

        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 3 — The Trinity
            ═══════════════════════════════════════════════════════════════════ */}
        <SceneSection overlayOpacity={0.75} id="trinity">
          <div ref={section3Ref} className="text-center px-6 max-w-6xl mx-auto py-32">
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={section3InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-[9px] tracking-[0.5em] uppercase text-primary block mb-6"
            >
              The Cosmic Trinity
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={section3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl md:text-6xl font-serif mb-16"
            >
              Creation. Preservation. <span className="italic text-primary">Transformation.</span>
            </motion.h2>

            {/* Trinity - Elegant Flowing Design */}
            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
              {[
                { 
                  title: "Brahma", 
                  sanskrit: "ब्रह्मा",
                  desc: "Dreams existence into being",
                  subdesc: "The infinite potential taking form",
                  color: "#F59E0B",
                  delay: 0.5,
                },
                { 
                  title: "Vishnu", 
                  sanskrit: "विष्णु",
                  desc: "Sustains cosmic harmony",
                  subdesc: "The balance keeper of order",
                  color: "#3B82F6",
                  delay: 0.8,
                },
                { 
                  title: "Shiva", 
                  sanskrit: "शिव",
                  desc: "Dances change into being",
                  subdesc: "Transformation, not destruction",
                  color: "#8B5CF6",
                  delay: 1.1,
                },
              ].map((deity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={section3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 1.2, delay: deity.delay, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center group cursor-default"
                >
                  {/* Glowing orb */}
                  <motion.div
                    className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        background: `radial-gradient(circle, ${deity.color}20 0%, transparent 70%)`,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="text-5xl md:text-6xl font-serif transition-all duration-500"
                        style={{ color: deity.color, textShadow: `0 0 30px ${deity.color}40` }}
                      >
                        {deity.sanskrit}
                      </span>
                    </div>
                  </motion.div>
                  
                  <h3 
                    className="text-2xl md:text-3xl font-serif mb-3 transition-colors duration-500"
                    style={{ color: deity.color }}
                  >
                    {deity.title}
                  </h3>
                  <p className="text-foreground/80 text-sm md:text-base">{deity.desc}</p>
                  <p className="text-muted-foreground/60 text-xs md:text-sm mt-1 italic">{deity.subdesc}</p>
                </motion.div>
              ))}
            </div>

            {/* Connecting line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={section3InView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="hidden md:block w-full max-w-xl mx-auto h-px bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 mt-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={section3InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="mt-16 text-xl md:text-2xl text-foreground/80 font-serif"
            >
              In Hindu thought, destruction is not evil. It is renewal.
              <br />
              <span className="text-primary">Nothing truly ends. It evolves.</span>
            </motion.p>
          </div>
        </SceneSection>

        <SectionSpacer />

        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 4 — The Teachings (Individual Scroll Reveals)
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative" id="teachings">
          {/* Dark overlay for the entire teachings section */}
          <div className="absolute inset-0 bg-background/95 z-0" />
          
          {/* Section Header */}
          <div ref={section4Ref} className="relative z-10 text-center px-6 py-32">
            <motion.span
              initial={{ opacity: 0 }}
              animate={section4InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-[9px] tracking-[0.5em] uppercase text-primary block mb-6"
            >
              Sacred Wisdom
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={section4InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-7xl font-serif"
            >
              The <span className="italic text-primary">Teachings</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={section4InView ? { opacity: 0.6 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-6 text-muted-foreground"
            >
              Scroll to discover each sacred principle
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={section4InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8"
            >
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block text-primary/50"
              >
                ↓
              </motion.span>
            </motion.div>
          </div>

          {/* Individual Teachings - Each with own scroll trigger */}
          <div className="relative z-10">
            <TeachingReveal
              symbol="🌿"
              sanskrit="कर्म"
              title="Karma"
              subtitle="The Law of Action"
              desc="Every action shapes destiny. The universe responds to intention with perfect justice. What you give, returns to you."
              color="#22C55E"
              isReversed={false}
            />

            <TeachingReveal
              symbol="☮️"
              sanskrit="अहिंसा"
              title="Ahimsa"
              subtitle="The Path of Peace"
              desc="Non-violence is true strength. Compassion conquers where force fails. In gentleness lies the greatest power."
              color="#8B5CF6"
              isReversed={true}
            />

            <TeachingReveal
              symbol="🧘"
              sanskrit="योग"
              title="Yoga"
              subtitle="The Art of Union"
              desc="Union of body, mind, and soul. The path to wholeness and inner peace. Through discipline, discover freedom."
              color="#F59E0B"
              isReversed={false}
            />

            <TeachingReveal
              symbol="✨"
              sanskrit="मोक्ष"
              title="Moksha"
              subtitle="The Ultimate Freedom"
              desc="Liberation from illusion. Freedom from the endless cycle of becoming. The soul's return to infinite consciousness."
              color="#EC4899"
              isReversed={true}
            />
          </div>

          {/* Goal Statement - Appears after last teaching */}
          <GoalStatement />
        </section>

        <SectionSpacer />

        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 5 — Diversity & Acceptance
            ═══════════════════════════════════════════════════════════════════ */}
        <SceneSection overlayOpacity={0.78} id="diversity">
          <div ref={section5Ref} className="text-center px-6 max-w-4xl mx-auto py-32">
            
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={section5InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-serif mb-8"
            >
              Thousands of gods.
              <br />
              <span className="text-primary italic">One truth.</span>
            </motion.h2>

            <AnimatedDivider isVisible={section5InView} width="w-40" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={section5InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 text-xl text-muted-foreground"
            >
              Hindu Dharma does not say, "This is the only way."
            </motion.p>

            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              animate={section5InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="my-20 text-center max-w-3xl mx-auto"
            >
              <motion.div
                className="text-9xl font-serif text-primary/10 leading-none select-none"
                animate={{ opacity: [0.05, 0.12, 0.05] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                "
              </motion.div>
              <p className="text-2xl md:text-4xl font-serif text-foreground italic leading-relaxed -mt-16 relative z-10">
                Truth is one.
                <br />
                <span className="text-primary/90">The wise call it by many names.</span>
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary/20" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary/50">Rig Veda</span>
                <div className="h-px w-12 bg-primary/20" />
              </div>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={section5InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-wrap justify-center gap-8 text-sm"
            >
              {["Thought", "Worship", "Philosophy", "Expression"].map((item, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={section5InView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 + i * 0.1 }}
                  className="text-muted-foreground/60 hover:text-primary transition-colors cursor-default"
                >
                  Diversity in <span className="text-foreground/80">{item}</span>
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={section5InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mt-16 text-2xl md:text-3xl font-serif text-primary"
            >
              Unity without uniformity.
            </motion.p>
          </div>
        </SceneSection>

        <SectionSpacer />

        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 6 — The Inner Universe
            ═══════════════════════════════════════════════════════════════════ */}
        <SceneSection overlayOpacity={0.85} id="inner-universe">
          <div ref={section6Ref} className="px-6 max-w-6xl mx-auto py-32">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              
              {/* Chakra visualization */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={section6InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                transition={{ duration: 1.2 }}
                className="relative h-[450px] md:h-[550px] flex items-center justify-center"
              >
                {/* Central energy line */}
                <div className="absolute w-1 h-full bg-gradient-to-b from-red-500/30 via-green-500/30 to-purple-500/30 rounded-full" />
                
                {/* Chakras */}
                {[
                  { color: "#EF4444", name: "मूलाधार", y: "85%" },
                  { color: "#F97316", name: "स्वाधिष्ठान", y: "72%" },
                  { color: "#EAB308", name: "मणिपूर", y: "58%" },
                  { color: "#22C55E", name: "अनाहत", y: "44%" },
                  { color: "#06B6D4", name: "विशुद्ध", y: "30%" },
                  { color: "#6366F1", name: "आज्ञा", y: "18%" },
                  { color: "#A855F7", name: "सहस्रार", y: "5%" },
                ].map((chakra, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={section6InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
                    className="absolute flex items-center gap-4"
                    style={{ top: chakra.y }}
                  >
                    <motion.div
                      className="w-10 h-10 md:w-14 md:h-14 rounded-full relative"
                      style={{ 
                        backgroundColor: chakra.color,
                        boxShadow: `0 0 30px ${chakra.color}, 0 0 60px ${chakra.color}40`,
                      }}
                      animate={{
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          `0 0 20px ${chakra.color}, 0 0 40px ${chakra.color}40`,
                          `0 0 40px ${chakra.color}, 0 0 80px ${chakra.color}60`,
                          `0 0 20px ${chakra.color}, 0 0 40px ${chakra.color}40`,
                        ],
                      }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="text-xs text-muted-foreground/60 font-serif">{chakra.name}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={section6InView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-left space-y-8"
              >
                <span className="text-[9px] tracking-[0.5em] uppercase text-primary block">
                  The Inner Universe
                </span>

                <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                  The universe you seek outside…
                  <br />
                  <span className="text-primary italic">Exists within.</span>
                </h2>

                <div className="h-px w-20 bg-gradient-to-r from-primary to-transparent" />

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hindu Dharma teaches that the soul — <span className="text-primary font-serif">Atman</span> — 
                  is not separate from <span className="text-primary font-serif">Brahman</span> — the ultimate reality.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={section6InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="p-8 bg-primary/5 rounded-2xl border border-primary/10"
                >
                  <p className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed">
                    You are not small.
                  </p>
                  <p className="text-2xl md:text-3xl font-serif text-primary mt-2">
                    You are infinite, experiencing itself.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </SceneSection>

        <SectionSpacer />

        {/* ═══════════════════════════════════════════════════════════════════
            SCENE 7 — The Eternal Way (Final)
            ═══════════════════════════════════════════════════════════════════ */}
        <SceneSection backgroundImage={scene4Img} overlayOpacity={0.82} id="eternal">
          <div ref={section7Ref} className="text-center px-6 max-w-4xl mx-auto py-32">
            
            {/* Glowing Om */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={section7InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <motion.span
                className="text-7xl md:text-9xl font-serif text-primary inline-block"
                style={{
                  textShadow: "0 0 60px hsl(43, 55%, 55%), 0 0 120px hsl(43, 55%, 55%, 0.5)",
                }}
                animate={section7InView ? {
                  textShadow: [
                    "0 0 40px hsl(43, 55%, 55%), 0 0 80px hsl(43, 55%, 55%, 0.3)",
                    "0 0 80px hsl(43, 55%, 55%), 0 0 160px hsl(43, 55%, 55%, 0.5)",
                    "0 0 40px hsl(43, 55%, 55%), 0 0 80px hsl(43, 55%, 55%, 0.3)",
                  ],
                } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                ॐ
              </motion.span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={section7InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-5xl md:text-7xl font-serif mb-8"
            >
              The <span className="italic text-primary">Eternal</span> Way
            </motion.h2>

            <AnimatedDivider isVisible={section7InView} width="w-32" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={section7InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="mt-12 space-y-4 text-xl md:text-2xl text-muted-foreground leading-relaxed"
            >
              <p>Sanātana Dharma is not a beginning.</p>
              <p>It has no end.</p>
              <p className="text-foreground">It is a journey inward.</p>
              <p className="text-foreground">A dance with existence.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={section7InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-16 p-10 md:p-12 glass-card rounded-3xl border border-primary/20"
            >
              <p className="text-xl md:text-2xl font-serif text-foreground">
                A reminder that the divine
                <br />
                Is not somewhere else.
              </p>
              <p className="mt-6 text-3xl md:text-4xl font-serif text-primary">
                It is here. It is you.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={section7InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mt-20"
            >
              <Link
                to="/collections"
                className="group relative inline-flex items-center justify-center px-14 py-6 overflow-hidden rounded-full glass-card border border-primary/30 hover:border-primary/60 transition-all duration-700"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent"
                  initial={{ y: "100%" }}
                  whileHover={{ y: "0%" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="relative z-10 text-[11px] tracking-[0.4em] uppercase text-foreground group-hover:text-primary transition-colors duration-500">
                  Begin the Journey
                </span>
              </Link>
            </motion.div>

            {/* Footer flourish */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={section7InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 2, delay: 3 }}
              className="mt-24 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
                <span className="text-primary/40 text-2xl">☸</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/40">
                ॐ शान्तिः शान्तिः शान्तिः
              </p>
            </motion.div>
          </div>
        </SceneSection>

      </div>
    </Layout>
  );
}
