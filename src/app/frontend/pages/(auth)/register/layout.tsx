import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "EZTest.AI Register",
    description: "EZTest.AI Register Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}