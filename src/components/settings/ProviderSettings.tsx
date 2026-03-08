import React, { useState } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Provider } from '@/types';
import {
  Plus,
  Trash,
  PencilSimple,
  Check,
  X,
  Star,
  Robot,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ProviderFormData {
  name: string;
  providerType: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

const defaultForm: ProviderFormData = {
  name: '',
  providerType: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
};

const PROVIDER_PRESETS: Record<string, Partial<ProviderFormData>> = {
  openai: { providerType: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  anthropic: { providerType: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-20241022' },
  ollama: { providerType: 'ollama', baseUrl: 'http://localhost:11434/v1', model: 'llama3.2', apiKey: '' },
  custom: { providerType: 'custom', baseUrl: '', model: '' },
};

export const ProviderSettings: React.FC = () => {
  const { providers, addProvider, removeProvider, setDefaultProviderId, defaultProviderId } = useSettingsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProviderFormData>(defaultForm);

  const handlePreset = (preset: string) => {
    const p = PROVIDER_PRESETS[preset];
    setForm((prev) => ({ ...prev, ...p }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const provider: Provider = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name,
      providerType: form.providerType,
      baseUrl: form.baseUrl,
      apiKey: form.apiKey || undefined,
      model: form.model,
      isDefault: providers.length === 0,
      createdAt: now,
      updatedAt: now,
    };
    addProvider(provider);
    setForm(defaultForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (p: Provider) => {
    setForm({
      name: p.name,
      providerType: p.providerType,
      baseUrl: p.baseUrl,
      apiKey: p.apiKey ?? '',
      model: p.model,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
          <Robot size={16} weight="duotone" className="text-[var(--accent)]" />
          LLM Providers
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors"
          >
            <Plus size={14} weight="bold" />
            Add Provider
          </button>
        )}
      </div>

      {/* Provider list */}
      {providers.length === 0 && !showForm && (
        <div className="p-6 rounded-xl border border-dashed border-[var(--border)] text-center space-y-2">
          <Robot size={32} weight="duotone" className="text-[var(--border)] mx-auto" />
          <p className="text-xs text-[var(--text-muted)]">No providers configured. Add one to start chatting.</p>
        </div>
      )}

      <div className="space-y-2">
        {providers.map((p) => (
          <div
            key={p.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border transition-colors',
              p.id === defaultProviderId
                ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5'
                : 'border-[var(--border)] bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)]/60'
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text)] truncate">{p.name}</span>
                {p.id === defaultProviderId && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-bold uppercase tracking-wider">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                {p.model} · {p.baseUrl}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setDefaultProviderId(p.id)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  p.id === defaultProviderId
                    ? 'text-yellow-400'
                    : 'text-[var(--text-muted)] hover:text-yellow-400 hover:bg-[var(--surface-2)]'
                )}
                title="Set as default"
              >
                <Star size={14} weight={p.id === defaultProviderId ? 'fill' : 'regular'} />
              </button>
              <button
                onClick={() => handleEdit(p)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <PencilSimple size={14} />
              </button>
              <button
                onClick={() => removeProvider(p.id)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--surface-2)]/40 space-y-3"
        >
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {editingId ? 'Edit Provider' : 'New Provider'}
          </h3>

          {/* Presets */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(PROVIDER_PRESETS).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors capitalize"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="My OpenAI"
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Base URL</label>
              <input
                required
                value={form.baseUrl}
                onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Model</label>
              <input
                required
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                placeholder="gpt-4o"
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">API Key</label>
              <input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                placeholder="sk-... (optional)"
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-semibold transition-colors"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold transition-colors"
            >
              <Check size={14} />
              {editingId ? 'Save Changes' : 'Add Provider'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
