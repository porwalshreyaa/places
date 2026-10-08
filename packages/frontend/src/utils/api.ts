export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = (import.meta.env.VITE_API_URL || '').trim()) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private getToken(): string | null {
    return localStorage.getItem('ghoomi_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = this.baseUrl ? `${this.baseUrl}${cleanEndpoint}` : cleanEndpoint;

    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers as Record<string, string>),
    };

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();
    let data: unknown = null;

    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned invalid response (Status ${response.status})`);
      }
    }

    if (!response.ok) {
      const errorObj = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
      const details = Array.isArray(errorObj.details) ? (errorObj.details as Array<Record<string, unknown>>) : [];
      const errorMsg = 
        typeof errorObj.error === 'string' 
          ? errorObj.error 
          : typeof details[0]?.message === 'string' 
            ? details[0].message 
            : `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    if (data === null) {
      throw new Error("Server returned an empty response. Please verify backend service URL.");
    }

    return data as T;
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
