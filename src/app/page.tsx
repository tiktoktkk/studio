
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight font-headline">
          {t('welcomeToLoginFlow')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('loginFlowDescription')}
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg font-bold py-7 px-10">
            {t('viewLoginPage')}
          </Button>
        </Link>
      </div>
    </main>
  );
}
