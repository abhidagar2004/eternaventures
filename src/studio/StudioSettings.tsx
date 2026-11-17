import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText, LayoutPanelTop, Menu, Shield, Tags, Users } from 'lucide-react';

export default function StudioSettings() {
  return <div><div className="studio-breadcrumb">Studio <span>›</span> Global Settings</div><header className="studio-page-header"><div><h1>Global Settings</h1><p>Manage shared navigation, footer, categories, and website administration.</p></div></header><div className="studio-settings-grid">{[
    { name: 'Header & Navigation', text: 'Logo, navigation links, and Book a Call button.', path: '/admin/navbar', icon: Menu },
    { name: 'Global Footer', text: 'Brand description, social profiles, and footer links.', path: '/admin/footer', icon: LayoutPanelTop },
    { name: 'Categories', text: 'Organize your articles, courses, and projects.', path: '/admin/categories', icon: Tags },
    { name: 'Testimonials', text: 'Client reviews and profile images.', path: '/admin/testimonials', icon: Users },
    { name: 'Legal Pages', text: 'Terms, privacy, and copyright content.', path: '/admin/legal', icon: FileText },
    { name: 'Administrators', text: 'Manage your existing administrator accounts.', path: '/admin/admins', icon: Shield },
  ].map(({ name, text, path, icon: Icon }) => <Link className="studio-panel" to={path} key={path}><Icon size={26} /><h2>{name}</h2><p>{text}</p><ArrowUpRight size={20} /></Link>)}</div></div>;
}
