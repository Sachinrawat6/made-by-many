import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CLOUD_NAME,
  listResources,
  deleteResources,
  renameResource,
  uploadToCloudinary,
} from '@/services/cloudinary.service';
import { logout } from '@/pages/LoginPage';

const TABS = ['image', 'video'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes) return '—';
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── MediaCard ────────────────────────────────────────────────────────────────
function MediaCard({ resource, selected, onToggle, onDelete, onRename, onReplace, uploadPreset }) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(resource.public_id);
  const [loading, setLoading] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(null);
  const replaceRef = useRef(null);

  const isVideo = resource.resource_type === 'video';
  const thumbUrl = isVideo
    ? `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_400,h_300,c_fill,so_0/${resource.public_id}.jpg`
    : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill/${resource.public_id}`;

  const handleRename = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === resource.public_id) {
      setRenaming(false);
      return;
    }
    setLoading(true);
    try {
      await onRename(resource.public_id, trimmed, resource.resource_type);
      setRenaming(false);
    } catch (err) {
      alert('Rename failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!uploadPreset) {
      alert('Upload preset not set. Please go to /admin to configure it.');
      return;
    }
    setReplaceProgress(0);
    try {
      await onReplace(file, resource.public_id, resource.resource_type, uploadPreset, (p) =>
        setReplaceProgress(p)
      );
    } catch (err) {
      alert('Replace failed: ' + err.message);
    } finally {
      setReplaceProgress(null);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all group ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Thumbnail */}
      <div
        className="relative bg-gray-100 h-44 overflow-hidden cursor-pointer"
        onClick={() => onToggle(resource.public_id)}
      >
        {isVideo ? (
          <video
            src={`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_400/${resource.public_id}.mp4`}
            className="w-full h-full object-cover"
            muted
          />
        ) : (
          <img src={thumbUrl} alt={resource.public_id} className="w-full h-full object-cover" />
        )}

        {/* Checkbox */}
        <span
          className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
            selected
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'bg-white/80 border-gray-400 opacity-0 group-hover:opacity-100'
          }`}
        >
          {selected ? '✓' : ''}
        </span>

        {/* Type badge */}
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
          {isVideo ? '🎬 Video' : '🖼 Image'}
        </span>

        {/* Replace progress */}
        {replaceProgress !== null && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
            <div className="w-3/4 bg-gray-300 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all"
                style={{ width: `${replaceProgress}%` }}
              />
            </div>
            <span className="text-white text-sm">{replaceProgress}%</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {renaming ? (
          <div className="flex gap-1 mb-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') setRenaming(false);
              }}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={handleRename}
              disabled={loading}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '…' : '✓'}
            </button>
            <button
              onClick={() => setRenaming(false)}
              className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300"
            >
              ✕
            </button>
          </div>
        ) : (
          <p className="text-xs font-medium text-gray-800 truncate mb-1" title={resource.public_id}>
            {resource.public_id}
          </p>
        )}

        <p className="text-xs text-gray-400">
          {formatBytes(resource.bytes)} · {timeAgo(resource.created_at)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <a
            href={resource.secure_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View
          </a>
          <button
            onClick={() => {
              setRenaming(true);
              setNewName(resource.public_id);
            }}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Rename
          </button>
          <button
            onClick={() => replaceRef.current?.click()}
            className="text-xs text-amber-600 hover:text-amber-800"
          >
            Replace
          </button>
          <button
            onClick={() => onDelete(resource.public_id, resource.resource_type)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept={isVideo ? 'video/*' : 'image/*'}
            className="hidden"
            onChange={handleReplace}
          />
        </div>
      </div>
    </div>
  );
}

// ─── MediaLibraryPage ─────────────────────────────────────────────────────────
export default function MediaLibraryPage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [tab, setTab] = useState('image');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const uploadPreset = localStorage.getItem('cld_preset') || '';

  const fetchResources = async (resourceType, cursor = null, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listResources(resourceType, cursor, 50);
      console.log('Fetched resources:', data);
      setResources((prev) => (append ? [...prev, ...data.resources] : data.resources));
      setNextCursor(data.next_cursor || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResources([]);
    setSelected(new Set());
    setNextCursor(null);
    fetchResources(tab);
  }, [tab]);

  const toggleSelect = (publicId) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(publicId) ? n.delete(publicId) : n.add(publicId);
      return n;
    });

  const toggleAll = () => {
    const filtered = filteredResources.map((r) => r.public_id);
    const allSel = filtered.every((id) => selected.has(id));
    setSelected((prev) => {
      const n = new Set(prev);
      if (allSel) filtered.forEach((id) => n.delete(id));
      else filtered.forEach((id) => n.add(id));
      return n;
    });
  };

  const handleDelete = async (publicId, resourceType) => {
    if (!confirm(`Delete "${publicId}"?`)) return;
    try {
      await deleteResources([publicId], resourceType);
      setResources((prev) => prev.filter((r) => r.public_id !== publicId));
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(publicId);
        return n;
      });
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.size || !confirm(`Delete ${selected.size} files?`)) return;
    setDeleting(true);
    try {
      await deleteResources([...selected], tab);
      setResources((prev) => prev.filter((r) => !selected.has(r.public_id)));
      setSelected(new Set());
    } catch (err) {
      alert('Bulk delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleRename = async (fromId, toId, resourceType) => {
    const result = await renameResource(fromId, toId, resourceType);
    setResources((prev) =>
      prev.map((r) =>
        r.public_id === fromId
          ? { ...r, public_id: result.public_id, secure_url: result.secure_url }
          : r
      )
    );
  };

  const handleReplace = async (file, publicId, resourceType, preset, onProgress) => {
    const result = await uploadToCloudinary(file, preset, onProgress, publicId);
    setResources((prev) =>
      prev.map((r) =>
        r.public_id === publicId
          ? {
              ...r,
              secure_url: result.secure_url,
              bytes: result.bytes,
              created_at: result.created_at,
            }
          : r
      )
    );
  };

  const filteredResources = resources.filter((r) =>
    r.public_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Media Library</h1>
            <p className="text-sm text-gray-500">
              Cloudinary · <span className="font-mono text-xs">{CLOUD_NAME}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm text-blue-600 hover:underline">
              ← Upload
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
            {selected.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : `Delete ${selected.size} selected`}
              </button>
            )}
            <button
              onClick={() => fetchResources(tab)}
              disabled={loading}
              className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? '⟳ Loading...' : '⟳ Refresh'}
            </button>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm rounded-md transition-all capitalize ${
                  tab === t
                    ? 'bg-white shadow text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'image' ? '🖼 Images' : '🎬 Videos'}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="flex-1 max-w-xs border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          />

          {filteredResources.length > 0 && (
            <button
              onClick={toggleAll}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {filteredResources.every((r) => selected.has(r.public_id))
                ? 'Deselect All'
                : 'Select All'}
            </button>
          )}

          <span className="text-sm text-gray-400">
            {filteredResources.length} {tab}s{selected.size > 0 && ` · ${selected.size} selected`}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-sm">Error loading resources</p>
              <p className="text-xs mt-0.5">{error}</p>
              <p className="text-xs mt-1 text-red-500">
                Note: If this persists, check that the Vite dev proxy is running and your API
                credentials are correct.
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && resources.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-44 bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && filteredResources.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">{tab === 'image' ? '🖼️' : '🎬'}</p>
            <p className="text-sm">{search ? 'No results found' : `No ${tab}s uploaded yet`}</p>
            {!search && (
              <Link to="/admin" className="text-blue-600 text-sm hover:underline mt-2 block">
                Upload files →
              </Link>
            )}
          </div>
        )}

        {filteredResources.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredResources.map((resource) => (
              <MediaCard
                key={resource.public_id}
                resource={resource}
                selected={selected.has(resource.public_id)}
                onToggle={toggleSelect}
                onDelete={handleDelete}
                onRename={handleRename}
                onReplace={handleReplace}
                uploadPreset={uploadPreset}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {nextCursor && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchResources(tab, nextCursor, true)}
              disabled={loading}
              className="px-6 py-2 bg-white border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
