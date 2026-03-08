import React, { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
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
  ArrowsClockwise,
  Sparkle,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

type ProviderType = 'enowxlabs' | 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'custom';

const FIXED_BASE_URL: Record<string, boolean> = {
  enowxlabs: true,
  openai: true,
  anthropic: true,
  gemini: true,
};

const PROVIDER_PRESETS: Record<ProviderType, { label: string; providerType: ProviderType; baseUrl: string; model: string }> = {
  enowxlabs: { label: 'enowX Labs', providerType: 'enowxlabs', baseUrl: 'https://api.enowxlabs.com/v1', model: 'enowx-default' },
  openai: { label: 'OpenAI', providerType: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  anthropic: { label: 'Anthropic', providerType: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-20241022' },
  gemini: { label: 'Gemini', providerType: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' },
  ollama: { label: 'Ollama', providerType: 'ollama', baseUrl: 'http://localhost:11434/v1', model: 'llama3.2' },
  custom: { label: 'Custom', providerType: 'custom', baseUrl: '', model: '' },
};

interface ProviderFormData {
  name: string;
  providerType: ProviderType;
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

function ModelPicker({
  providerId,
  value,
  onChange,
}: {
  providerId: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<string[]>('list_models', { providerId });
      setModels(result);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:border-white/40 transition-colors appearance-none disabled:opacity-50"
        >
          {value && !models.includes(value) && (
            <option value={value}>{value}</option>
          )}
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
          {models.length === 0 && !loading && !error && (
            <option value="" disabled>No models found</option>
          )}
          {error && (
            <option value="" disabled>Failed to load models</option>
          )}
        </select>
        {loading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
            <ArrowsClockwise size={13} className="text-[var(--text-muted)] animate-spin" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={fetchModels}
        disabled={loading}
        className="px-2.5 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors disabled:opacity-50"
        title="Refresh models"
      >
        <ArrowsClockwise size={13} className={loading ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}

export const ProviderSettings: React.FC = () => {
  const { providers, setProviders, setDefaultProviderId, defaultProviderId } = useSettingsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProviderFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    invoke<Provider[]>('list_providers')
      .then((ps) => {
        setProviders(ps);
        const def = ps.find((p) => p.isDefault);
        if (def) setDefaultProviderId(def.id);
      })
      .catch(console.error);
  }, [setProviders, setDefaultProviderId]);

  const handlePreset = (key: ProviderType) => {
    const p = PROVIDER_PRESETS[key];
    setForm((prev) => ({
      ...prev,
      name: p.label,
      providerType: p.providerType,
      baseUrl: p.baseUrl,
      model: p.model,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await invoke('update_provider', {
          id: editingId,
          name: form.name,
          baseUrl: form.baseUrl,
          apiKey: form.apiKey || null,
          model: form.model,
        });
      } else {
        await invoke<Provider>('create_provider', {
          name: form.name,
          providerType: form.providerType,
          baseUrl: form.baseUrl,
          apiKey: form.apiKey || null,
          model: form.model,
        });
      }
      const updated = await invoke<Provider[]>('list_providers');
      setProviders(updated);
      setForm(defaultForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('save provider error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Provider) => {
    setForm({
      name: p.name,
      providerType: p.providerType as ProviderType,
      baseUrl: p.baseUrl,
      apiKey: p.apiKey ?? '',
      model: p.model,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await invoke('delete_provider', { id });
      const updated = await invoke<Provider[]>('list_providers');
      setProviders(updated);
      if (defaultProviderId === id) setDefaultProviderId(null);
    } catch (err) {
      console.error('delete provider error:', err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await invoke('set_default_provider', { id });
      setDefaultProviderId(id);
      setProviders(providers.map((p) => ({ ...p, isDefault: p.id === id })));
    } catch (err) {
      console.error('set default error:', err);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setShowForm(false);
    setEditingId(null);
  };

  const isFixed = FIXED_BASE_URL[form.providerType] ?? false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
          <Robot size={16} weight="duotone" />
          LLM Providers
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#e5e5e5] text-black text-xs font-semibold transition-colors"
          >
            <Plus size={14} weight="bold" />
            Add Provider
          </button>
        )}
      </div>

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
                ? 'border-white/20 bg-white/[0.03]'
                : 'border-[var(--border)] bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)]/60'
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text)] truncate">{p.name}</span>
                {p.id === defaultProviderId && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white font-bold uppercase tracking-wider">
                    Default
                  </span>
                )}
                {p.isBuiltin && (
                  <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                    <Sparkle size={9} weight="fill" />
                    Built-in
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                {p.model} · {p.baseUrl}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleSetDefault(p.id)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  p.id === defaultProviderId
                    ? 'text-white'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
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
              {!p.isBuiltin && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl border border-white/10 bg-[var(--surface-2)]/40 space-y-3"
        >
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {editingId ? 'Edit Provider' : 'New Provider'}
          </h3>

          {!editingId && (
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(PROVIDER_PRESETS) as ProviderType[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePreset(key)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors',
                    form.providerType === key
                      ? 'border-white/40 text-white bg-white/5'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  )}
                >
                  {PROVIDER_PRESETS[key].label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="My OpenAI"
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-white/40 transition-colors"
              />
            </div>

            {!isFixed && (
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Base URL</label>
                <input
                  required
                  value={form.baseUrl}
                  onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
                  placeholder="http://localhost:11434/v1"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-white/40 transition-colors"
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">API Key</label>
              <input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                placeholder="sk-... (optional)"
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-white/40 transition-colors"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Model</label>
              {editingId ? (
                <ModelPicker
                  providerId={editingId}
                  value={form.model}
                  onChange={(model) => setForm((f) => ({ ...f, model }))}
                />
              ) : (
                <input
                  required
                  value={form.model}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  placeholder="gpt-4o"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-white/40 transition-colors"
                />
              )}
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
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#e5e5e5] text-black text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Check size={14} />
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Provider'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
