# Project rules

- Public contact details live in a browser-safe module, and Contact is a dedicated public route; this keeps dial links consistent without exposing owner email.
- Website development examples are bundled screenshot assets rendered only for that service; this avoids changing other service galleries or creating live demo routes.
- The root owns the persistent site shell, with pathname-keyed Motion spring entry and native view-transition exit; this keeps navigation/background stable during forward and back transitions.
- Uploaded video examples use CDN asset pointers and lightweight poster images only in the video-production gallery; this avoids eagerly downloading videos or modifying website screenshots.
- Ambient and Expo glass styling use shared semantic CSS tokens with reduced-motion fallbacks; optional background images are selected through the CSS image token.