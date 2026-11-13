/**
 * Property slugs name a folder (`public/properties/<slug>/`) and appear in URLs
 * (`/properties/<slug>`, `/experience/<slug>`). Only simple slugs are accepted, so a URL can never
 * point the site at another host or another folder.
 */
export const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

/** Reserved: `/experience/prototype` opens the built-in illustrative tower (no property data). */
export const PROTOTYPE_SLUG = 'prototype';

export const isSlug = (s) => typeof s === 'string' && SLUG.test(s);
