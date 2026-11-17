import { ExternalLink, Loader2, Save, Upload } from 'lucide-react';

export default function StudioHeader({ title, description, path, dirty, saving, disabled, onSave, onPublish, published }: {
  title: string; description: string; path: string; dirty: boolean; saving: boolean; disabled: boolean;
  onSave: () => void; onPublish: () => void; published: boolean;
}) {
  return <><div className="studio-breadcrumb">Studio <span>›</span> {title}</div><header className="studio-page-header"><div><h1>{title}</h1><p>{description}</p></div><div className="studio-publish-actions"><span className={`studio-status${dirty || !published ? ' studio-status-draft' : ''}`}>{dirty ? 'Unsaved changes' : published ? 'Published' : 'Draft'}</span><button title="Save a private draft in this browser" disabled={disabled || saving} onClick={onSave}><Save size={16} />Save Draft</button><a href={path} target="_blank" rel="noopener noreferrer">Preview <ExternalLink size={15} /></a><button className="studio-primary" disabled={disabled || saving} onClick={onPublish}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}Publish</button></div></header></>;
}
