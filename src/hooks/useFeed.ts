import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeedItem, ItemType } from '@/context/AppState';

export function useFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch benefits
      const { data: benefits, error: benefitsError } = await supabase
        .from('benefits')
        .select('*')
        .order('created_at', { ascending: false });

      if (benefitsError) throw benefitsError;

      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Transform benefits to FeedItem format
      const benefitItems: FeedItem[] = (benefits || []).map(benefit => ({
        id: benefit.id,
        type: 'benefit' as ItemType,
        title: benefit.title,
        summary: benefit.summary,
        eligibility: benefit.eligibility_status as "ELIGIBLE" | "MAYBE" | "INELIGIBLE",
      }));

      // Transform events to FeedItem format
      const eventItems: FeedItem[] = (events || []).map(event => ({
        id: event.id,
        type: 'event' as ItemType,
        title: event.title,
        summary: event.summary,
        date: event.event_date,
        venue: event.venue_name && event.venue_address ? {
          name: event.venue_name,
          address: event.venue_address
        } : undefined,
        eligibility: event.eligibility_status as "ELIGIBLE" | "MAYBE" | "INELIGIBLE",
        distanceKm: event.distance_km || undefined,
      }));

      // Combine and sort by relevance (eligible first, then by date/created_at)
      const combinedFeed = [...benefitItems, ...eventItems].sort((a, b) => {
        // Eligible items first
        if (a.eligibility === 'ELIGIBLE' && b.eligibility !== 'ELIGIBLE') return -1;
        if (b.eligibility === 'ELIGIBLE' && a.eligibility !== 'ELIGIBLE') return 1;
        
        // Then by date for events, newest benefits first
        if (a.type === 'event' && b.type === 'event' && a.date && b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        
        return 0;
      });

      setFeed(combinedFeed);
    } catch (err) {
      console.error('Error fetching feed data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const refreshFeed = () => {
    fetchFeedData();
  };

  return {
    feed,
    loading,
    error,
    refreshFeed
  };
}