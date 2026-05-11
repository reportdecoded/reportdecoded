'use client';
import { generateReactHelpers } from '@uploadthing/react';

// Typed React helpers for our UploadThing file router. The endpoint name
// 'inspectionReport' matches what's exported from app/api/uploadthing/core.js.
export const { useUploadThing, uploadFiles } = generateReactHelpers();
