import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "All Repositories",
    description: "Repositories Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}