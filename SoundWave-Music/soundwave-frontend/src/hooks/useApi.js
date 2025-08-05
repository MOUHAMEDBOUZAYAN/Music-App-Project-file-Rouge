import { useState, useEffect, useCallback, useRef } from 'react';

const useApi = (apiFunction, options = {}) => {
  const {
    immediate = false,
    dependencies = [],
    cacheKey = null,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
    onFinally = null
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());

  // Cache management
  const getCachedData = useCallback((key) => {
    if (!key) return null;
    
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    
    if (cached) {
      cacheRef.current.delete(key);
    }
    
    return null;
  }, [cacheTime]);

  const setCachedData = useCallback((key, data) => {
    if (!key) return;
    
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const clearCache = useCallback((key = null) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  // Main API call function
  const execute = useCallback(async (params = {}) => {
    // Check cache first
    if (cacheKey) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setIsSuccess(true);
        setError(null);
        return cachedData;
      }
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setIsSuccess(false);

    let lastError = null;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        setRetryAttempt(attempt);
        
        const result = await apiFunction(params, {
          signal: abortControllerRef.current.signal
        });

        setData(result);
        setIsSuccess(true);
        setError(null);

        // Cache the result
        if (cacheKey) {
          setCachedData(cacheKey, result);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(result, params);
        }

        return result;

      } catch (err) {
        lastError = err;

        // Don't retry if request was aborted
        if (err.name === 'AbortError') {
          break;
        }

        // Don't retry on client errors (4xx)
        if (err.response && err.response.status >= 400 && err.response.status < 500) {
          break;
        }

        // Wait before retrying (except on last attempt)
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    // All attempts failed
    setError(lastError);
    setIsSuccess(false);

    // Call error callback
    if (onError) {
      onError(lastError, params);
    }

    throw lastError;

  }, [apiFunction, cacheKey, getCachedData, setCachedData, retryCount, retryDelay, onSuccess, onError]);

  // Reset function
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setIsSuccess(false);
    setRetryAttempt(0);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute, ...dependencies]);

  // Call finally callback
  useEffect(() => {
    if (onFinally && (loading || isSuccess || error)) {
      onFinally({ loading, isSuccess, error, data });
    }
  }, [loading, isSuccess, error, data, onFinally]);

  return {
    data,
    loading,
    error,
    isSuccess,
    retryAttempt,
    execute,
    reset,
    clearCache,
    refetch: () => execute()
  };
};

// Specialized hooks for common operations
export const useGet = (url, options = {}) => {
  const apiFunction = useCallback(async (params = {}, config = {}) => {
    const response = await fetch(`${url}${params.queryString ? `?${params.queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...params.headers
      },
      ...config
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [url]);

  return useApi(apiFunction, options);
};

export const usePost = (url, options = {}) => {
  const apiFunction = useCallback(async (params = {}, config = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...params.headers
      },
      body: JSON.stringify(params.data),
      ...config
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [url]);

  return useApi(apiFunction, options);
};

export const usePut = (url, options = {}) => {
  const apiFunction = useCallback(async (params = {}, config = {}) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...params.headers
      },
      body: JSON.stringify(params.data),
      ...config
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [url]);

  return useApi(apiFunction, options);
};

export const useDelete = (url, options = {}) => {
  const apiFunction = useCallback(async (params = {}, config = {}) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...params.headers
      },
      ...config
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [url]);

  return useApi(apiFunction, options);
};

// Hook for handling form submissions
export const useFormSubmit = (apiFunction, options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    resetOnSuccess = true
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await apiFunction(formData);
      
      setIsSuccess(true);
      
      if (onSuccess) {
        onSuccess(result, formData);
      }

      if (resetOnSuccess) {
        setLoading(false);
        setError(null);
        setIsSuccess(false);
      }

      return result;

    } catch (err) {
      setError(err);
      setIsSuccess(false);
      
      if (onError) {
        onError(err, formData);
      }

      throw err;

    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, resetOnSuccess]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    isSuccess,
    reset
  };
};

// Hook for infinite scrolling
export const useInfiniteScroll = (apiFunction, options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    threshold = 100
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction({ page, pageSize });
      
      if (result.data) {
        setData(prev => [...prev, ...result.data]);
        setHasMore(result.data.length === pageSize);
        setPage(prev => prev + 1);
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setLoading(false);
    setError(null);
    setHasMore(true);
    setPage(initialPage);
  }, [initialPage]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};

export default useApi; 