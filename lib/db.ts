import 'server-only'
//import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import {neon, neonConfig} from '@neondatabase/serverless';
import * as schema from '@/db/schema';

import ws from 'ws';
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

const sql = neon(process.env.DB_URL!);

export const db = drizzle({ client: sql, schema: schema});