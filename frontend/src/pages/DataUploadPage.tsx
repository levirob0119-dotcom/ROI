import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, FileSpreadsheet, Lock, RefreshCw, Upload, XCircle } from 'lucide-react';
import api from '@/services/api';
import { clearUvaMatrixCache } from '@/services/data';

// ---------- 类型 ----------

interface MatrixFileInfo {
    vehicleId: string;
    updatedAt: string;
    size: number;
}

interface UploadResult {
    vehicleId: string;
    sheetName: string;
    rowCount: number;
}

interface UploadResponse {
    success: boolean;
    saved: UploadResult[];
    uploadedBy: string;
    uploadedAt: string;
}

// ---------- 常量 ----------

const PAGE_PASSWORD = 'PDUV123456';
const STORAGE_KEY = 'pduv_data_upload_verified';

// ---------- 工具函数 ----------

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ---------- 密码验证界面 ----------

const PasswordGate: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value === PAGE_PASSWORD) {
            localStorage.setItem(STORAGE_KEY, '1');
            onVerified();
        } else {
            setError(true);
            setValue('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="text-primary" size={24} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-gray-900">数据底表管理</h1>
                        <p className="text-sm text-gray-500 mt-1">请输入访问密码</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={value}
                        onChange={e => { setValue(e.target.value); setError(false); }}
                        placeholder="输入密码"
                        autoFocus
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
                            ${error
                                ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                            }`}
                    />
                    {error && (
                        <p className="text-xs text-red-500 -mt-2">密码不正确，请重试</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
                    >
                        进入
                    </button>
                </form>
            </div>
        </div>
    );
};

// ---------- 主页面 ----------

const DataUploadPage: React.FC = () => {
    const [verified, setVerified] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
    const [matrixList, setMatrixList] = useState<MatrixFileInfo[]>([]);
    const [listLoading, setListLoading] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 加载矩阵文件列表
    const loadMatrixList = useCallback(async () => {
        setListLoading(true);
        try {
            const data = await api.get<MatrixFileInfo[]>('/data/uva-matrix-list').then(r => r.data);
            setMatrixList(data);
        } catch {
            // 网络不通时静默忽略
        } finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => {
        if (verified) loadMatrixList();
    }, [verified, loadMatrixList]);

    // 文件选择
    const handleFileSelect = (file: File) => {
        if (!file.name.endsWith('.xlsx')) {
            setUploadError('只支持 .xlsx 格式的 Excel 文件');
            return;
        }
        setSelectedFile(file);
        setUploadResult(null);
        setUploadError(null);
    };

    // 拖拽
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    // 上传
    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadResult(null);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await api.post<UploadResponse>('/data/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadResult(res.data);
            setSelectedFile(null);
            // 清除对应车型的缓存
            res.data.saved.forEach(s => clearUvaMatrixCache(s.vehicleId));
            // 刷新文件列表
            await loadMatrixList();
        } catch (err: any) {
            const msg = err?.response?.data?.error || err?.message || '上传失败，请重试';
            setUploadError(msg);
        } finally {
            setUploading(false);
        }
    };

    if (!verified) {
        return <PasswordGate onVerified={() => setVerified(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* 页头 */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">数据底表管理</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        上传最新的 UVA 数据底表，系统将实时更新计算所用的矩阵数据。
                    </p>
                </div>

                {/* 说明卡片 */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
                    <p className="font-medium mb-1">Excel 文件格式要求</p>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                        <li>文件格式：<code className="bg-blue-100 px-1 rounded">.xlsx</code>，大小不超过 10 MB</li>
                        <li>Sheet 命名规则：<code className="bg-blue-100 px-1 rounded">{'{车型名}'}数据底表</code>，如 <code className="bg-blue-100 px-1 rounded">Cetus数据底表</code></li>
                        <li>一个文件可包含多个车型 Sheet，将同时更新</li>
                        <li>第一行为列标题，数据从第二行开始；L1 相关列允许合并单元格</li>
                    </ul>
                </div>

                {/* 当前数据状态 */}
                <div className="bg-white rounded-xl border border-gray-200 mb-6">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">当前矩阵数据</h2>
                        <button
                            onClick={loadMatrixList}
                            disabled={listLoading}
                            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition"
                        >
                            <RefreshCw size={12} className={listLoading ? 'animate-spin' : ''} />
                            刷新
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {listLoading ? (
                            <div className="px-5 py-4 text-sm text-gray-400 flex items-center gap-2">
                                <RefreshCw size={14} className="animate-spin" /> 加载中…
                            </div>
                        ) : matrixList.length === 0 ? (
                            <div className="px-5 py-4 text-sm text-gray-400">暂无矩阵数据（后端不可达或尚未上传）</div>
                        ) : (
                            matrixList.map(item => (
                                <div key={item.vehicleId} className="flex items-center justify-between px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet size={15} className="text-green-500" />
                                        <span className="text-sm font-medium text-gray-800 capitalize">{item.vehicleId}</span>
                                        <span className="text-xs text-gray-400">{formatBytes(item.size)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock size={11} />
                                        {formatDate(item.updatedAt)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 上传区域 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">上传新底表</h2>

                    {/* 拖拽区 */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            relative flex flex-col items-center justify-center gap-3
                            h-40 rounded-xl border-2 border-dashed cursor-pointer transition
                            ${isDragging
                                ? 'border-primary bg-primary/5'
                                : selectedFile
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx"
                            className="hidden"
                            onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
                        />
                        {selectedFile ? (
                            <>
                                <FileSpreadsheet size={28} className="text-green-500" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatBytes(selectedFile.size)}</p>
                                </div>
                                <p className="text-xs text-gray-400">点击重新选择</p>
                            </>
                        ) : (
                            <>
                                <Upload size={28} className="text-gray-300" />
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">拖拽文件到此处，或点击选择</p>
                                    <p className="text-xs text-gray-400 mt-0.5">支持 .xlsx 格式，最大 10 MB</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 上传按钮 */}
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="mt-4 w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium
                            hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition
                            flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <><RefreshCw size={15} className="animate-spin" /> 上传中…</>
                        ) : (
                            <><Upload size={15} /> 上传底表</>
                        )}
                    </button>

                    {/* 上传结果 */}
                    {uploadResult && (
                        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span className="text-sm font-medium text-green-800">上传成功</span>
                            </div>
                            <p className="text-xs text-green-700 mb-2">
                                由 {uploadResult.uploadedBy} 于 {formatDate(uploadResult.uploadedAt)} 上传
                            </p>
                            <ul className="space-y-1">
                                {uploadResult.saved.map(s => (
                                    <li key={s.vehicleId} className="text-xs text-green-700 flex items-center gap-1.5">
                                        <CheckCircle2 size={12} />
                                        <span className="capitalize font-medium">{s.vehicleId}</span>
                                        <span className="text-green-500">（{s.sheetName}，共 {s.rowCount} 行）</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {uploadError && (
                        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-2">
                            <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700">{uploadError}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DataUploadPage;
