# Dohyo Clash

A polished, quick-play 3D sumo game. Keep your feet on the raised dohyo and send your opponent flying. Built with Three.js, WebGL, HTML, and vanilla JavaScript. Arena characters, crowd, particles, and sounds are generated at runtime; no downloads or asset build step are needed.

## Run locally

ES modules need an HTTP server. From this folder, run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Node users can run `npx serve .` instead. Internet access is needed to load Three.js and the optional Google fonts from their CDNs. If the fonts cannot load, the game falls back to system sans-serif fonts. Collision effects use Web Audio and silently fall back when audio is unavailable.

## Controls

| Action | Player 1 | Player 2 |
| --- | --- | --- |
| Move | W A S D | Arrow keys |
| Shove | Hold Space to charge; release to launch | Enter |
| Brace | Left Shift | Right Shift |

On touch screens, drag the thumb stick and tap **POW!** or hold **BRACE**. Select **How to play** from the title screen for the quick rules.

## Modes and match flow

- **Play vs CPU:** Musashi vs CPU Kaito. Pick Chill, Spicy, or Savage CPU settings. Difficulty changes CPU reaction timing and decisions; it never gives the CPU extra strength or speed.
- **Local versus:** WASD vs arrow keys on one keyboard. Touch controls move player one.
- **Best of 3:** First to two round wins takes the match. A single-round option is in Settings.
- **Impact feel:** timed wind-up, shove contact, recovery, momentum, brace, knockback, hit-stop, camera shake, dust, and short procedural Web Audio sounds.

## Project map

- `src/main.js` — scene setup, round flow, UI, and animation loop
- `src/arena.js` — ring, stadium, lights, banners, crowd, and arena details
- `src/wrestler.js` — procedural character models and poses
- `src/input.js` — keyboard and touch input
- `src/ai.js` — CPU pursuit, edge recovery, shoves, and bracing
- `src/audio.js` — synthesized impact sounds with graceful no-audio fallback
- `src/physics.js` — momentum, shove timing, collisions, ring-edge knockouts, and particles
