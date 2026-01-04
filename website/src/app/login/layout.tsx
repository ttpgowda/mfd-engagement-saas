import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Workspace Login - Wealth Insights',
    description: 'Login to your personalized Wealth Insights workspace. Access your dashboard, track your investments, and manage your financial portfolio securely.'
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
