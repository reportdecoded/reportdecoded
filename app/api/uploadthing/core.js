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
};
