import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import WorkStrip from "./components/WorkStrip";
import ContactPage from "./pages/ContactPage"; 
import SingleProjectPage from "./pages/SingleProjectPage";
import ProjectsPage from "./pages/ProjectPage";
import Footer from "./components/Footer";
import "./App.css";

const LAST_PLAYED_KEY = "adrian_spata_intro_last_played_at";
const FORCE_INTRO_KEY = "adrian_spata_force_intro_after_reload";
const INTRO_TTL_MS = 25 * 60 * 1000; // 25 minutes

// Global flag to prevent internal client-side navigation from re-triggering the intro
let hasCompletedIntroInSession = false;

const AppContent: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (window.location.pathname !== "/") return false;

    // 1. URL override: ?intro=true or ?replay=true (safely consumed once)
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "true" || params.get("replay") === "true") {
      try {
        params.delete("intro");
        params.delete("replay");
        const newSearch = params.toString() ? `?${params.toString()}` : "";
        window.history.replaceState({}, "", window.location.pathname + newSearch);
      } catch {
        // ignore
      }
      hasCompletedIntroInSession = false;
      return true;
    }

    // 2. Hard-refresh keyboard shortcut flag (detected Cmd+Shift+R, Ctrl+Shift+R, Shift+F5)
    try {
      const forced = sessionStorage.getItem(FORCE_INTRO_KEY);
      if (forced === "1") {
        hasCompletedIntroInSession = false;
        return true;
      }
    } catch {
      // ignore
    }

    // 3. Prevent internal client-side navigation within same session from re-triggering
    if (hasCompletedIntroInSession) return false;

    // 4. Reduced motion preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return false;
    }

    // 5. In development mode, allow intro to run on refresh so developer can test across all viewport sizes
    if (import.meta.env.DEV) {
      return true;
    }

    // 6. 25-minute TTL policy for production visitors
    try {
      const lastPlayed = Number(localStorage.getItem(LAST_PLAYED_KEY) || 0);
      if (!lastPlayed) return true; // First visit
      const hasExpired = Date.now() - lastPlayed >= INTRO_TTL_MS;
      return hasExpired;
    } catch {
      return false;
    }
  });

  const [navVisible, setNavVisible] = useState(!isIntroActive);

  // Clear one-time forced intro flag on mount
  useEffect(() => {
    try {
      sessionStorage.removeItem(FORCE_INTRO_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Keyboard listener for hard-refresh shortcuts (Cmd+Shift+R, Ctrl+Shift+R, Shift+F5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isR = e.key === "r" || e.key === "R";
      const isF5 = e.key === "F5";
      const isHardR = (e.metaKey || e.ctrlKey) && e.shiftKey && isR;
      const isHardF5 = e.shiftKey && isF5;

      if (isHardR || isHardF5) {
        try {
          sessionStorage.setItem(FORCE_INTRO_KEY, "1");
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  // Back-Forward cache protection (pageshow with persisted === true)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        hasCompletedIntroInSession = true;
        setIsIntroActive(false);
        setNavVisible(true);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Allow manual replay in dev or via console: window.__replayIntro()
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__replayIntro = () => {
      try {
        localStorage.removeItem(LAST_PLAYED_KEY);
        sessionStorage.removeItem(FORCE_INTRO_KEY);
      } catch {
        // ignore
      }
      hasCompletedIntroInSession = false;
      window.location.href = "/?intro=true";
    };
  }, []);

  // When navigating away from home, ensure nav is always visible and intro cannot replay
  useEffect(() => {
    if (!isHome) {
      setNavVisible(true);
      setIsIntroActive(false);
      hasCompletedIntroInSession = true;
    }
  }, [isHome]);

  const handleIntroFadeNav = useCallback(() => {
    setNavVisible(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setNavVisible(true);
    setIsIntroActive(false);
    hasCompletedIntroInSession = true;
    try {
      localStorage.setItem(LAST_PLAYED_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navigation isVisible={navVisible} />
              <WorkStrip
                isIntroActive={isIntroActive}
                onIntroFadeNav={handleIntroFadeNav}
                onIntroComplete={handleIntroComplete}
              />
            </>
          }
        />

        <Route path="/about" element={<ContactPage />} />
        <Route path="/work" element={<ProjectsPage />} />
        <Route path="/work/:id" element={<SingleProjectPage />} />
      </Routes>
      <Footer isVisible={!isHome || navVisible} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

