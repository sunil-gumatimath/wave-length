import { drizzle } from 'drizzle-orm/neon-http';

export function getLocalDb<T extends Record<string, unknown>>(httpUrl: string, schema: T) {
    const localSql = async (query: string, params: any[], method: 'all' | 'execute' = 'all') => {
        try {
            const res = await fetch(httpUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, params }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Proxy error (${res.status}): ${errorText}`);
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // If we're just executing (INSERT/UPDATE/DELETE without returning)
            if (method === 'execute') {
                return { rows: [] };
            }

            // Drizzle expecting { rows: any[][], fields: any[] } for 'all' method
            if (!Array.isArray(data)) {
                return { rows: [], fields: [] };
            }

            if (data.length === 0) {
                return { rows: [], fields: [] };
            }

            // Transform object rows to array rows for Neon HTTP driver compatibility
            const fieldNames = Object.keys(data[0]);

            // Use dataTypeID 0 for all columns - we'll handle date parsing in the service layer
            // This bypasses Drizzle's internal type mapping which doesn't work correctly
            // with our HTTP proxy
            const fields = fieldNames.map(name => ({ name, dataTypeID: 0 }));
            const rows = data.map((row: any) => fieldNames.map(name => row[name]));

            return { rows, fields };
        } catch (error) {
            console.error('Local DB Error:', error);
            throw error;
        }
    };

    return drizzle(localSql as any, { schema });
}
