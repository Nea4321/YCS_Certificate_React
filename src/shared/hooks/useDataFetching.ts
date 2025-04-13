import { useState, useEffect, useCallback, useRef } from 'react';
import { handleApiError, isRequestCanceled } from '../api';

type DependencyList = ReadonlyArray<unknown>;

interface UseDataFetchingOptions<T> {
    fetchFn: (signal?: AbortSignal) => Promise<T>;
    initialData?: T;
    dependencies?: DependencyList;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
}

interface UseDataFetchingResult<T> {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

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

        try {
            setLoading(true);
            setError(null);

            // fetchFn에 signal 전달
            const result = await fetchFn(abortController.signal);

            // 요청이 취소되지 않았다면 상태 업데이트
            if (!abortController.signal.aborted) {
                setData(result);
                onSuccess?.(result);
            }

            // 값을 반환하지 않음 (void 반환)
        } catch (error) {
            // AbortError는 정상적인 취소이므로 에러로 처리하지 않음
            if (isRequestCanceled(error) || (error instanceof Error && error.name === 'AbortError')) {
                console.log('Fetch request was cancelled');
                return;
            }

            console.error("Error fetching data:", error);
            const errorMessage = handleApiError(error);

            // 요청이 취소되지 않았다면 에러 상태 업데이트
            if (!abortController.signal.aborted) {
                setError(errorMessage);
                onError?.(errorMessage);
            }

            // throw error; - 이 줄 제거
        } finally {
            // 요청이 취소되지 않았다면 로딩 상태 업데이트
            if (!abortController.signal.aborted) {
                setLoading(false);
            }
        }
    }, [fetchFn, onSuccess, onError]);

    useEffect(() => {
        // 새 AbortController 생성
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const execute = async () => {
            try {
                setLoading(true);

                // fetchFn에 signal 전달
                const result = await fetchFn(abortController.signal);

                // 요청이 취소되지 않았다면 상태 업데이트
                if (!abortController.signal.aborted) {
                    setData(result);
                    onSuccess?.(result);
                }
            } catch (error) {
                // AbortError는 정상적인 취소이므로 에러로 처리하지 않음
                if (isRequestCanceled(error) || (error instanceof Error && error.name === 'AbortError')) {
                    console.log('Fetch request was cancelled');
                    return;
                }

                console.error("Error fetching data:", error);

                // 요청이 취소되지 않았다면 에러 상태 업데이트
                if (!abortController.signal.aborted) {
                    const errorMessage = handleApiError(error);
                    setError(errorMessage);
                    onError?.(errorMessage);
                }
            } finally {
                // 요청이 취소되지 않았다면 로딩 상태 업데이트
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void execute();

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