import type { ReactNode } from 'react';

interface EmptyStateProps {
    message: string;
    height?: number;   // 기본 높이
    icon?: ReactNode;  // 필요하면 이모지/아이콘
}

export function EmptyState({ message, height = 120, icon }: EmptyStateProps) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: `${height}px`,
                width: '100%',
                textAlign: 'center',
            }}
        >
            <p style={{ fontSize: '25px', fontWeight: 600, color: 'black' }}>
                {icon} {message}
            </p>
        </div>
    );
}
