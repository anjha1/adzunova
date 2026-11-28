/**
 * RFC 7807 Problem Details + secret scrubbing for Adzunova APIs.
 */

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  instance?: string;
  requestId?: string;
  errors?: Record<string, string[]>;
}

const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/rzp_(?:live|test)_[A-Za-z0-9]+/g, '[REDACTED_RAZORPAY_KEY]'],
  [/mongodb(?:\+srv)?:\/\/[^\s"'`]+/gi, '[REDACTED_MONGO_URI]'],
  [/([?&](?:X-Amz-Signature|X-Amz-Credential|X-Amz-Security-Token|signature|secret|token|access_token|key)=)[^&\s"']+/gi, '$1[REDACTED]'],
  [/(Bearer\s+)[A-Za-z0-9._-]+/gi, '$1[REDACTED]'],
  [/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, '[REDACTED_PAN]'],
];

export function scrubSecrets(input: string): string {
  let out = input;
  for (const [pattern, replacement] of SECRET_PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export class AppProblemError extends Error {
  readonly status: number;
  readonly type: string;
  readonly title: string;
  readonly code: string;
  readonly detail: string;
  readonly instance?: string;
  readonly errors?: Record<string, string[]>;

  constructor(opts: {
    status: number;
    code: string;
    title: string;
    detail: string;
    type?: string;
    instance?: string;
    errors?: Record<string, string[]>;
  }) {
    const cleanDetail = scrubSecrets(opts.detail);
    super(cleanDetail);
    this.name = 'AppProblemError';
    this.status = opts.status;
    this.code = opts.code;
    this.title = opts.title;
    this.detail = cleanDetail;
    this.type = opts.type ?? `https://adzunova.tech/problems/${opts.code.toLowerCase().replace(/_/g, '-')}`;
    this.instance = opts.instance;
    this.errors = opts.errors;
  }

  toProblem(requestId?: string): ProblemDetails {
    const problem: ProblemDetails = {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: scrubSecrets(this.detail),
      code: this.code,
    };
    if (this.instance) problem.instance = this.instance;
    if (requestId) problem.requestId = requestId;
    if (this.errors) problem.errors = this.errors;
    return problem;
  }
}

export function toProblemDetails(err: unknown, requestId?: string): ProblemDetails {
  if (err instanceof AppProblemError) {
    return err.toProblem(requestId);
  }
  if (err instanceof Error) {
    return new AppProblemError({
      status: 500,
      code: 'INTERNAL_ERROR',
      title: 'Internal Server Error',
      detail: scrubSecrets(err.message || 'Unexpected error'),
    }).toProblem(requestId);
  }
  return new AppProblemError({
    status: 500,
    code: 'INTERNAL_ERROR',
    title: 'Internal Server Error',
    detail: 'Unexpected error',
  }).toProblem(requestId);
}
