import { useState, useEffect, useCallback, useRef } from 'react';
import { executeFetch } from '../api';

type DependencyList = ReadonlyArray<unknown>;

/**useDataFetching에 전달하는 옵션
 *
 * @template T - fetchFn이 반환하는 데이터 타입(CertData)
 *
 * @property {(signal?: AbortSignal) => Promise<T>} fetchFn - 데이터를 가져오는 비동기 함수
 * @property {T} initialData - 초기 데이터 값
 * @property {DependencyList} dependencies - 의존성 배열
 * @property {(data: T) => void} onSuccess - 요청 성공 시 실행할 콜백
 * @property {(error: string) => void} onError - 요청 실패 시 실행할 콜백
 */
interface UseDataFetchingOptions<T> {
    fetchFn: (signal?: AbortSignal) => Promise<T>;
    initialData?: T;
    dependencies?: DependencyList;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
}
/**useDataFetching이 반환하는 값
 *
 * @template T - fetchFn이 반환하는 데이터 타입(CertData)
 *
 * @property {T} data - 현재 데이터 상태
 * @property {boolean} loading - 로딩 상태 여부
 * @property {string | null} error - 에러 메시지
 * @property {() => Promise<void>} refetch - 데이터를 다시 불러오는 함수
 */
interface UseDataFetchingResult<T> {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**데이터 요청, 로딩, 에러, 취소, 재요청을 지원하는 훅
 *
 * @template T - fetchFn이 반환하는 데이터 타입
 *
 * @param {UseDataFetchingOptions<T>} options - 훅 설정 옵션
 * @param {(signal?: AbortSignal) => Promise<T>} options.fetchFn - 데이터를 가져오는 비동기 함수
 * @param {T} options.initialData - 초기 데이터 값
 * @param {DependencyList} options.dependencies - 의존성 배열
 * @param {(data: T) => void} options.onSuccess - 요청 성공 시 실행할 롤백
 * @param {(error: string) => void} options.onError - 요청 실패 시 실행할 롤백
 *
 * @returns {UseDataFetchingResult<T>} data, loading, error, refetch
 */
export function useDataFetching<T>({
                                       fetchFn,
                                       initialData,
                                       dependencies = [],
                                       onSuccess,
                                       onError
                                   }: UseDataFetchingOptions<T>): UseDataFetchingResult<T> {
    const [data, setData] = useState<T>(initialData as T);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // AbortController 참조 저장
    const abortControllerRef = useRef<AbortController | null>(null);

    // fetchData 함수
    const fetchData = useCallback(async (): Promise<void> => {
        // 이전 요청이 있다면 취소
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 새 AbortController 생성
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        await executeFetch({
            fetchFn,
            abortController,
            setLoading,
            setError,
            setData,
            clearError: true, // 수동 리페치에서는 에러를 지움
            onSuccess,
            onError,
        })

    }, [fetchFn, onSuccess, onError]);

    useEffect(() => {
        // 새 AbortController 생성
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        void executeFetch({
            fetchFn,
            abortController,
            setLoading,
            setError,
            setData,
            clearError: false,
            onSuccess,
            onError,
        })

        // 클린업 함수에서 요청 취소
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, loading, error, refetch: fetchData };
}