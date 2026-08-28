import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, MessageCircle, ChevronDown, ChevronUp, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';
import { SingaporeLocation } from '../types';

declare global {
  interface Window {
    DISQUS?: {
      reset: (args: { reload: boolean; config: () => void }) => void;
    };
    DISQUSWIDGETS?: {
      getCount: (args?: { reset: boolean }) => void;
    };
    disqus_config?: () => void;
    disqus_shortname?: string;
  }
}

interface DisqusCommentsProps {
  currentLocation: SingaporeLocation;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({ currentLocation }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const threadRef = useRef<HTMLDivElement>(null);

  const shortname = 'totoro-2';
  const pageIdentifier = `totoro-sg-${currentLocation.id}`;
  const pageUrl = `https://totoro-sg.applet.local/location/${currentLocation.id}`;
  const pageTitle = `Umbrella Totoro - ${currentLocation.name} (${currentLocation.region} Region) Weather`;

  useEffect(() => {
    setLoadError(false);
    setIsLoading(true);

    const configureDisqus = function (this: any) {
      this.page.identifier = pageIdentifier;
      this.page.url = pageUrl;
      this.page.title = pageTitle;
      this.language = 'en_US';
    };

    if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config: configureDisqus,
        });
        setIsLoading(false);
      } catch (err) {
        console.warn('Disqus reset notice:', err);
        setIsLoading(false);
      }
    } else {
      window.disqus_config = configureDisqus;
      window.disqus_shortname = shortname;

      const existingScript = document.getElementById('dsq-embed-scr');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'dsq-embed-scr';
        script.src = `https://${shortname}.disqus.com/embed.js`;
        script.async = true;
        script.setAttribute('data-timestamp', String(+new Date()));

        script.onload = () => {
          setIsLoading(false);
        };

        script.onerror = () => {
          console.warn('Disqus external script could not be reached (possibly blocked by privacy filter or offline).');
          setLoadError(true);
          setIsLoading(false);
        };

        (document.head || document.body).appendChild(script);
      } else {
        setIsLoading(false);
      }
    }

    // Refresh comment count script safely
    try {
      const countScript = document.getElementById('dsq-count-scr');
      if (!countScript) {
        const script = document.createElement('script');
        script.id = 'dsq-count-scr';
        script.src = `https://${shortname}.disqus.com/count.js`;
        script.async = true;
        (document.head || document.body).appendChild(script);
      } else if (window.DISQUSWIDGETS) {
        window.DISQUSWIDGETS.getCount({ reset: true });
      }
    } catch {
      // Non-blocking
    }
  }, [currentLocation.id, pageIdentifier, pageUrl, pageTitle]);

  const handleRetry = () => {
    setLoadError(false);
    setIsLoading(true);
    const existing = document.getElementById('dsq-embed-scr');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'dsq-embed-scr';
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.async = true;
    script.setAttribute('data-timestamp', String(+new Date()));
    script.onload = () => setIsLoading(false);
    script.onerror = () => {
      setLoadError(true);
      setIsLoading(false);
    };
    (document.head || document.body).appendChild(script);
  };

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
          {/* Comment Count Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf3e4] border border-[#e9e2d3] text-xs font-bold text-[#5D4037]">
            <MessageCircle className="w-4 h-4 text-[#4A7856]" />
            <a
              href={`${pageUrl}#disqus_thread`}
              data-disqus-identifier={pageIdentifier}
              className="disqus-comment-count hover:underline"
            >
              Comments
            </a>
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
          {loadError ? (
            <div className="bg-[#fbf9f5] rounded-2xl p-6 border border-[#e9e2d3] text-center flex flex-col items-center gap-3">
              <p className="text-xs font-semibold text-[#5D4037]">
                Disqus discussion module for {currentLocation.name} is ready.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#4A7856] text-white text-xs font-bold rounded-full hover:bg-[#3d6547] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Comments</span>
                </button>
                <a
                  href={`https://${shortname}.disqus.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#efe7d9] text-[#5D4037] text-xs font-bold rounded-full hover:bg-[#e4dcce] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Disqus</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#fbf9f5] rounded-2xl p-4 md:p-6 border border-[#e9e2d3]/80">
              {isLoading && (
                <div className="flex items-center justify-center py-8 text-xs text-[#717971] gap-2">
                  <div className="w-4 h-4 border-2 border-[#4A7856] border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to Disqus ({shortname})...</span>
                </div>
              )}
              <div ref={threadRef} id="disqus_thread" />
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



