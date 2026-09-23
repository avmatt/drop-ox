import Link from "next/link.js";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm bg-zinc-200 text-zinc-600 -ml-8 -mr-6 -mt-6 p-4">
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="contents">
              {item.path && !isCurrent ? (
                <Link
                  href={item.path}
                  className="font-medium text-zinc-700 transition hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isCurrent
                      ? "font-semibold text-zinc-900"
                      : "font-medium text-zinc-700"
                  }
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isCurrent ? (
                <span aria-hidden="true" className="text-zinc-400">
                  &nbsp;/&nbsp;
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
