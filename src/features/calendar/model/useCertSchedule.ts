// // src/features/calendar/useCertSchedule.ts
// import { useEffect, useState } from 'react';
// import { certificateApi } from '@/entities/certificate/api/certificate-api';
// import type { ScheduleDto } from '@/entities/certificate/model/types';
//
// export function useCertSchedule(certId: number) {
//     const [data, setData] = useState<ScheduleDto | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         let aborted = false;
//         const controller = new AbortController();
//
//         (async () => {
//             try {
//                 setLoading(true);
//                 const res = await certificateApi.getSchedule(certId, controller.signal);
//                 if (!aborted) setData(res);
//             } finally {
//                 if (!aborted) setLoading(false);
//             }
//         })();
//
//         return () => {
//             aborted = true;
//             controller.abort();
//         };
//     }, [certId]);
//
//     return {data, loading};
// }