import { useState, useCallback } from 'react';

/**
 * Custom hook for managing async operations with loading, error, and data states
 */
export function useAsync<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (asyncFn: () => Promise<T>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            setData(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
    }, []);

    return { data, loading, error, execute, reset, setData };
}

/**
 * Custom hook for managing loading states (common pattern in app)
 */
export function useLoadingState(initialState = true) {
    const [loading, setLoading] = useState(initialState);

    const startLoading = useCallback(() => setLoading(true), []);
    const stopLoading = useCallback(() => setLoading(false), []);

    return { loading, setLoading, startLoading, stopLoading };
}

/**
 * Custom hook for managing form submission
 */
export function useFormSubmit<T>() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (
        submitFn: () => Promise<T>,
        options?: {
            onSuccess?: (result: T) => void;
            onError?: (error: Error) => void;
            successDuration?: number;
        }
    ) => {
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await submitFn();
            setSuccess(true);
            options?.onSuccess?.(result);

            // Reset success state after duration
            if (options?.successDuration) {
                setTimeout(() => setSuccess(false), options.successDuration);
            }

            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Submission failed');
            setError(error.message);
            options?.onError?.(error);
            throw error;
        } finally {
            setSubmitting(false);
        }
    }, []);

    const reset = useCallback(() => {
        setSubmitting(false);
        setSuccess(false);
        setError(null);
    }, []);

    return { submitting, success, error, handleSubmit, reset };
}

/**
 * Custom hook for debounced values (useful for search)
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useState(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    });

    return debouncedValue;
}
