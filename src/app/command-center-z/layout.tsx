export default function CommandCenterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            {children}
        </div>
    );
}
