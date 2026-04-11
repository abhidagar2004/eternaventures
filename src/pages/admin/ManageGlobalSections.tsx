import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageGlobalSections() {
  const [activeTab, setActiveTab] = useState<'whyus' | 'process'>('whyus');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Why Us items state
  const [whyUsItems, setWhyUsItems] = useState<any[]>([]);
  const [showWhyUsModal, setShowWhyUsModal] = useState(false);
  const [editingWhyUs, setEditingWhyUs] = useState<any>(null);
  const [whyUsForm, setWhyUsForm] = useState({ title: '', description: '', order_index: 0 });

  // Process Steps state
  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [editingProcess, setEditingProcess] = useState<any>(null);
  const [processForm, setProcessForm] = useState({ step_num: '', title: '', description: '', order_index: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: wuData }, { data: pData }] = await Promise.all([
        supabase.from('why_us_items').select('*').order('order_index', { ascending: true }),
        supabase.from('process_steps').select('*').order('order_index', { ascending: true })
      ]);
      if (wuData) setWhyUsItems(wuData);
      if (pData) setProcessSteps(pData);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic Save Handler
  const handleSave = async (table: string, formState: any, editingItem: any, setModalView: any) => {
    if (!formState.title || !formState.description) {
      toast.error('Title and Description are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const { error } = await supabase.from(table).update(formState).eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Updated successfully');
      } else {
        const { error } = await supabase.from(table).insert([formState]);
        if (error) throw error;
        toast.success('Added successfully');
      }
      setModalView(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2596be]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Global Sections</h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('whyus')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'whyus' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Why Us (Features)
        </button>
        <button 
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'process' ? 'bg-[#2596be] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          How We Work (Process)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
        {/* Why Us Tab */}
        {activeTab === 'whyus' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">"Why Us" Features</h2>
              <button
                onClick={() => {
                  setEditingWhyUs(null);
                  setWhyUsForm({ title: '', description: '', order_index: whyUsItems.length });
                  setShowWhyUsModal(true);
                }}
                className="bg-[#2596be] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>
            
            <div className="space-y-4">
              {whyUsItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <span className="text-xs text-gray-400">Order: {item.order_index}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingWhyUs(item); setWhyUsForm({ title: item.title, description: item.description, order_index: item.order_index }); setShowWhyUsModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete('why_us_items', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {whyUsItems.length === 0 && <p className="text-center text-gray-500 py-4">No features added yet.</p>}
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">"How We Work" Steps</h2>
              <button
                onClick={() => {
                  setEditingProcess(null);
                  setProcessForm({ step_num: `0${processSteps.length + 1}`, title: '', description: '', order_index: processSteps.length });
                  setShowProcessModal(true);
                }}
                className="bg-[#2596be] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Step
              </button>
            </div>
            
            <div className="space-y-4">
              {processSteps.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-xs mb-2">Step {item.step_num}</span>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingProcess(item); setProcessForm({ step_num: item.step_num, title: item.title, description: item.description, order_index: item.order_index }); setShowProcessModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete('process_steps', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {processSteps.length === 0 && <p className="text-center text-gray-500 py-4">No steps added yet.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Why Us Modal */}
      {showWhyUsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingWhyUs ? 'Edit Feature' : 'Add Feature'}</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Title</label><input type="text" value={whyUsForm.title} onChange={e => setWhyUsForm({...whyUsForm, title: e.target.value})} className="w-full border rounded p-2"/></div>
              <div><label className="text-sm font-medium">Description</label><textarea rows={3} value={whyUsForm.description} onChange={e => setWhyUsForm({...whyUsForm, description: e.target.value})} className="w-full border rounded p-2"/></div>
              <div><label className="text-sm font-medium">Order</label><input type="number" value={whyUsForm.order_index} onChange={e => setWhyUsForm({...whyUsForm, order_index: parseInt(e.target.value) || 0})} className="w-full border rounded p-2"/></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowWhyUsModal(false)} className="px-4 py-2 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={() => handleSave('why_us_items', whyUsForm, editingWhyUs, setShowWhyUsModal)} disabled={isSubmitting} className="bg-[#2596be] text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Process Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingProcess ? 'Edit Step' : 'Add Step'}</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Step Number (e.g. 01)</label><input type="text" value={processForm.step_num} onChange={e => setProcessForm({...processForm, step_num: e.target.value})} className="w-full border rounded p-2"/></div>
              <div><label className="text-sm font-medium">Title</label><input type="text" value={processForm.title} onChange={e => setProcessForm({...processForm, title: e.target.value})} className="w-full border rounded p-2"/></div>
              <div><label className="text-sm font-medium">Description</label><textarea rows={3} value={processForm.description} onChange={e => setProcessForm({...processForm, description: e.target.value})} className="w-full border rounded p-2"/></div>
              <div><label className="text-sm font-medium">Order Index</label><input type="number" value={processForm.order_index} onChange={e => setProcessForm({...processForm, order_index: parseInt(e.target.value) || 0})} className="w-full border rounded p-2"/></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowProcessModal(false)} className="px-4 py-2 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={() => handleSave('process_steps', processForm, editingProcess, setShowProcessModal)} disabled={isSubmitting} className="bg-[#2596be] text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
