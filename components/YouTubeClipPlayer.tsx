import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
    YTReady?: boolean;
  }
}

interface YouTubeClipPlayerProps {
  videoId: string | null;
  start?: number;
  end?: number;
  onVideoEnd?: () => void;
}

const YouTubeClipPlayer: React.FC<YouTubeClipPlayerProps> = ({ videoId, start, end, onVideoEnd }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const checkInterval = useRef<number | null>(null);
  const loadTimeoutRef = useRef<number | null>(null);
  const isLoadingRef = useRef(true);
  const playerIdRef = useRef<string>('');
  const initializationInProgressRef = useRef(false);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    console.log('[YouTubePlayer] Initializing for video:', videoId);
    let isMounted = true;
    let cleanupInProgress = false;
    isLoadingRef.current = true;
    
    // Generate unique player ID for this instance
    const playerId = `youtube-player-${videoId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    playerIdRef.current = playerId;

    const cleanupPlayer = () => {
      console.log('[YouTubePlayer] Starting cleanup...');
      cleanupInProgress = true;
      
      // Clear any intervals or timeouts
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
        checkInterval.current = null;
      }
      
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }

      // Try to destroy the player, but don't worry if it fails
      if (playerRef.current) {
        try {
          // First pause the video to stop any ongoing operations
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
          
          // Stop the video completely
          if (typeof playerRef.current.stopVideo === 'function') {
            playerRef.current.stopVideo();
          }
          
          // Then destroy, but catch any errors
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (err) {
          // Silently ignore destroy errors
          console.debug('[YouTubePlayer] Cleanup error (ignored):', err);
        }
        playerRef.current = null;
      }
      
      // Clear the container
      if (containerRef.current) {
        // Remove the specific player div if it exists
        const playerDiv = document.getElementById(playerIdRef.current);
        if (playerDiv && playerDiv.parentNode === containerRef.current) {
          containerRef.current.removeChild(playerDiv);
        }
        // Clear any remaining content
        containerRef.current.innerHTML = '';
      }
      
      console.log('[YouTubePlayer] Cleanup complete');
    };

    const createPlayer = () => {
      if (!isMounted || !containerRef.current || cleanupInProgress || initializationInProgressRef.current) {
        console.log('[YouTubePlayer] Skipping player creation - not ready');
        return;
      }

      console.log('[YouTubePlayer] Creating player with ID:', playerId);
      initializationInProgressRef.current = true;
      
      try {
        // Clear any existing content first
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Create a div element for the player
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        playerDiv.style.position = 'absolute';
        playerDiv.style.top = '0';
        playerDiv.style.left = '0';
        playerDiv.style.width = '100%';
        playerDiv.style.height = '100%';
        containerRef.current.appendChild(playerDiv);

        // Set loading timeout
        loadTimeoutRef.current = window.setTimeout(() => {
          if (isMounted && isLoadingRef.current && !cleanupInProgress) {
            console.error('[YouTubePlayer] Timeout reached, player failed to load');
            setError('YouTube player took too long to load');
            setIsLoading(false);
            isLoadingRef.current = false;
            initializationInProgressRef.current = false;
          }
        }, 20000); // Increased to 20 second timeout

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          if (!isMounted || cleanupInProgress || !document.getElementById(playerId)) {
            console.log('[YouTubePlayer] Player div not found, aborting creation');
            initializationInProgressRef.current = false;
            return;
          }

          try {
            playerRef.current = new (window as any).YT.Player(playerId, {
              videoId,
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                controls: 1,
                disablekb: 0,
                fs: 1,
                modestbranding: 1,
                rel: 0,
                ...(start && { start }),
                ...(end && { end }),
              },
              events: {
                onReady: (event: any) => {
                  if (!isMounted || cleanupInProgress) return;
                  console.log('[YouTubePlayer] Player ready!');
                  setIsLoading(false);
                  isLoadingRef.current = false;
                  setError(null);
                  initializationInProgressRef.current = false;
                  
                  if (loadTimeoutRef.current) {
                    clearTimeout(loadTimeoutRef.current);
                    loadTimeoutRef.current = null;
                  }
                  
                  // Start playing
                  try {
                    event.target.playVideo();
                  } catch (err) {
                    console.warn('[YouTubePlayer] Could not auto-play video:', err);
                  }
                  
                  // Set up end time checking if needed
                  if (end && end > 0) {
                    checkInterval.current = window.setInterval(() => {
                      if (!isMounted || !playerRef.current || cleanupInProgress) {
                        if (checkInterval.current) {
                          clearInterval(checkInterval.current);
                          checkInterval.current = null;
                        }
                        return;
                      }
                      
                      try {
                        const currentTime = playerRef.current.getCurrentTime();
                        if (currentTime && currentTime >= end) {
                          playerRef.current.pauseVideo();
                          if (checkInterval.current) {
                            clearInterval(checkInterval.current);
                            checkInterval.current = null;
                          }
                          if (onVideoEnd) {
                            onVideoEnd();
                          }
                        }
                      } catch (err) {
                        // Ignore time check errors
                      }
                    }, 1000);
                  }
                },
                onError: (event: any) => {
                  if (!isMounted || cleanupInProgress) return;
                  console.error('[YouTubePlayer] Error:', event.data);
                  let errorMessage = 'Failed to load video';
                  switch (event.data) {
                    case 2:
                      errorMessage = 'Invalid video ID';
                      break;
                    case 5:
                      errorMessage = 'HTML5 player error';
                      break;
                    case 100:
                      errorMessage = 'Video not found';
                      break;
                    case 101:
                    case 150:
                      errorMessage = 'Video cannot be embedded';
                      break;
                  }
                  setError(errorMessage);
                  setIsLoading(false);
                  isLoadingRef.current = false;
                  initializationInProgressRef.current = false;
                },
                onStateChange: (event: any) => {
                  if (!isMounted || cleanupInProgress) return;
                  // Handle player state changes if needed
                  if (event.data === window.YT?.PlayerState?.CUED) {
                    try {
                      event.target.playVideo();
                    } catch (err) {
                      console.warn('[YouTubePlayer] Could not play video:', err);
                    }
                  }
                },
              },
            });
          } catch (error) {
            console.error('[YouTubePlayer] Error creating player:', error);
            setError('Failed to initialize YouTube player');
            setIsLoading(false);
            isLoadingRef.current = false;
            initializationInProgressRef.current = false;
          }
        }, 100); // Small delay to ensure DOM is ready
      } catch (error) {
        console.error('[YouTubePlayer] Error in createPlayer:', error);
        setError('Failed to initialize YouTube player');
        setIsLoading(false);
        isLoadingRef.current = false;
        initializationInProgressRef.current = false;
      }
    };

    const loadPlayer = () => {
      if (!isMounted || !containerRef.current || cleanupInProgress) return;
      
      console.log('[YouTubePlayer] Checking if YT API is loaded...');
      if (window.YT && window.YT.Player) {
        console.log('[YouTubePlayer] YT API is ready, creating player');
        // Add a small delay to avoid conflicts with cleanup
        setTimeout(() => {
          if (isMounted && !cleanupInProgress) {
            createPlayer();
          }
        }, 50);
      } else {
        console.log('[YouTubePlayer] YT API not ready, will retry...');
        // Set up a temporary callback for when API loads
        const originalCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          console.log('[YouTubePlayer] YT API ready callback fired');
          window.YTReady = true;
          if (originalCallback) originalCallback();
          if (isMounted && !cleanupInProgress) {
            createPlayer();
          }
        };
        
        // Also check periodically in case the callback already fired
        let checkCount = 0;
        const checkAPI = setInterval(() => {
          checkCount++;
          if (window.YT && window.YT.Player) {
            console.log('[YouTubePlayer] YT API became available');
            clearInterval(checkAPI);
            if (isMounted && !cleanupInProgress) {
              createPlayer();
            }
          } else if (checkCount > 20) { // 10 seconds
            console.error('[YouTubePlayer] YT API failed to load after 10 seconds');
            clearInterval(checkAPI);
            setError('Failed to load YouTube player API');
            setIsLoading(false);
            isLoadingRef.current = false;
          }
        }, 500);
      }
    };

    // Load the YouTube IFrame API if not present
    if (!window.YT && !window.YTReady) {
      console.log('[YouTubePlayer] Loading YouTube IFrame API...');
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        tag.onerror = () => {
          console.error('[YouTubePlayer] Failed to load YouTube API script');
          setError('Failed to load YouTube API');
          setIsLoading(false);
          isLoadingRef.current = false;
        };
        document.body.appendChild(tag);
      }
      loadPlayer();
    } else {
      console.log('[YouTubePlayer] YT API already exists, loading player');
      loadPlayer();
    }

    // Cleanup function
    return () => {
      console.log('[YouTubePlayer] Component unmounting...');
      isMounted = false;
      initializationInProgressRef.current = false;
      
      // Clean up player
      cleanupPlayer();
      
      // Reset state
      setIsLoading(true);
      setError(null);
    };
  }, [videoId, start, end]);

  if (!videoId) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">No video available for this card</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-8 text-center">
        <p className="text-red-600 mb-2">⚠️ Video Error</p>
        <p className="text-gray-700">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Video ID: {videoId}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center z-10">
          <div className="text-white text-lg">Loading video...</div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="relative w-full bg-black rounded-lg overflow-hidden"
        style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
      />
    </div>
  );
};

export default YouTubeClipPlayer;
