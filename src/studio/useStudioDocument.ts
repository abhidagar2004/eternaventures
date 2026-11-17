import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { readStudioDocument, saveStudioDocument } from './store';
import { emptyStudioDocument, type StudioDocument } from './types';

export function useStudioDocument(path: string) {
  const [value, setValue] = useState<StudioDocument>(emptyStudioDocument);
  const [published, setPublished] = useState<StudioDocument>(emptyStudioDocument);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loadError, setLoadError] = useState('');
  const busy = useRef(false);
  const revision = useRef(0);
  const activePath = useRef(path);
  activePath.current = path;
  useEffect(() => {
    let active = true;
    setLoading(true);
    setDirty(false);
    setLoadError('');
    Promise.all([readStudioDocument(path), readStudioDocument(path, true)]).then(([live, draft]) => {
      if (!active) return;
      setPublished(live);
      setValue(draft.updatedAt > live.updatedAt ? draft : live);
    }).catch(error => { if (active) setLoadError(error.message || 'Unable to load saved content.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path]);
  useEffect(() => {
    const preventLoss = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener('beforeunload', preventLoss);
    return () => window.removeEventListener('beforeunload', preventLoss);
  }, [dirty]);
  function edit(update: StudioDocument | ((current: StudioDocument) => StudioDocument)) {
    revision.current += 1;
    setValue(update);
    setDirty(true);
  }
  async function save(draft: boolean) {
    if (busy.current || loading || loadError) return;
    busy.current = true;
    const savedPath = path;
    const savedRevision = revision.current;
    setSaving(true);
    try {
      const result = await saveStudioDocument(path, value, draft, published.version);
      if (activePath.current !== savedPath) return;
      if (revision.current === savedRevision) setValue(result);
      if (!draft) setPublished(result);
      setDirty(revision.current !== savedRevision);
      toast.success(draft ? 'Draft saved in this browser.' : 'Published to your website.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save. Please try again.');
    } finally { busy.current = false; setSaving(false); }
  }
  return { value, edit, published, loading, saving, dirty, loadError, save };
}
