
'use client';

import { LoginForm } from "@/components/login-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { languages, Language } from "@/lib/translations";

export default function LoginPage() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as Language);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <div className="flex justify-center items-center gap-4">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto h-auto p-0 border-none bg-transparent focus:ring-0 text-muted-foreground hover:text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>{t('copyright')}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
