export const NoServerSideRender =  ({ children }: { children: React.ReactNode }) => (
    <div suppressHydrationWarning>
        {typeof window === 'undefined' ? null : children}
    </div>
)