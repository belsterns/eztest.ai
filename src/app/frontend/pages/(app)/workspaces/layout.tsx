import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "All Workspaces - EZTest.ai",
  description: "All Workspaces Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}