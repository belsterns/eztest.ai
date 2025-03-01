import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "EZTest.AI LogIn",
    description: "EZTest.AI LogIn Page",
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}