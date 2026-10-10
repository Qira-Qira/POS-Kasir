import { Button } from "../ui/button";
import { Input } from "../ui/input";

type LoginForm = {
  username: string;
  password: string;
};

type LoginScreenProps = {
  isDarkMode: boolean;
  loginForm: LoginForm;
  loginError: string;
  onLogin: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof LoginForm, value: string) => void;
};

export function LoginScreen({
  isDarkMode,
  loginForm,
  loginError,
  onLogin,
  onChange,
}: LoginScreenProps) {
  const shellClass = isDarkMode
    ? "bg-[#111827] text-[#f3f4f6]"
    : "bg-[radial-gradient(circle_at_top,_#f7efe7,_#f0e2d3_38%,_#e8d4b5_100%)] text-[#1f2937]";

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 sm:p-6 ${shellClass}`}>
      <div
        className={`w-full max-w-md rounded-[28px] border p-6 shadow-[0_40px_90px_rgba(70,42,28,0.16)] backdrop-blur-sm ${
          isDarkMode ? "border-[#2f3747] bg-[#1f2937]/95" : "border-[#ebdcc7] bg-[#fffaf5]/95"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c4a2d] text-lg font-bold text-[#fffaf5] shadow-[0_12px_20px_rgba(124,74,45,0.18)]">
            G
          </div>
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${isDarkMode ? "text-[#d9cab6]" : "text-[#8d6d5a]"}`}>
              Cafe
            </p>
            <h1 className={`mt-1 text-xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>
              Gumbira Loka
            </h1>
          </div>
        </div>

        <form onSubmit={onLogin} className="mt-6 space-y-4">
          <div>
            <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>Login</h2>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? "text-[#e5e7eb]" : "text-[#4d382f]"}`}>Username</label>
            <Input
              value={loginForm.username}
              onChange={(event) => onChange("username", event.target.value)}
              placeholder="Masukkan username"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? "text-[#e5e7eb]" : "text-[#4d382f]"}`}>Password</label>
            <Input
              type="password"
              value={loginForm.password}
              onChange={(event) => onChange("password", event.target.value)}
              placeholder="Masukkan password"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
            />
          </div>

          {loginError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {loginError}
            </div>
          )}

          <Button type="submit" className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] shadow-[0_18px_25px_rgba(124,74,45,0.18)] hover:bg-[#6d3f2a]">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
