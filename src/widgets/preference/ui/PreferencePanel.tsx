import styles from '../styles/PreferencePanel.module.css';
import { adaptPreference } from './adaptPreference';

export function PreferencePanel({ data }: { data: unknown }) {
    const rows = adaptPreference(data);

    if (!rows.length) {
        return (
            <div className={styles.wrap}>
                <div className={styles.empty}>우대현황(법령) 데이터가 없습니다.</div>
            </div>
        );
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.scroll}>
                {/* 우리 표임을 명시적으로 표시 → 빈행 제거 루틴에서 제외용 */}
                <table data-kind="qpref" className={`${styles.table} ${styles.striped}`}>
                    <thead>
                    <tr>
                        <th className={styles.theadTh}>우대법령</th>
                        <th className={styles.theadTh}>조문내역(하이퍼링크)</th>
                        <th className={styles.theadTh}>활용내용</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td className={`${styles.cell} ${styles.txt}`}>{r.law || '-'}</td>
                            <td className={`${styles.cell} ${styles.txt} ${styles.break}`}>
                                {r.href ? (
                                    <a
                                        href={r.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.plink}
                                        title={r.href}
                                    >
                                        {r.articleText || r.href}
                                    </a>
                                ) : (
                                    r.articleText || '-'
                                )}
                            </td>
                            <td className={`${styles.cell} ${styles.txt}`}>{r.usage || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
