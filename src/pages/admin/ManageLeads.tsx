import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Loader2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ManageLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) {
        toast.error(error.message);
        setError(error.message);
      } else {
        setLeads(data || []);
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Lead deleted successfully');
      fetchLeads();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Form Leads</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && leads.length === 0 ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source / Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" /> {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" /> {lead.country_code} {lead.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {lead.project_title ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                          Brochure Request
                        </span>
                        <div className="text-xs text-gray-500 font-medium truncate max-w-[150px]" title={lead.project_title}>
                          {lead.project_title}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Contact Form
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-sm truncate" title={lead.message}>
                      {lead.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(lead.created_at), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
