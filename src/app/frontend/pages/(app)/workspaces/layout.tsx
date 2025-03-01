import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Workspaces",
  description: "Workspaces Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}