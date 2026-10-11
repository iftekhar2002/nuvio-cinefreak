# Cinefreak for Nuvio

Unofficial provider for Cinefreak movies and individual TV episodes.

## Install

Add this repository URL in the **native Nuvio app's Plugins / Add Repository** screen, then enable Cinefreak:

https://raw.githubusercontent.com/iftekhar2002/nuvio-cinefreak/main/manifest.json

No API key is required. The provider reads public TMDB title pages. An optional personal TMDB API key can be entered in provider settings for API-based metadata lookup; never commit your key to this repository.

**Nuvio Web at nuvioweb.space does not execute JavaScript repository plugins.** Its current custom-source screen treats URLs as media templates. Adding this manifest there will not provide playable streams. Use a native Nuvio build that supports JavaScript plugins.

## Files and testing

- `cinefreak.js`: standalone provider, using Promises for compatibility with dynamically loaded runtimes.
- `manifest.json`: repository manifest with both scrapers and providers entries.
- `provider.test.cjs`: run with `node provider.test.cjs` or `npm test`; no dependencies.
- `configure.cjs`: for forks, run `node configure.cjs USER/REPOSITORY [branch]` to update manifest URLs.

Matches movie title/year and exact TV season/episode. Reads Cinefreak's public player dataset and stream endpoint, returning available 480p, 720p and 1080p direct links. Limits candidate pages to six and concurrent page requests to three. Uses a search fallback when the primary search service fails.

## Validation and limitations

October 12, 2026: five automated tests passed. Live numeric TMDB lookup for movie 640146, without an API key, returned three streams. The sample's 720p and 1080p URLs returned HTTP 200 with Matroska content type; its advertised 480p URL returned HTTP 403. Bachelor Point S5E113 returned two candidates. Actual native-app playback has not been verified.

The provider returns source-advertised links; expired or unavailable candidates may appear. Select the title again to refresh signed URLs. It does not trigger stream-preparation jobs, handle episode packs/ranges, or attach external audio/subtitle files. Embedded media tracks remain available. Conservative title matching can miss alternate names. The first search page is used. Public TMDB pages or source APIs can change or be blocked; use the optional TMDB API key if public metadata lookup fails.

## References

- Example: https://github.com/mahdirdrmc/nuvio-plugin-circle-dflix
- Provider guide: https://github.com/yoruix/nuvio-providers/blob/template/DOCUMENTATION.md
- Community directory: https://nuvioplugin.com/
- Nuvio Web runtime: https://github.com/falcononrails/NuvioWeb/blob/nightly/js/core/player/pluginRuntime.js

Independent of Cinefreak and Nuvio.
