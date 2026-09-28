import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DentistRecord } from '../types/dentist';
import { generateAllRecords } from '../mock/generator';

interface DentistState {
  records: DentistRecord[];
  updateRecord: (record: DentistRecord) => void;
  toggleStatus: (unique_id: string) => { previousStatus: string; newStatus: string };
  addRecord: (record: DentistRecord) => void;
  bulkUpsert: (newOrUpdated: DentistRecord[], deactivations?: string[]) => void;
  resetToDefault: () => void;
}

export const useDentistStore = create<DentistState>()(
  persist(
    (set, get) => ({
      records: generateAllRecords(),

      updateRecord: (updated) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.unique_id === updated.unique_id ? { ...r, ...updated, updated_at: new Date().toISOString() } : r
          ),
        }));
      },

      toggleStatus: (unique_id) => {
        const state = get();
        const existing = state.records.find((r) => r.unique_id === unique_id);
        const currentActive = existing ? (existing.status !== 'Inactive') : true;
        const newStatus = currentActive ? 'Inactive' : 'Active';

        set((state) => ({
          records: state.records.map((r) =>
            r.unique_id === unique_id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r
          ),
        }));

        return {
          previousStatus: existing?.status || 'Active',
          newStatus,
        };
      },

      addRecord: (record) => {
        set((state) => ({
          records: [
            {
              ...record,
              updated_at: new Date().toISOString(),
            },
            ...state.records,
          ],
        }));
      },

      bulkUpsert: (items, deactivations = []) => {
        set((state) => {
          const map = new Map<string, DentistRecord>();
          // populate existing
          state.records.forEach((r) => map.set(r.unique_id, r));

          // upsert items
          items.forEach((item) => {
            const prev = map.get(item.unique_id);
            map.set(item.unique_id, {
              ...(prev || {}),
              ...item,
              updated_at: new Date().toISOString(),
            });
          });

          // handle deactivations
          deactivations.forEach((uid) => {
            const prev = map.get(uid);
            if (prev) {
              map.set(uid, {
                ...prev,
                status: 'Inactive',
                updated_at: new Date().toISOString(),
              });
            }
          });

          return { records: Array.from(map.values()) };
        });
      },

      resetToDefault: () => {
        set({ records: generateAllRecords() });
      },
    }),
    {
      name: 'dnn_records_v1',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
