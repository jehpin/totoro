import React, { useState, useEffect } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, MessageCircle, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import { SingaporeLocation } from '../types';

interface DisqusCommentsProps {
  currentLocation: SingaporeLocation;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({ currentLocation }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const shortname = 'totoro-2';
  
  // Clean canonical URL for Disqus indexing and safe iframe execution
  const pageUrl = `https://totoro-sg.applet.local/location/${currentLocation.id}`;

  const disqusConfig = {
    url: pageUrl,
    identifier: `totoro-sg-${currentLocation.id}`,
    title: `Umbrella Totoro - ${currentLocation.name} (${currentLocation.region} Region) Weather`,
    language: 'en_US',
  };

  useEffect(() => {
    // Reset error when location changes
    setHasError(false);
  }, [currentLocation.id]);

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
          {/* Comment Count Badge using disqus-react CommentCount */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf3e4] border border-[#e9e2d3] text-xs font-bold text-[#5D4037]">
            <MessageCircle className="w-4 h-4 text-[#4A7856]" />
            <CommentCount
              shortname={shortname}
              config={disqusConfig}
            >
              Comments
            </CommentCount>
          </div>

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
        <div className="min-h-[260px] relative">
          {hasError ? (
            <div className="bg-[#fbf9f5] rounded-2xl p-6 border border-[#e9e2d3] text-center flex flex-col items-center gap-3">
              <p className="text-xs font-semibold text-[#5D4037]">
                Discussion module ready for {currentLocation.name}.
              </p>
              <button
                onClick={() => {
                  setHasError(false);
                  setKey((k) => k + 1);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#4A7856] text-white text-xs font-bold rounded-full hover:bg-[#3d6547] transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Discussion</span>
              </button>
            </div>
          ) : (
            <div key={key} className="bg-[#fbf9f5] rounded-2xl p-4 md:p-6 border border-[#e9e2d3]/80">
              <DiscussionEmbed
                shortname={shortname}
                config={disqusConfig}
              />
            </div>
          )}
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#717971] font-medium px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#90BE6D]" />
              Disqus comments for {currentLocation.name} (shortname: {shortname}, lang: en_US)
            </span>
          </div>
        </div>
      )}
    </section>
  );
};


