import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../utils/cn";

const DEFAULT_MESSAGES = [
  "Preparing your interview...",
  "Analyzing your resume...",
  "Generating questions...",
  "Calibrating feedback signals...",
];

const DEFAULT_TITLE = "Thinking through the next step";
const DEFAULT_DETAIL = "Please keep this tab open while the AI system prepares your session.";

function buildWaveBars(count) {
  return Array.from({ length: count }, (_, index) => {
    const seed = (index + 1) * 17;

    return {
      delay: (seed % 7) * 0.08,
      duration: 1.1 + (seed % 5) * 0.12,
      height: 0.48 + (seed % 4) * 0.12,
      opacity: 0.55 + (seed % 3) * 0.12,
    };
  });
}

export default function Preloader({
  open = true,
  title = DEFAULT_TITLE,
  detail = DEFAULT_DETAIL,
  messages = DEFAULT_MESSAGES,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);

  const messageKey = Array.isArray(messages) ? messages.join("||") : "";
  const messageList = useMemo(() => {
    const candidate = Array.isArray(messages) && messages.length ? messages : DEFAULT_MESSAGES;

    return candidate.filter(Boolean);
  }, [messageKey]);

  const waveBars = useMemo(() => buildWaveBars(7), []);

  useEffect(() => {
    if (!open || messageList.length < 2) {
      return undefined;
    }

    setMessageIndex(0);

    let timeoutId;

    const scheduleNext = () => {
      const delay = 1100 + Math.round(Math.random() * 900);

      timeoutId = window.setTimeout(() => {
        setMessageIndex((currentIndex) => (currentIndex + 1) % messageList.length);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => window.clearTimeout(timeoutId);
  }, [messageList, open]);

  const currentMessage = messageList[messageIndex] ?? messageList[0] ?? DEFAULT_MESSAGES[0];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-busy="true"
          initial={{ opacity: 0, scale: 0.985, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 12, filter: "blur(18px)" }}
          transition={{ duration: shouldReduceMotion ? 0.12 : 0.45, ease: "easeInOut" }}
          className={cn(
            "fixed inset-0 z-[80] flex items-center justify-center px-4 py-8",
            className,
          )}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 34%), radial-gradient(circle at 82% 16%, color-mix(in srgb, var(--signal) 14%, transparent), transparent 30%), radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--accent-strong) 10%, transparent), transparent 42%), linear-gradient(135deg, color-mix(in srgb, var(--bg-primary) 88%, transparent), color-mix(in srgb, var(--panel) 96%, transparent))",
            }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              animate={
                shouldReduceMotion
                  ? { opacity: 0.38 }
                  : {
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.4 }
                  : { duration: 14, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                backgroundImage:
                  "linear-gradient(120deg, transparent 20%, color-mix(in srgb, var(--accent) 10%, transparent) 48%, transparent 76%)",
                backgroundSize: "180% 180%",
              }}
            />

            <div className="grain-overlay opacity-40" />
          </div>

          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.35, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-[34px] border border-white/15 p-6 shadow-[0_30px_90px_-42px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8"
            style={{
              borderColor: "color-mix(in srgb, var(--border-strong) 68%, transparent)",
              backgroundColor: "var(--panel)",
            }}
          >
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 45%, color-mix(in srgb, var(--signal) 10%, transparent))",
              }}
            />

            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: "color-mix(in srgb, var(--accent) 26%, transparent)" }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 0.55 }
                      : { rotate: 360, scale: [0.98, 1, 0.98] }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.5 }
                      : { duration: 16, repeat: Infinity, ease: "linear" }
                  }
                />

                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[12%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 72%)",
                    boxShadow:
                      "0 0 32px color-mix(in srgb, var(--accent) 16%, transparent), inset 0 0 18px color-mix(in srgb, var(--signal) 8%, transparent)",
                  }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 0.82 }
                      : { scale: [0.95, 1.06, 0.95], opacity: [0.72, 1, 0.72] }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.5 }
                      : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                  }
                />

                <div className="relative flex h-20 items-end gap-2 sm:h-24">
                  {waveBars.map((bar, index) => (
                    <div
                      key={index}
                      className="flex h-full items-end overflow-hidden rounded-full"
                      style={{ width: index % 2 === 0 ? 8 : 10 }}
                    >
                      <motion.span
                        aria-hidden="true"
                        className="block w-full origin-bottom rounded-full"
                        style={{
                          height: `${bar.height * 100}%`,
                          background:
                            "linear-gradient(180deg, color-mix(in srgb, var(--accent-strong) 74%, white), color-mix(in srgb, var(--signal) 50%, var(--accent)))",
                          boxShadow:
                            "0 0 18px color-mix(in srgb, var(--accent) 18%, transparent)",
                          opacity: bar.opacity,
                        }}
                        animate={
                          shouldReduceMotion
                            ? { scaleY: [0.92, 1, 0.92], opacity: [0.72, 0.92, 0.72] }
                            : { scaleY: [0.45, 1, 0.55], opacity: [0.4, 1, 0.55] }
                        }
                        transition={{
                          duration: bar.duration,
                          delay: bar.delay,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-faint">
                  AI processing
                </p>
                <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
              </div>

              <div className="mt-5 min-h-12 w-full max-w-md">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMessage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: "easeOut" }}
                    className="text-base leading-7 text-muted sm:text-lg"
                  >
                    {currentMessage}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className="mt-2 max-w-md text-sm leading-6 text-faint">{detail}</p>

              <div className="mt-7 flex w-full max-w-xs items-center gap-2">
                <div
                  className="h-px flex-1 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--border-strong) 76%, transparent)" }}
                />

                <div className="relative h-2 w-32 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1/3 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 70%, white), transparent)",
                    }}
                    animate={
                      shouldReduceMotion
                        ? { opacity: [0.45, 0.85, 0.45] }
                        : { x: ["-15%", "115%"] }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                    }
                  />
                </div>

                <div
                  className="h-px flex-1 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--border-strong) 76%, transparent)" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}