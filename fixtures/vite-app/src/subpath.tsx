// The subpath export added in I-02. Should cost the same as the barrel once
// tree-shaking works — if it does not, the barrel is still dragging code along.
import { createRoot } from 'react-dom/client';
import { Button } from '@echoit/itui.css/button';

createRoot(document.getElementById('root')!).render(<Button>one</Button>);
