import { LoginForm } from "@/components/login-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <div className="flex justify-center items-center gap-4">
            <Select defaultValue="en-us">
              <SelectTrigger className="w-auto h-auto p-0 border-none bg-transparent focus:ring-0 text-muted-foreground hover:text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
            <span>© 2025 LoginFlow</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
