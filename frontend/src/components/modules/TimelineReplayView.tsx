import React, { useEffect, useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
}

export const TimelineReplayView: React.FC = () => {
  const events: TimelineEvent[] = [
    {
      id: 1,
      title: 'Initial Fund Injection',
      description:
        'Escrow wallet deposited 2.86 BTC into mixing pool interface from IP 10.115.196.73.',
    },
    {
      id: 2,
      title: 'Recursive Mixer Hop #1',
      description:
        'Wasabi zero-fee coordination splits UTXOs into equal denominations across 10.162.112.72.',
    },
    {
      id: 3,
      title: 'P2P Relay Obfuscation',
      description:
        'Tor exit node handshake established across 4 decentralized P2P peers (IN AS9498).',
    },
    {
      id: 4,
      title: 'Target Deposit Flagged',
      description:
        'Final destination wallet identified. Automated zero-egress alert triggered in Memgraph cluster.',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Stores the actual IST timestamp when each event becomes active
  const [eventTimes, setEventTimes] = useState<
    Record<number, string>
  >({});

  // Get current Indian Standard Time
  const getCurrentIST = () => {
    const time = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());

    return `${time} IST`;
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= events.length) {
      setIsPlaying(false);
      setIsCompleted(true);
      return;
    }

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;

      // Capture the exact current IST time
      // when the next forensic event appears
      setEventTimes((currentTimes) => {
        if (currentTimes[nextStep]) {
          return currentTimes;
        }

        return {
          ...currentTimes,
          [nextStep]: getCurrentIST(),
        };
      });

      setCurrentStep(nextStep);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, events.length]);

  const handlePlayPause = () => {
    if (isCompleted) {
      setCurrentStep(0);
      setEventTimes({});
      setIsCompleted(false);
      setIsPlaying(true);

      return;
    }

    // When starting for the first time,
    // capture time for the first event
    if (currentStep === 0 && !isPlaying) {
      setEventTimes({
        1: getCurrentIST(),
      });
    }

    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsCompleted(false);

    // Clear timestamps so the next replay
    // generates fresh real-time values
    setEventTimes({});
  };

  return (
    <div className="space-y-6 text-stone-900 font-sans max-w-7xl mx-auto antialiased">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/90 backdrop-blur-md border border-stone-200/80 p-6 rounded-2xl shadow-xs gap-4">

        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300/60 rounded-xl text-xs font-mono font-bold uppercase tracking-wider">
            Step-by-Step Forensic Reconstruction of Cross-Chain Fund Movements & P2P Broadcasts
          </span>

          <h2 className="text-lg font-bold text-stone-900 mt-2 flex items-center tracking-tight">
            <Clock className="w-5 h-5 mr-2 text-amber-700" />
            Chronological Multi-Hop Timeline Replay
          </h2>
        </div>

        <div className="flex gap-3">

          {/* RESET */}
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-xl text-xs font-mono font-bold transition-all flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>

          {/* PLAY / PAUSE */}
          <button
            onClick={handlePlayPause}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-xs flex items-center active:scale-95 ${
              isCompleted
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : isPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-amber-700 hover:bg-amber-800 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Replay Again
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Replay
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Replay
              </>
            )}
          </button>

        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs">

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
            Replay Progress
          </span>

          <span className="text-xs font-mono text-amber-700 font-bold">
            {Math.round((currentStep / events.length) * 100)}%
          </span>
        </div>

        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-amber-600 transition-all duration-500 rounded-full"
            style={{
              width: `${(currentStep / events.length) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* TIMELINE */}
      <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 shadow-xs">

        <div className="space-y-3">

          {events.map((event, index) => {
            const stepNumber = index + 1;

            const isActive =
              currentStep === stepNumber && isPlaying;

            const isCompletedStep =
              currentStep > stepNumber ||
              (isCompleted && currentStep >= stepNumber);

            const isPending =
              currentStep < stepNumber;

            return (
              <div
                key={event.id}
                className={`p-5 rounded-xl border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-amber-50 border-amber-400 shadow-md scale-[1.01]'
                    : isCompletedStep
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : isPending
                    ? 'bg-stone-50 border-stone-200 opacity-50'
                    : 'bg-white border-stone-200'
                }`}
              >

                <div className="flex items-start">

                  {/* STEP NUMBER */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold mr-4 ${
                      isActive
                        ? 'bg-amber-700 text-white animate-pulse'
                        : isCompletedStep
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {isCompletedStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      `0${event.id}`
                    )}
                  </div>

                  {/* EVENT DETAILS */}
                  <div>

                    <h3
                      className={`font-mono font-bold text-sm ${
                        isActive
                          ? 'text-amber-900'
                          : isCompletedStep
                          ? 'text-emerald-800'
                          : 'text-stone-500'
                      }`}
                    >
                      {event.title}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {event.description}
                    </p>

                    {isActive && (
                      <div className="mt-2 text-[10px] font-mono text-amber-700 font-bold animate-pulse">
                        ● ANALYZING CURRENT EVENT...
                      </div>
                    )}

                    {isCompletedStep && (
                      <div className="mt-2 text-[10px] font-mono text-emerald-700 font-bold">
                        ✓ FORENSIC EVENT VERIFIED
                      </div>
                    )}

                  </div>

                </div>

                {/* AUTO-CAPTURED TIME */}
                <div
                  className={`text-xs font-mono whitespace-nowrap ${
                    isActive
                      ? 'text-amber-700 font-bold'
                      : isCompletedStep
                      ? 'text-emerald-700'
                      : 'text-stone-400'
                  }`}
                >
                  {eventTimes[stepNumber] || '--:--:-- IST'}
                </div>

              </div>
            );
          })}

        </div>

        {/* COMPLETED MESSAGE */}
        {isCompleted && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center">

            <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3" />

            <div>
              <div className="text-sm font-bold text-emerald-800">
                Forensic Timeline Replay Complete
              </div>

              <div className="text-xs text-emerald-700 mt-1">
                All transaction hops have been reconstructed and verified.
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};