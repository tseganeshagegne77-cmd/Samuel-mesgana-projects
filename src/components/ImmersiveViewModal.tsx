import React, { useState, useEffect } from 'react';
import { ScenicView, JournalEntry } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, VolumeX, X, PenLine, Check } from 'lucide-react';

interface ImmersiveViewModalProps {
  activeView: ScenicView;
  onExit: () => void;
  onQuickSaveNote: (note: string) => void;
}

export const ImmersiveViewModal: React.FC<ImmersiveViewModalProps> = ({
  activeView,
  onExit,
  onQuickSaveNote,
}) => {
  const [time, setTime] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(audioEngine.isPlaying());
  const [showNotePad, setShowNotePad] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [savedCheck, setSavedCheck] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Breathing pacer cycle (4-4-4-4 Box Breathing)
  useEffect(() => {
    const phases: ('Inhale' | 'Hold' | 'Exhale' | 'Rest')[] = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      audioEngine.play(activeView.audioPreset);
      setIsPlayingAudio(true);
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    onQuickSaveNote(noteContent.trim());
    setSavedCheck(true);
    setTimeout(() => {
      setSavedCheck(false);
      setNoteContent('');
      setShowNotePad(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 text-white select-none">
      {/* Top Bar: View Name & Controls */}
      <div className="flex items-center justify-between z-20">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-200/80 font-medium">
            {activeView.locationLabel}
          </span>
          <h2 className="text-lg font-bold text-white font-display">{activeView.name}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-900/80 border border-white/15 backdrop-blur-md text-xs font-medium transition-colors cursor-pointer"
          >
            {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isPlayingAudio ? 'Sound Playing' : 'Play Sound'}</span>
          </button>

          <button
            onClick={() => setShowNotePad(!showNotePad)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-900/80 border border-white/15 backdrop-blur-md text-xs font-medium transition-colors cursor-pointer"
          >
            <PenLine className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick Reflection</span>
          </button>

          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-stone-900/60 hover:bg-stone-900/80 border border-white/15 backdrop-blur-md text-white transition-colors cursor-pointer"
            title="Exit Full View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Centerpiece: Subtle Atmospheric Clock & Breathing Circle */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 z-20 pointer-events-none">
        <div className="text-7xl md:text-8xl font-extralight tracking-tight font-mono tabular-nums drop-shadow-md text-white/90">
          {time}
        </div>

        {/* Breathing pacer */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-16 h-16 rounded-full border border-amber-300/40 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
              breathPhase === 'Inhale' || breathPhase === 'Hold'
                ? 'scale-125 bg-amber-300/15'
                : 'scale-90 bg-amber-300/5'
            }`}
          >
            <span className="text-[11px] font-medium tracking-wider uppercase text-amber-200">
              {breathPhase}
            </span>
          </div>
          <span className="text-xs text-stone-300/80 drop-shadow">4s Box Breathing Cycle</span>
        </div>
      </div>

      {/* Quick Note Floating Drawer */}
      {showNotePad && (
        <div className="fixed bottom-24 right-8 z-30 w-80 p-5 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-amber-200 font-semibold">
            <span>Ephemeral Thought</span>
            <button onClick={() => setShowNotePad(false)} className="text-stone-400 hover:text-white">
              Close
            </button>
          </div>
          <textarea
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            rows={4}
            placeholder="Jot down a fleeting thought or gratitude..."
            className="w-full p-2.5 text-xs bg-stone-950/80 border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-300"
          />
          <button
            onClick={handleSaveNote}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-amber-300 hover:bg-amber-200 text-stone-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {savedCheck ? (
              <>
                <Check className="w-3.5 h-3.5" /> Saved to Journal!
              </>
            ) : (
              'Save to Today’s Journal'
            )}
          </button>
        </div>
      )}

      {/* Bottom Bar: Quiet Whisper */}
      <div className="flex items-center justify-between text-xs text-stone-300/80 z-20">
        <span>Click Esc or Exit to return to workspace</span>
        <span>AuraView Sanctuary</span>
      </div>
    </div>
  );
};
