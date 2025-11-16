// shared/components/Tabs.tsx
import React from 'react';
export type TabKey = string;
export type TabItem = { key: TabKey; label: string };

export const Tabs: React.FC<{
    tabs: TabItem[];
    active: TabKey;
    onChange: (k: TabKey) => void;
    children: React.ReactNode;
}> = ({ tabs, active, onChange, children }) => (
    <div>
        <div className="tab-bar">
            {tabs.map(t => (
                <button
                    key={t.key}
                    type="button"
                    onClick={() => onChange(t.key)}
                    className={`tab ${active === t.key ? 'active' : ''}`}
                >
                    {t.label}
                </button>
            ))}
        </div>
        <div className="tab-panels">{children}</div>
        <style>{`
      .tab-bar {
        display:flex;
        gap:8px;
        border-bottom:1px solid #e5e7eb;
        margin:16px 0;
      }

      .tab {
        cursor: pointer;              /* 🔥 손가락 모양 */
        padding:10px 14px;
        border-radius:8px 8px 0 0;
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-bottom:none;
        font-size:0.95rem;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .tab:hover {
        background:#eef2ff;           /* 살짝 hover 느낌 (원하면) */
      }

      .tab.active {
        background:#fff;
        font-weight:700;
      }

      .tab-panels {
        background:#fff;
        border:1px solid #e5e7eb;
        border-radius:0 8px 8px 8px;
        padding:16px;
      }
    `}</style>
    </div>
);
