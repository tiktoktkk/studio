
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-8"
      style={{
        backgroundImage: `url("data:image/png;base64,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")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center space-y-6 bg-black bg-opacity-50 p-8 rounded-lg">
        <h1 className="text-5xl font-extrabold tracking-tight font-headline text-white">
          {t('welcomeToLoginFlow')}
        </h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
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
