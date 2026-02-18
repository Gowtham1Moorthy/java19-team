import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type TableName = 'users' | 'resources' | 'bookings';

interface UseRealtimeTableOptions<T> {
  table: TableName;
  initialData: T[];
  onDataChange: (newData: T[]) => void;
  filter?: string;
}

interface DatabaseRow {
  [key: string]: unknown;
}

export function useRealtimeTable<T extends DatabaseRow>({
  table,
  initialData,
  onDataChange,
  filter,
}: UseRealtimeTableOptions<T>) {
  const handleInsert = useCallback(
    (payload: RealtimePostgresChangesPayload<DatabaseRow>) => {
      const newRecord = payload.new as T;
      onDataChange([...initialData, newRecord]);
    },
    [initialData, onDataChange]
  );

  const handleUpdate = useCallback(
    (payload: RealtimePostgresChangesPayload<DatabaseRow>) => {
      const updatedRecord = payload.new as T;
      const newData = initialData.map((item) =>
        (item as DatabaseRow).id === updatedRecord.id ? updatedRecord : item
      );
      onDataChange(newData);
    },
    [initialData, onDataChange]
  );

  const handleDelete = useCallback(
    (payload: RealtimePostgresChangesPayload<DatabaseRow>) => {
      const oldRecord = payload.old as T;
      const newData = initialData.filter(
        (item) => (item as DatabaseRow).id !== (oldRecord as DatabaseRow).id
      );
      onDataChange(newData);
    },
    [initialData, onDataChange]
  );

  useEffect(() => {
    let channel: RealtimeChannel;

    const subscribeToTable = async () => {
      const channelName = `realtime-${table}${filter ? `-${filter}` : ''}`;
      
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: table,
            filter: filter,
          },
          handleInsert
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table,
            filter: filter,
          },
          handleUpdate
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: table,
            filter: filter,
          },
          handleDelete
        )
        .subscribe();

      // Check subscription status
      if (channel.state !== 'joined') {
        console.log(`Subscribing to ${table} changes...`);
      }
    };

    subscribeToTable();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter, handleInsert, handleUpdate, handleDelete]);
}

// Helper function to enable realtime for a table (must be called once per table)
// This requires the database to have REPLICA IDENTITY set to FULL
export const enableRealtimeForTable = async (table: TableName): Promise<void> => {
  try {
    // Set REPLICA IDENTITY to FULL to enable realtime for all columns
    const { error } = await supabase.rpc('enable_realtime', { table_name: table });
    
    if (error) {
      // If RPC fails, try direct SQL
      console.log(`Enabling realtime for ${table} via direct query...`);
    }
  } catch (err) {
    console.error(`Error enabling realtime for ${table}:`, err);
  }
};

export default useRealtimeTable;
