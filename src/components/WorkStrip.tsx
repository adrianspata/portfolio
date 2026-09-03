import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimationFrame } from "framer-motion";
import { allProjects, getMediaUrl } from "../data/projects";
import "../Styles/WorkStrip.css";

interface WorkStripProps {
  isVisible?: boolean;
  isIntroActive?: boolean;
  onIntroFadeNav?: () => void;
  onIntroComplete?: () => void;
}

type IntroStatus =
  | "idle"
  | "preloading"
  | "measuring"
  | "running"
  | "landing"
  | "complete";

const SESSION_KEY = "adrian_spata_intro_played";

// Module-level authoritative controller state to prevent double execution (e.g. React Strict Mode)
let globalRunId = 0;
let globalControllerStatus: IntroStatus = "idle";
let globalCancelCurrentRun: (() => void) | null = null;

// Developer & testing replay helper
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__replayIntro = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    if (globalCancelCurrentRun) {
      globalCancelCurrentRun();
      globalCancelCurrentRun = null;
    }
    globalControllerStatus = "idle";
    window.location.href = "/?intro=true";
  };
}

// Preload project images with a safety timeout so slow networks do not freeze playback
const preloadImages = (urls: string[], timeoutMs = 1500): Promise<void> => {
  return new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };
    const timer = setTimeout(done, timeoutMs);
    let loaded = 0;
    if (urls.length === 0) {
      clearTimeout(timer);
      done();
      return;
    }
    urls.forEach((url) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= urls.length) {
          clearTimeout(timer);
          done();
        }
      };
      img.src = url;
    });
  });
};

// Continuous angular velocity curve (gentle acceleration -> constant velocity -> subtle deceleration)
function rawRotationCurve(s: number): number {
  const s1 = 0.25;
  const s2 = 0.75;
  const K = 1.2903;
  if (s <= s1) {
    return (K / (2 * s1)) * s * s;
  }
  const p1 = (K * s1) / 2;
  if (s <= s2) {
    return p1 + K * (s - s1);
  }
  const p2 = p1 + K * (s2 - s1);
  const u = (s - s2) / (1 - s2);
  const vTerm = 0.25 * K;
  return p2 + (1 - s2) * (K * u - ((K - vTerm) / 2) * u * u);
}
const ROTATION_CURVE_MAX = rawRotationCurve(1.0);

function computeRotationProgress(s: number): number {
  const clamped = Math.max(0, Math.min(1, s));
  return rawRotationCurve(clamped) / ROTATION_CURVE_MAX;
}

function smootherstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

