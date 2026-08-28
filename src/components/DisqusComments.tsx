import React, { useState } from 'react';
import { MessageSquare, MessageCircle, ChevronDown, ChevronUp, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { SingaporeLocation } from '../types';

interface DisqusCommentsProps {
  currentLocation: SingaporeLocation;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({ currentLocation }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const shortname = 'totoro-2';
  const embedSrc = `/api/disqus-embed?shortname=${shortname}&id=${encodeURIComponent(currentLocation.id)}&title=${encodeURIComponent(currentLocation.name)}`;
  const directUrl = `https://${shortname}.disqus.com`;

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#efe7d9] soft-shadow flex flex-col gap-6 mt-4">
      {/* Discussion Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#efe7d9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#90BE6D]/20 text-[#2c5836] flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#5D4037]">
                Community Rain Talk & Forecast Comments
              </h3>
              <span className="text-[11px] bg-[#90BE6D]/20 text-[#225031] px-2.5 py-0.5 rounded-full font-bold">
                {currentLocation.name}
              </span>
            </div>
            <p className="text-xs text-[#717971] font-semibold mt-0.5">
              Share real-time street rain updates, umbrella alerts, or sheltered walkway tips
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Discussion Link Badge */}
          <a
            href={directUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf3e4] hover:bg-[#f5ebd6] border border-[#e9e2d3] text-xs font-bold text-[#5D4037] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#4A7856]" />
            <span>Disqus ({shortname})</span>
            <ExternalLink className="w-3 h-3 text-[#717971]" />
          </a>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f5edde] hover:bg-[#efe7d9] text-xs font-bold text-[#5D4037] transition-all cursor-pointer"
          >
            <span>{isExpanded ? 'Hide' : 'Show'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Discussion Embed */}
      {isExpanded && (
        <div className="min-h-[380px] relative flex flex-col gap-2">
          <div className="bg-[#fbf9f5] rounded-2xl p-2 md:p-3 border border-[#e9e2d3]/80 overflow-hidden">
            <iframe
              key={`${currentLocation.id}-${reloadKey}`}
              src={embedSrc}
              title={`Disqus Comments for ${currentLocation.name}`}
              className="w-full min-h-[420px] md:min-h-[480px] border-0 bg-transparent"
              loading="lazy"
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-[#717971] font-medium px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#90BE6D]" />
              Disqus discussion for {currentLocation.name} (language: US English)
            </span>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="flex items-center gap-1 hover:text-[#5D4037] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Frame</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};




