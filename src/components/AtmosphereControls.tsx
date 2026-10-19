import React, { useState } from 'react';
import { SCENIC_VIEWS } from '../utils/storage';
import { ScenicView } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, VolumeX, Play, Pause, Sparkles, Eye, Sliders } from 'lucide-react';

interface AtmosphereControlsProps {
  activeView: ScenicView;
  onSelectView: (view: ScenicView) => void;
  blur: number;
  onBlurChange: (val: number) => void;
  dim: number;
  onDimChange: (val: number) => void;
  showParticles: boolean;
  onToggleParticles: () => void;
  onEnterImmersive: () => void;
}

export const AtmosphereControls: React.FC<AtmosphereControlsProps> = ({
  activeView,
  onSelectView,
  blur,
  onBlurChange,
  dim,
  onDimChange,
  showParticles,
  onToggleParticles,
  onEnterImmersive,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(audioEngine.isPlaying());
  const [volume, setVolume] = useState<number>(audioEngine.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getIsMuted());
  const [activeSound, setActiveSound] = useState<'rain' | 'forest_wind' | 'singing_bowl' | 'binaural' | 'none'>(
    audioEngine.getCurrentType()
  );

  const handleSoundChange = (type: 'rain' | 'forest_wind' | 'singing_bowl' | 'binaural' | 'none') => {
    setActiveSound(type);
    if (type === 'none') {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      audioEngine.play(type);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      const targetSound = activeSound === 'none' ? activeView.audioPreset : activeSound;
      handleSoundChange(targetSound);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Visual & Acoustic Sanctuary</span>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display mt-1">Scenic Panoramas & Atmosphere</h1>
          <p className="text-sm text-stone-300 mt-1 max-w-2xl">
            Immerse your daily routines and personal writing in living panoramic vistas and synthesized soundscapes calibrated for deep calm and presence.
          </p>
        </div>
        <button
          onClick={onEnterImmersive}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Eye className="w-4 h-4" />
          Enter Fullscreen Scenic View
        </button>
      </div>

      {/* Grid of Views */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Choose Your Scenic Horizon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENIC_VIEWS.map(view => {
            const isSelected = activeView.id === view.id;
            return (
              <button
                key={view.id}
                onClick={() => {
                  onSelectView(view);
                  if (isPlaying) {
                    handleSoundChange(view.audioPreset);
                  }
                }}
                className={`group relative text-left rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? 'border-amber-300 ring-2 ring-amber-300/30 shadow-lg scale-[1.02]'
                    : 'border-white/15 hover:border-white/40'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={view.imageSrc}
                    alt={view.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
                </div>
                <div className="p-4 bg-stone-950/80 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-200/90">{view.locationLabel}</span>
                    {isSelected && (
                      <span className="text-[11px] font-medium text-amber-300">Active</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{view.name}</h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{view.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Acoustic & Soundscape Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Ambient Soundscapes</h3>
              <p className="text-xs text-stone-400 mt-0.5">Synthesized continuous frequencies with zero loop points or external downloads</p>
            </div>
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg text-stone-900 bg-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Audio' : 'Play Audio'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'forest_wind', label: 'Mountain Wind', desc: 'Breathing alpine breeze' },
              { id: 'rain', label: 'Gentle Rain', desc: 'Soothing rain drops' },
              { id: 'singing_bowl', label: 'Singing Bowl', desc: 'Harmonic 432Hz brass chime' },
              { id: 'binaural', label: 'Theta Wave Drone', desc: '174Hz deep focus meditation' },
            ].map(snd => {
              const active = activeSound === snd.id && isPlaying;
              return (
                <button
                  key={snd.id}
                  onClick={() => handleSoundChange(snd.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-300/15 border-amber-300/60 text-white'
                      : 'bg-stone-950/40 border-white/10 text-stone-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{snd.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />}
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-1 leading-tight">{snd.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={toggleMute}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs text-stone-400">Master Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-300 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <span className="text-xs text-stone-300 font-mono tabular-nums w-8">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Visual Customization & Clarity */}
        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-300" />
            <h3 className="text-base font-semibold text-white">Visual Tuning</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-300 mb-1.5">
                <span>Background Softness</span>
                <span className="font-mono tabular-nums text-stone-400">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={blur}
                onChange={e => onBlurChange(parseInt(e.target.value))}
                className="w-full accent-amber-300 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-stone-300 mb-1.5">
                <span>Dark Scrim & Contrast</span>
                <span className="font-mono tabular-nums text-stone-400">{dim}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                step="5"
                value={dim}
                onChange={e => onDimChange(parseInt(e.target.value))}
                className="w-full accent-amber-300 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Atmospheric Particles</span>
              </div>
              <button
                onClick={onToggleParticles}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  showParticles
                    ? 'bg-amber-300/20 text-amber-200 border border-amber-300/30'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {showParticles ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
