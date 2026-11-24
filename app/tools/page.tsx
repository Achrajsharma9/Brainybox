"use client"

import { Session } from 'inspector/promises';
import ToolsGrid from '../../components/ToolsGrid';
import { SessionProvider } from 'next-auth/react';

export default function ToolsPage() {
  return (
    <>
      <SessionProvider>
        <ToolsGrid />
      </SessionProvider>
    </>
  );
}