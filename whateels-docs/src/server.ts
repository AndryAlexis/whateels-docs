import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import 'dotenv/config';
import express from 'express';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import OpenAI from 'openai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const openAiClient = process.env['OPENAI_API_KEY']
  ? new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })
  : null;

app.use(express.json());

app.get('/api/pages-index', async (_req, res) => {
  try {
    const candidateRoots = [
      join(browserDistFolder, 'assets', 'pages'),
      join(process.cwd(), 'src', 'assets', 'pages'),
    ];

    let pagesRoot: string | null = null;
    let categoryEntries: Array<{ name: string; isDirectory: () => boolean }> | null = null;

    for (const candidateRoot of candidateRoots) {
      try {
        categoryEntries = await readdir(candidateRoot, { withFileTypes: true });
        pagesRoot = candidateRoot;
        break;
      } catch {
        // Try next location.
      }
    }

    if (!pagesRoot || !categoryEntries) {
      throw new Error('Pages root folder was not found.');
    }

    const categories = await Promise.all(
      categoryEntries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const categoryName = entry.name;
          const categoryPath = join(pagesRoot, categoryName);
          const pageEntries = await readdir(categoryPath, { withFileTypes: true });

          const pages = pageEntries
            .filter((pageEntry) => pageEntry.isFile() && pageEntry.name.endsWith('.md'))
            .map((pageEntry) => pageEntry.name.slice(0, -3))
            .sort((a, b) => a.localeCompare(b));

          return {
            name: categoryName,
            pages,
          };
        })
    );

    categories.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ categories });
  } catch {
    res.status(500).json({ categories: [] });
  }
});

app.post('/api/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    res.status(400).json({ message: 'Message is required.' });
    return;
  }

  if (!openAiClient) {
    res.status(500).json({ message: 'OPENAI_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const supportIntentTerms = [
      'real person',
      'someone real',
      'human',
      'human support',
      'support agent',
      'customer support',
      'contact support',
      'contact admin',
      'admin',
      'email',
      'e-mail',
      'help desk',
      'talk to someone',
      'talk with someone',
      'representative',
    ];

    const normalizedMessage = message.toLowerCase();
    const supportIntentFromPrompt = supportIntentTerms.some((term) =>
      normalizedMessage.includes(term)
    );

    const response = await openAiClient.responses.create({
      model: process.env['OPENAI_MODEL'] ?? 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are WhatEELBot, a concise and helpful assistant for the WhatEels documentation website. Highest priority rule: detect when the user wants human help (real person, admin, customer support, representative, email contact, talk to someone). If that intent is present, start your reply with the exact token [[NEEDS_ADMIN_SUPPORT]] and then provide a short helpful response that explicitly tells the user there is a button right below your message to contact the admin/support team.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const rawReply = response.output_text?.trim() || 'I could not generate a response right now.';
    const supportToken = '[[NEEDS_ADMIN_SUPPORT]]';
    const supportIntentFromModel = rawReply.startsWith(supportToken);
    const extractedReply = supportIntentFromModel
      ? rawReply.slice(supportToken.length).trim() || 'I can help you contact the admin team.'
      : rawReply;
    const needsHumanSupport = supportIntentFromPrompt || supportIntentFromModel;
    const shouldMentionButton = needsHumanSupport && !/button\s+(right\s+)?below|below\s+(this\s+)?message/i.test(extractedReply);
    const reply = shouldMentionButton
      ? `${extractedReply} I enabled a button right below this message so you can contact the admin team quickly.`
      : extractedReply;

    res.json({
      message: reply,
      needsHumanSupport,
    });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    res.status(500).json({ message: 'Failed to generate a response.' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
