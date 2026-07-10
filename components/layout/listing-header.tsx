interface ListingHeaderProps {
    title: string
    description: string
    className?: string
}

/**
 * Shared page-level header used by listing pages (Blog, Projects).
 * Renders once; the parent toggles visibility per breakpoint so the
 * desktop sidebar and the mobile header no longer inline duplicate copy.
 */
export function ListingHeader({ title, description, className }: ListingHeaderProps) {
    return (
        <div className={className ?? "space-y-4"}>
            <h1 className="text-page-h1">{title}</h1>
            <p className="text-page-lead">{description}</p>
        </div>
    )
}
