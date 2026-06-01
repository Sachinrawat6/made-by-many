import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CLOUD_NAME, uploadToCloudinary } from '@/services/cloudinary.service';
import { logout } from '@/pages/LoginPage';

const ACCEPTED = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
};
const ALL_ACCEPTED = [...ACCEPTED.image, ...ACCEPTED.video];

// ─── Persist uploaded results to localStorage ─────────────────────────────────
function saveToLibrary(result) {
  try {
    const existing = JSON.parse(localStorage.getItem('cld_library') || '[]');
    // avoid duplicates
    const filtered = existing.filter((r) => r.public_id !== result.public_id);
    localStorage.setItem('cld_library', JSON.stringify([result, ...filtered]));
  } catch (_) {}
}

// ─── FileCard ─────────────────────────────────────────────────────────────────
function FileCard({ item, selected, onToggle, onRemove }) {
  const isVideo = item.file.type.startsWith('video');
  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
      }`}
    >
      {/* Checkbox + Preview */}
      <div
        className="relative bg-gray-100 h-44 flex items-center justify-center cursor-pointer"
        onClick={() => item.status === 'pending' && onToggle(item.id)}
      >
        {item.status === 'done' ? (
          isVideo ? (
            <video src={item.result.secure_url} controls className="w-full h-full object-contain" />
          ) : (
            <img src={item.result.secure_url} alt={item.file.name} className="w-full h-full object-contain" />
          )
        ) : item.preview ? (
          isVideo ? (
            <video src={item.preview} className="w-full h-full object-contain" muted />
          ) : (
            <img src={item.preview} alt={item.file.name} className="w-full h-full object-contain" />
          )
        ) : (
          <span className="text-4xl">{isVideo ? '🎬' : '🖼️'}</span>
        )}

        {/* Progress */}
        {item.status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
            <div className="w-3/4 bg-gray-300 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
            </div>
            <span className="text-white text-sm font-medium">{item.progress}%</span>
          </div>
        )}

        {/* Badges */}
        {item.status === 'done' && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">✓ Done</span>
        )}
        {item.status === 'error' && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">✗ Failed</span>
        )}
        {item.status === 'pending' && (
          <span className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
            selected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300'
          }`}>
            {selected ? '✓' : ''}
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{item.file.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {(item.file.size / 1024 / 1024).toFixed(2)} MB · {isVideo ? 'Video' : 'Image'}
        </p>
        {item.status === 'done' && (
          <a href={item.result.secure_url} target="_blank" rel="noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1 block truncate">
            {item.result.public_id}
          </a>
        )}
        {item.status === 'error' && (
          <p className="text-xs text-red-500 mt-1">{item.error}</p>
        )}
        {item.status !== 'uploading' && (
          <button onClick={() => onRemove(item.id)} className="mt-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────
let idCounter = 0;

export default function AdminPage() {
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [dragging, setDragging] = useState(false);
  const [uploadPreset, setUploadPreset] = useState(() => localStorage.getItem('cld_preset') || '');
  const [presetSaved, setPresetSaved] = useState(!!localStorage.getItem('cld_preset'));
  const [showPresetHelp, setShowPresetHelp] = useState(false);
  const inputRef = useRef(null);

  const savePreset = () => {
    if (!uploadPreset.trim()) return;
    localStorage.setItem('cld_preset', uploadPreset.trim());
    setPresetSaved(true);
  };

  const addFiles = useCallback((fileList) => {
    const newItems = Array.from(fileList)
      .filter((f) => ALL_ACCEPTED.includes(f.type))
      .map((file) => ({
        id: ++idCounter,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
        result: null,
        error: null,
      }));
    if (!newItems.length) return;
    setFiles((prev) => [...prev, ...newItems]);
    setSelected((prev) => {
      const next = new Set(prev);
      newItems.forEach((i) => next.add(i.id));
      return next;
    });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const toggleSelect = (id) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = () => {
    const pending = files.filter((f) => f.status === 'pending').map((f) => f.id);
    const allSelected = pending.every((id) => selected.has(id));
    setSelected((prev) => {
      const n = new Set(prev);
      if (allSelected) pending.forEach((id) => n.delete(id));
      else pending.forEach((id) => n.add(id));
      return n;
    });
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const uploadSelected = async () => {
    if (!uploadPreset.trim()) { alert('Please set an upload preset first!'); return; }
    const toUpload = files.filter((f) => selected.has(f.id) && (f.status === 'pending' || f.status === 'error'));
    if (!toUpload.length) return;

    for (const item of toUpload) {
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'uploading', progress: 0 } : f));
      try {
        const result = await uploadToCloudinary(item.file, uploadPreset.trim(), (progress) => {
          setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, progress } : f));
        });
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'done', result, progress: 100 } : f));
        saveToLibrary(result);
        setSelected((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
      } catch (err) {
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'error', error: err.message } : f));
      }
    }
  };

  const pendingFiles  = files.filter((f) => f.status === 'pending');
  const uploadingCount = files.filter((f) => f.status === 'uploading').length;
  const doneCount      = files.filter((f) => f.status === 'done').length;
  const selectedPending = files.filter((f) => selected.has(f.id) && (f.status === 'pending' || f.status === 'error'));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Media Upload</h1>
          <p className="text-sm text-gray-500">Cloudinary · <span className="font-mono text-xs">{CLOUD_NAME}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/media" className="text-sm text-blue-600 hover:underline">
            📂 Media Library →
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Sign out
          </button>
          {files.length > 0 && (
            <>
              <span className="text-sm text-gray-500">{doneCount}/{files.length} done</span>
              {pendingFiles.length > 0 && (
                <button onClick={toggleAll}
                  className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                  {pendingFiles.every((f) => selected.has(f.id)) ? 'Deselect All' : 'Select All'}
                </button>
              )}
              <button
                onClick={uploadSelected}
                disabled={!selectedPending.length || uploadingCount > 0}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {uploadingCount > 0
                  ? `Uploading... (${uploadingCount})`
                  : `Upload ${selectedPending.length} selected`}
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Preset Config */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Cloudinary Upload Preset</h2>
              <p className="text-xs text-gray-500 mt-0.5">An unsigned upload preset is required</p>
            </div>
            <button onClick={() => setShowPresetHelp(!showPresetHelp)}
              className="text-xs text-blue-600 hover:underline">
              How to create one? {showPresetHelp ? '▲' : '▼'}
            </button>
          </div>

          {showPresetHelp && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-xs text-blue-800 space-y-1">
              <p className="font-semibold">Steps:</p>
              <p>1. Go to <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="underline">cloudinary.com/console</a> → Settings → Upload</p>
              <p>2. Click "Add upload preset" → Signing Mode: <strong>Unsigned</strong> → Save</p>
              <p>3. Copy the preset name and paste it below</p>
            </div>
          )}

          <div className="flex gap-3">
            <input type="text" value={uploadPreset}
              onChange={(e) => { setUploadPreset(e.target.value); setPresetSaved(false); }}
              placeholder="e.g. my_unsigned_preset"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button onClick={savePreset} disabled={!uploadPreset.trim()}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors">
              {presetSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-colors mb-8 ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <div className="text-5xl mb-3">☁️</div>
          <p className="text-gray-700 font-medium text-lg">{dragging ? 'Drop files here!' : 'Drag & drop files or click to browse'}</p>
          <p className="text-gray-400 text-xs mt-2">JPG, PNG, WebP, GIF, SVG · MP4, WebM, MOV · Bulk upload supported</p>
          <input ref={inputRef} type="file" multiple accept={ALL_ACCEPTED.join(',')}
            className="hidden" onChange={(e) => addFiles(e.target.files)} />
        </div>

        {/* Files Grid */}
        {files.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((item) => (
              <FileCard key={item.id} item={item}
                selected={selected.has(item.id)}
                onToggle={toggleSelect}
                onRemove={removeFile}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">No files selected. Drop some above!</p>
        )}
      </main>
    </div>
  );
}
