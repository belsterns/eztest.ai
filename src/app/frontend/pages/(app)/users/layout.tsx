import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Users - EZTest.ai",
  description: "Users Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}