const WorkStrip: React.FC<WorkStripProps> = ({
  isVisible = true,
  isIntroActive = false,
  onIntroFadeNav,
  onIntroComplete,
}) => {
  const onIntroFadeNavRef = useRef(onIntroFadeNav);
  onIntroFadeNavRef.current = onIntroFadeNav;

  const onIntroCompleteRef = useRef(onIntroComplete);
  onIntroCompleteRef.current = onIntroComplete;

  const [projects] = useState(() =>
    [...allProjects].sort(() => Math.random() - 0.5)
  );
  const projectCount = projects.length;

  const homeRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const [introMode, setIntroMode] = useState(isIntroActive);
  const [isInteractive, setIsInteractive] = useState(!isIntroActive);
  const [isAutoscrollActive, setIsAutoscrollActive] = useState(!isIntroActive);

  // Carousel dragging & interaction states
  const [isPaused, setIsPaused] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const resumeTimeout = useRef<number | null>(null);

  // Touch drag state
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);
  const isTouchDragging = useRef(false);

  // Center-item highlight: card in center of screen is in color (grayscale 0%), others are black & white (grayscale 100%)
  const [centerIndex, setCenterIndex] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ show: false, text: "", x: 0, y: 0 });

  // Find which thumb is closest to the center of the strip container
  const updateCenterIndex = useCallback(() => {
    if (!stripRef.current) return;
    const containerRect = stripRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;

    let closestIdx: number | null = null;
    let closestDist = Infinity;

    thumbRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const thumbCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(thumbCenterX - containerCenterX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setCenterIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
  }, []);

  // Native smooth autoscroll pan at original speed (0.3px per frame) in a continuous loop
  useAnimationFrame((_, delta) => {
    if (!isAutoscrollActive || !stripRef.current || isPaused || isMouseDown) return;

    const normalSpeed = 0.3;
    stripRef.current.scrollLeft += normalSpeed * (delta / 16.6);
    if (stripRef.current.scrollLeft >= stripRef.current.scrollWidth / 2) {
      stripRef.current.scrollLeft -= stripRef.current.scrollWidth / 2;
    }
    updateCenterIndex();
  });

  // Center update on manual scroll
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateCenterIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateCenterIndex);
  }, [updateCenterIndex]);

  // ── AUTHORITATIVE 3D INTRO ANIMATION CONTROLLER ─────────────────────────────
  useEffect(() => {
    if (!isIntroActive) {
      setIntroMode(false);
      setIsInteractive(true);
      setIsAutoscrollActive(true);
      return;
    }

    // Prevent concurrent double execution while active
    if (
      globalControllerStatus === "preloading" ||
      globalControllerStatus === "measuring" ||
      globalControllerStatus === "running" ||
      globalControllerStatus === "landing"
    ) {
      return;
    }



    const runId = ++globalRunId;
    let animationFrameId: number | null = null;
    let isCancelled = false;

    const cancelThisRun = () => {
      isCancelled = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
    globalCancelCurrentRun = cancelThisRun;

    const runIntro = async () => {
      // Phase 1: Preloading
      globalControllerStatus = "preloading";
      console.debug("[intro]", runId, "preloading");

      setIsAutoscrollActive(false);
      setIsInteractive(false);
      if (stripRef.current) {
        stripRef.current.scrollLeft = 0;
      }

      // Ensure duplicate cards remain completely hidden from the start
      for (let i = projectCount; i < projectCount * 2; i++) {
        const dupEl = thumbRefs.current[i];
        if (dupEl) {
          dupEl.style.visibility = "hidden";
          dupEl.style.opacity = "0";
        }
      }

      // Ensure primary cards start transparent so the flat strip is never visible
      for (let i = 0; i < projectCount; i++) {
        const thumb = thumbRefs.current[i];
        if (thumb) {
          thumb.style.opacity = "0";
        }
      }

      // Preload primary project images
      const primaryUrls = projects.map((p) => getMediaUrl(p.images[0]));
      await preloadImages(primaryUrls, 1500);

      if (isCancelled) return;

      // Phase 2: Measuring
      globalControllerStatus = "measuring";
      console.debug("[intro]", runId, "measuring");

      // Wait for layout and images to have rendered dimensions (up to 15 frames / 250ms)
      let measureAttempts = 0;
      while (measureAttempts < 15) {
        await new Promise((r) => requestAnimationFrame(r));
        if (isCancelled) return;
        const firstThumb = thumbRefs.current[0];
        if (firstThumb && firstThumb.getBoundingClientRect().width > 0) {
          break;
        }
        measureAttempts++;
      }

      if (isCancelled) return;

      if (stripRef.current) {
        stripRef.current.scrollLeft = 0;
      }

      const clamp = (min: number, val: number, max: number) =>
        Math.max(min, Math.min(max, val));

      let viewportCenterX = window.innerWidth / 2;
      let viewportCenterY = window.innerHeight / 2;
      let restingCards: { finalCardCenterX: number; finalCardCenterY: number }[] = [];
      let radius = 320;
      let verticalPerspectiveOffset = 85;
      let initialGroupZ = -1250;
      let initialCardScale = 0.65;
      let ringEndCardScale = 0.85;
      let centerAnchorIdx = 0;
      let nominalSpacing = 400;
      let maxLayer = 1;
      const ROTATION_AMOUNT = (240 * Math.PI) / 180;
      let ROTATION_END = 0;
      let ROTATION_START = 0;
      let ringEndState: { ringX: number; ringY: number; ringZ: number; ringRotateY: number }[] = [];

      const updateGeometryAndLayout = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        viewportCenterX = w / 2;
        viewportCenterY = h / 2;

        if (w >= 1280) {
          // Large Desktop
          radius = clamp(320, w * 0.24, 380);
          verticalPerspectiveOffset = 85;
          initialGroupZ = -1250;
          initialCardScale = 0.65;
          ringEndCardScale = 0.85;
        } else if (w >= 1024) {
          // Small Desktop / Laptop
          radius = clamp(280, w * 0.26, 320);
          verticalPerspectiveOffset = 75;
          initialGroupZ = -1100;
          initialCardScale = 0.58;
          ringEndCardScale = 0.82;
        } else if (w >= 768) {
          // Tablet (iPad portrait & landscape)
          radius = clamp(240, w * 0.33, 290);
          verticalPerspectiveOffset = 60;
          initialGroupZ = -950;
          initialCardScale = 0.48;
          ringEndCardScale = 0.76;
        } else {
          // Mobile (iPhone, Android, small screens)
          radius = clamp(155, w * 0.42, 190);
          verticalPerspectiveOffset = 40;
          initialGroupZ = -650;
          initialCardScale = 0.38;
          ringEndCardScale = 0.68;
        }

        restingCards = [];
        for (let i = 0; i < projectCount; i++) {
          const thumb = thumbRefs.current[i];
          const rect = thumb
            ? thumb.getBoundingClientRect()
            : { left: 0, top: 0, width: 360, height: 260 };
          restingCards.push({
            finalCardCenterX: rect.left + rect.width / 2,
            finalCardCenterY: rect.top + rect.height / 2,
          });
        }

        let minCenterDist = Infinity;
        for (let i = 0; i < projectCount; i++) {
          const dist = Math.abs(restingCards[i].finalCardCenterX - viewportCenterX);
          if (dist < minCenterDist) {
            minCenterDist = dist;
            centerAnchorIdx = i;
          }
        }

        const firstX = restingCards[0]?.finalCardCenterX || 0;
        const lastX = restingCards[projectCount - 1]?.finalCardCenterX || 0;
        nominalSpacing =
          projectCount > 1 ? (lastX - firstX) / (projectCount - 1) : 400;

        maxLayer = Math.max(1, Math.floor(projectCount / 2));

        ROTATION_END = -(centerAnchorIdx / projectCount) * 2 * Math.PI;
        ROTATION_START = ROTATION_END - ROTATION_AMOUNT;

        ringEndState = [];
        for (let i = 0; i < projectCount; i++) {
          const fraction = i / projectCount;
          const theta = ROTATION_END + fraction * 2 * Math.PI;
          const rx = Math.sin(theta) * radius;
          const rz = Math.cos(theta) * radius;
          const depthNorm = rz / radius;
          const ry = depthNorm * verticalPerspectiveOffset;

          const thetaNorm = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          const relAngle = thetaNorm > Math.PI ? thetaNorm - 2 * Math.PI : thetaNorm;
          const maxTilt = 55;
          const rRotY = -Math.sin(relAngle) * maxTilt;

          ringEndState.push({ ringX: rx, ringY: ry, ringZ: rz, ringRotateY: rRotY });
        }
      };

      // Perform initial layout calculation
      updateGeometryAndLayout();

      // Master Timeline
      const DURATION_ROTATION = 3500; // 3500ms
      const DURATION_UNFOLD = 2700; // 2700ms
      const DURATION_TOTAL = DURATION_ROTATION + DURATION_UNFOLD; // 6200ms (~6.2s)
      const NAV_FADE_TRIGGER = 5200; // 5200ms

      let navFadeTriggered = false;
      const startTime = performance.now();

      // Phase 3: Running
      globalControllerStatus = "running";
      console.debug("[intro]", runId, "running");

      const animateStep = (currentTime: number) => {
        if (isCancelled) return;
        const elapsed = currentTime - startTime;

        if (elapsed >= NAV_FADE_TRIGGER && !navFadeTriggered) {
          navFadeTriggered = true;
          onIntroFadeNavRef.current?.();
        }

        if (elapsed >= DURATION_TOTAL) {
          // Completion
          globalControllerStatus = "complete";
          console.debug("[intro]", runId, "complete");
          completeRitual();
          return;
        }

        if (elapsed < DURATION_ROTATION) {
          // ── PHASE: 3D Ring Establishment, Master Rotation & Approach ──
          const s = elapsed / DURATION_ROTATION;
          const rotationProgress = computeRotationProgress(s);
          const currentRotation = ROTATION_START + ROTATION_AMOUNT * rotationProgress;

          // Entire ring approaches as one object: reaches foreground shortly before unfolding
          const easeZ = Math.pow(s, 2.2);
          const currentGroupZ = initialGroupZ * (1 - easeZ);

          // Calm progressive card scale: restrained early, scales up during latter approach
          const scaleProgress = Math.pow(s, 2.0);
          const currentCardScale =
            initialCardScale + (ringEndCardScale - initialCardScale) * scaleProgress;

          // Fade in ring smoothly over 0.0 - 0.7s
          const ringOpacity = Math.min(1, elapsed / 700);

          for (let i = 0; i < projectCount; i++) {
            const thumb = thumbRefs.current[i];
            if (!thumb) continue;

            const fraction = i / projectCount;
            const theta = currentRotation + fraction * 2 * Math.PI;

            const ringX = Math.sin(theta) * radius;
            const ringZ = Math.cos(theta) * radius;
            const depthNorm = ringZ / radius;
            const ringY = depthNorm * verticalPerspectiveOffset;

            // Readable orientation
            const thetaNorm = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const relAngle = thetaNorm > Math.PI ? thetaNorm - 2 * Math.PI : thetaNorm;
            const maxTilt = 55;
            const ringRotateY = -Math.sin(relAngle) * maxTilt;

            // Delta transforms relative to resting DOM layout
            const deltaX = viewportCenterX + ringX - restingCards[i].finalCardCenterX;
            const deltaY = viewportCenterY + ringY - restingCards[i].finalCardCenterY;
            const deltaZ = ringZ + currentGroupZ;

            thumb.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, ${deltaZ.toFixed(2)}px) rotateY(${ringRotateY.toFixed(2)}deg) scale(${currentCardScale.toFixed(3)})`;
            thumb.style.opacity = ringOpacity.toFixed(3);
          }
        } else {
          // ── PHASE: Paired Center-Out Unfolding & Precision Landing (Requirements 2, 3, 4, 5, 6) ──
          if (globalControllerStatus !== "landing") {
            globalControllerStatus = "landing";
            console.debug("[intro]", runId, "landing");
          }

          const unfoldElapsed = elapsed - DURATION_ROTATION;
          const u = clamp(0, unfoldElapsed / DURATION_UNFOLD, 1);
          // Zero endpoint velocity smootherstep for the global unfold progress
          const globalUnfoldProgress = smootherstep(u);

          // Paired center-out propagation settings (Requirement 3)
          const maxStagger = 0.28;
          const pairDelay = maxStagger / maxLayer;
          const pairDuration = 1.0 - maxStagger;

          // Stage B (Precision settlement) blends smoothly over final 25% (Requirement 5)
          const settleStart = 0.75;
          const settleWeight =
            globalUnfoldProgress <= settleStart
              ? 0
              : smootherstep(
                  (globalUnfoldProgress - settleStart) / (1 - settleStart)
                );

          // Center anchor smoothly eases toward resting carousel center for seamless zero-jump handoff
          const centerAnchorX =
            (1 - globalUnfoldProgress) * viewportCenterX +
            globalUnfoldProgress * restingCards[centerAnchorIdx].finalCardCenterX;
          const targetBaselineY = restingCards[centerAnchorIdx].finalCardCenterY;

          for (let i = 0; i < projectCount; i++) {
            const thumb = thumbRefs.current[i];
            if (!thumb) continue;

            let diff = i - centerAnchorIdx;
            while (diff > projectCount / 2) diff -= projectCount;
            while (diff < -projectCount / 2) diff += projectCount;
            const signedOffset = diff;
            const layer = Math.abs(signedOffset);
            const direction = Math.sign(signedOffset); // -1 for left, +1 for right, 0 for center

            // Paired layer progress: both cards in the layer have identical pairProgress & easePair (Requirement 2 & 3)
            const rawPair =
              (globalUnfoldProgress - layer * pairDelay) / pairDuration;
            const pairProgress = clamp(0, rawPair, 1);
            const easePair = smootherstep(pairProgress);

            const end = ringEndState[i];

            // ── Stage A: Symmetrical Center-Out Coordinates ──────────────────
            // Outward symmetrical spacing from center anchor
            const outwardDistance = layer * nominalSpacing;
            const symFlatX = centerAnchorX + direction * outwardDistance;

            // 1. Mirrored horizontal position
            const symX =
              (1 - easePair) * (centerAnchorX + end.ringX) +
              easePair * symFlatX;

            // 2. Matching vertical position: moves gradually toward carousel baseline
            const initialRingY = viewportCenterY + end.ringY;
            const symY =
              (1 - easePair) * initialRingY + easePair * targetBaselineY;

            // 3. Matching depth Z: straightens smoothly to 0
            const symZ = (1 - easePair) * end.ringZ;

            // 4. Mirrored rotateY: straightens smoothly to 0
            const symRotateY = (1 - easePair) * end.ringRotateY;

            // 5. Matching scale: grows smoothly to 1.0
            const symScale =
              ringEndCardScale + (1 - ringEndCardScale) * easePair;

            // ── Stage B: Precision Settlement into Measured Carousel (Requirement 5) ──
            const currentTargetX =
              (1 - settleWeight) * symX +
              settleWeight * restingCards[i].finalCardCenterX;
            const currentTargetY =
              (1 - settleWeight) * symY +
              settleWeight * restingCards[i].finalCardCenterY;
            const currentTargetZ = (1 - settleWeight) * symZ;
            const currentRotateY = (1 - settleWeight) * symRotateY;
            const currentScale =
              (1 - settleWeight) * symScale + settleWeight * 1.0;

            // Delta transforms relative to resting DOM layout
            const deltaX =
              currentTargetX - restingCards[i].finalCardCenterX;
            const deltaY =
              currentTargetY - restingCards[i].finalCardCenterY;
            const deltaZ = currentTargetZ;

            thumb.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, ${deltaZ.toFixed(2)}px) rotateY(${currentRotateY.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;
            thumb.style.opacity = "1";
          }
        }

        animationFrameId = requestAnimationFrame(animateStep);
      };

      // Completion Ritual (Requirement 6 & 7)
      function completeRitual() {
        // 1. Ensure primary cards reach clean identity
        for (let i = 0; i < projectCount; i++) {
          const el = thumbRefs.current[i];
          if (el) {
            el.style.transform =
              "translate3d(0px, 0px, 0px) rotateY(0deg) scale(1)";
            el.style.opacity = "1";
          }
        }

        // 2. Remove intro mode class so canonical filmstrip layout, gap: 1rem, and filters take full effect
        setIntroMode(false);

        // 3. Immediately on next animation frame: reveal duplicates, clear transforms, enable interactions
        requestAnimationFrame(() => {
          for (let i = 0; i < projectCount; i++) {
            const el = thumbRefs.current[i];
            if (el) {
              el.style.transform = "";
              el.style.opacity = "";
            }
          }
          for (let i = projectCount; i < projectCount * 2; i++) {
            const dupEl = thumbRefs.current[i];
            if (dupEl) {
              dupEl.style.visibility = "visible";
              dupEl.style.opacity = "1";
            }
          }

          // 4. Enable pointer, drag, and touch interactions
          setIsInteractive(true);

          // 5. Update center index immediately so middle image is color (grayscale 0%) and others are black/white
          updateCenterIndex();

          // 6. Start carousel autoscroll rolling immediately in an infinite loop
          setIsAutoscrollActive(true);
          onIntroCompleteRef.current?.();
        });
      }

      // Resize safety listener: finalize if window resizes during intro
      const initialW = window.innerWidth;
      const handleResizeDuringIntro = () => {
        if (Math.abs(window.innerWidth - initialW) > 60) {
          cancelThisRun();
          completeRitual();
        }
      };
      window.addEventListener("resize", handleResizeDuringIntro);

      // Start animation loop
      animationFrameId = requestAnimationFrame(animateStep);

      return () => {
        cancelThisRun();
        window.removeEventListener("resize", handleResizeDuringIntro);
      };
    };

    const startHandle = requestAnimationFrame(() => {
      runIntro();
    });

    return () => {
      cancelAnimationFrame(startHandle);
      if (
        globalControllerStatus === "running" ||
        globalControllerStatus === "landing"
      ) {
        cancelThisRun();
      }
    };
  }, [isIntroActive, projectCount, projects]);

  // ── Mouse handlers ──────────────────────────────────────────────────────────

  const handleWheel = () => {
    if (!isInteractive) return;
    setIsPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInteractive || !stripRef.current) return;
    setIsMouseDown(true);
    setIsPaused(true);
    setStartX(e.pageX - stripRef.current.offsetLeft);
    setScrollLeft(stripRef.current.scrollLeft);
    };

  const handleMouseLeaveContainer = () => {
    if (!isInteractive) return;
    setIsMouseDown(false);
    setIsPaused(false);
    setCursor((prev) => ({ ...prev, show: false }));
  };

  const handleMouseUp = () => {
    if (!isInteractive) return;
    setIsMouseDown(false);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteractive) return;
    setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    if (!isMouseDown || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    stripRef.current.scrollLeft = scrollLeft - walk;
    };

  // ── Touch handlers ──────────────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isInteractive || !stripRef.current) return;
    touchStartX.current = e.touches[0].pageX;
    touchScrollLeft.current = stripRef.current.scrollLeft;
    isTouchDragging.current = true;
    setIsPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isInteractive || !isTouchDragging.current || !stripRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (touchStartX.current - x) * 1.5;
    stripRef.current.scrollLeft = touchScrollLeft.current + walk;

    // Seamless wrap during touch drag
    if (stripRef.current.scrollLeft >= stripRef.current.scrollWidth / 2) {
      stripRef.current.scrollLeft -= stripRef.current.scrollWidth / 2;
      touchScrollLeft.current -= stripRef.current.scrollWidth / 2;
    } else if (stripRef.current.scrollLeft < 0) {
      stripRef.current.scrollLeft += stripRef.current.scrollWidth / 2;
      touchScrollLeft.current += stripRef.current.scrollWidth / 2;
    }

    updateCenterIndex();
  };

  const handleTouchEnd = () => {
    if (!isInteractive) return;
    isTouchDragging.current = false;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setIsPaused(false), 800);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={homeRef}
      className={`home-container${introMode ? " intro-active" : ""}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeaveContainer}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-filmstrip" ref={stripRef}>
        {[0, 1].flatMap((setIdx) =>
          projects.map((p, i) => {
            const globalIdx = setIdx * projectCount + i;
            const isDuplicate = setIdx === 1;
            const isCenter = centerIndex === globalIdx;

            return (
              <div
                key={p.id + `_set${setIdx}_` + i}
                className={`bg-thumb${isCenter ? " bg-thumb--center" : ""}${isDuplicate ? " intro-duplicate" : ""}`}
                ref={(el) => {
                  thumbRefs.current[globalIdx] = el;
                }}
                onMouseEnter={() => {
                  if (isInteractive) {
                    setCursor((prev) => ({ ...prev, show: true, text: p.name }));
                  }
                }}
                onMouseLeave={() => {
                  setCursor((prev) => ({ ...prev, show: false }));
                }}
                onClick={(e) => {
                  if (!isInteractive) return;
                  if (
                    stripRef.current &&
                    Math.abs(e.pageX - stripRef.current.offsetLeft - startX) < 5
                  ) {
                    navigate(`/work/${p.id}`);
                  }
                }}
              >
                <img
                  src={getMediaUrl(p.images[0])}
                  alt={p.name}
                  draggable={false}
                />
              </div>
            );
          })
        )}
      </div>

      {cursor.show && isInteractive && (
        <div
          className="cursor-tooltip"
          style={{ left: cursor.x, top: cursor.y }}
        >
          {cursor.text}
        </div>
      )}
    </div>
  );
};

export default WorkStrip;

