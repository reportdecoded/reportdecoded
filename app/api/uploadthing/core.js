import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

// File router — exposes the single "inspectionReport" endpoint used by the
// upload widget on the landing page. We do NOT create a Supabase row here;
// that happens in /api/payment after the buyer commits to checkout.
export const ourFileRouter = {
  inspectionReport: f({
    pdf: { maxFileSize: '25MB', maxFileCount: 1 },
  })
    // No auth gate yet — the upload is anonymous until payment.
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => {
      // Returned values are sent back to the client as `serverData`.
      return { url: file.ufsUrl ?? file.url, key: file.key, name: file.name };
    }),

  // White-label logo uploads from the agent dashboard. Smaller size cap (2MB
  // is plenty for a logo), image-only.
  agentLogo: f({
    image: { maxFileSize: '2MB', maxFileCount: 1 },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl ?? file.url, key: file.key, name: file.name };
    }),

  // Phase 4b: agent uploads an inspection PDF for a client from the dashboard.
  // Same 25MB cap as the buyer-side endpoint. Auth gate is enforced at the
  // /api/agent-upload step (UploadThing middleware can't read Supabase session
  // cookies reliably across all environments — gating happens server-side when
  // the agent submits the form).
  agentReport: f({
    pdf: { maxFileSize: '25MB', maxFileCount: 1 },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl ?? file.url, key: file.key, name: file.name };
    }),
};
