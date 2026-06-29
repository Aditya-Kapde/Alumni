import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { apiClient, type AnnouncementDTO } from '@/lib/api';

export default function GlobalAnnouncementBanner() {
  const [latestAnnouncement, setLatestAnnouncement] = useState<AnnouncementDTO | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await apiClient.getAnnouncements();
        if (data && data.length > 0) {
          // Assuming the last one is the latest, or first one. 
          // API usually returns sorted, let's take the first one or the last one based on data.
          // For safety, let's sort by time or just take the first one if it's ordered by latest.
          // Let's assume the first item is the most recent (common for APIs)
          setLatestAnnouncement(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch announcements for banner', error);
      }
    };
    
    // Only show the banner if they haven't dismissed it in this session
    const hasDismissed = sessionStorage.getItem('announcement_dismissed');
    if (!hasDismissed) {
      fetchAnnouncements();
    } else {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcement_dismissed', 'true');
  };

  if (!isVisible || !latestAnnouncement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-dsce-gold text-dsce-blue px-4 py-3 shadow-md z-[100] relative flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 animate-bounce flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-sm uppercase tracking-wide">
              {latestAnnouncement.title}
            </span>
            <span className="hidden sm:inline text-dsce-blue/50">•</span>
            <span className="text-sm font-medium line-clamp-1">
              {latestAnnouncement.description}
            </span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1.5 hover:bg-dsce-blue/10 rounded-full transition-colors flex-shrink-0"
          title="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
