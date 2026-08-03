// Control: React + react-dom only. Everything the library costs is measured as
// a delta against this file.
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(<button>plain</button>);
