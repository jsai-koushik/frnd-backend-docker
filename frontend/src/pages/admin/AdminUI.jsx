
// ==========================================
// SHARED TABLE STYLES
// ==========================================

export const thClass =
  "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";

export const tdClass =
  "px-5 py-4 text-sm text-gray-700";

// ==========================================
// PAGE HEADER
// ==========================================

export function PageHeader({
  title,
  description,
  subtitle,
  children,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>

        {(description || subtitle) && (
          <p className="mt-2 text-sm text-gray-500">
            {description || subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

// ==========================================
// ERROR MESSAGE
// ==========================================

export function ErrorMessage({ message, children }) {
  const content = message || children;

  if (!content) return null;

  return (
    <div
      role="alert"
      className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
    >
      {content}
    </div>
  );
}

// ==========================================
// SUCCESS MESSAGE
// ==========================================

export function SuccessMessage({ message, children }) {
  const content = message || children;

  if (!content) return null;

  return (
    <div
      role="status"
      className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
    >
      {content}
    </div>
  );
}

// ==========================================
// LOADING MESSAGE
// ==========================================

export function LoadingMessage({
  message = "Loading...",
}) {
  return (
    <div
      role="status"
      className="rounded-xl bg-white p-8 text-center text-gray-500"
    >
      {message}
    </div>
  );
}

// ==========================================
// EMPTY MESSAGE
// ==========================================

export function EmptyMessage({
  message = "No records found.",
}) {
  return (
    <div className="rounded-xl bg-white p-8 text-center text-gray-500">
      {message}
    </div>
  );
}

// ==========================================
// TABLE WRAPPER
// ==========================================

export function TableWrapper({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

// ==========================================
// DISPLAY VALUE
// ==========================================

export function DisplayValue({ value }) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return (
      <span className="text-gray-400">
        —
      </span>
    );
  }

  if (typeof value === "object") {
    return (
      <span>
        {JSON.stringify(value)}
      </span>
    );
  }

  return (
    <span>
      {String(value)}
    </span>
  );
}
