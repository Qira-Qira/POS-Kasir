import { Clock, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { AuthState, ViewKey } from "../../types";

interface AppShellProps {
  auth: AuthState | null;
  activeView: ViewKey;
  currentRoleLabel: string;
  currentTime: string;
  isDarkMode: boolean;
  visibleNavItems: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[];
  setActiveView: (value: ViewKey) => void;
  setIsDarkMode: (value: boolean) => void;
  handleLogout: () => void;
  children: ReactNode;
  sidebar?: ReactNode;
}

export function AppShell({
  auth,
  activeView,
  currentRoleLabel,
  currentTime,
  isDarkMode,
  visibleNavItems,
  setActiveView,
  setIsDarkMode,
  handleLogout,
  children,
  sidebar,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const appShellClass = isDarkMode ? "bg-[#0f172a] text-[#f8fafc]" : "bg-[radial-gradient(circle_at_top,_#f7efe7,_#f0e2d3_38%,_#e8d4b5_100%)] text-[#1f2937]";
  const appPanelClass = isDarkMode ? "border-[#2f3747] bg-[#111827]/95" : "border-[#e9d8c2] bg-[#fffaf5]/95";
  const appSidebarClass = isDarkMode ? "border-[#2f3747] bg-[#111827]" : "border-[#ead8c1] bg-[#f7efe6]";
  const appHeaderClass = isDarkMode ? "border-[#2f3747] bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)]" : "border-[#eedcc7] bg-[linear-gradient(135deg,#fffaf5_0%,#f8eee4_100%)]";

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${appShellClass}`}>
      <div className={`mx-auto flex h-auto w-full max-w-[1600px] min-w-0 flex-col overflow-hidden rounded-[28px] border shadow-[0_40px_90px_rgba(70,42,28,0.16)] backdrop-blur-sm xl:h-[calc(100vh-2rem)] xl:flex-row ${appPanelClass}`}>
        <aside className={`hidden w-[220px] flex-col justify-between border-r p-3 xl:flex ${appSidebarClass}`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf5] px-3 py-3 shadow-[0_10px_20px_rgba(74,49,36,0.05)]">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c4a2d] text-lg font-bold text-[#fffaf5] shadow-[0_12px_20px_rgba(124,74,45,0.18)]">
            G
          </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Cafe</p>
                <p className="truncate text-sm font-semibold text-[#2b1d18]">Gumbira Loka</p>
                <p className="text-[10px] font-medium text-[#8d6d5a]">{currentRoleLabel}</p>
              </div>
            </div>

            <nav className="mt-2 flex w-full flex-col gap-2">
              {visibleNavItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveView(key)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                    activeView === key
                      ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_10px_18px_rgba(124,74,45,0.18)]"
                      : "bg-[#f3e7d9] text-[#5c463b] hover:bg-[#e9d7c2]"
                  }`}
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ead8c1] bg-[#fffaf5] px-3 py-3 text-sm font-medium text-[#4d382f] transition hover:bg-[#f5ebdf]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className={`relative overflow-hidden border-b px-4 py-4 sm:px-6 sm:py-5 ${appHeaderClass}`}>
            <div className="absolute inset-y-0 right-0 w-56 bg-[radial-gradient(circle,_rgba(124,74,45,0.10),_transparent_65%)]" />
            <div className="relative flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8c1] bg-[#fffaf5]/80 text-[#5d4235] shadow-sm xl:hidden"
                aria-label="Buka menu navigasi"
                title="Menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs sm:text-sm font-medium shadow-inner whitespace-nowrap ${
                    isDarkMode ? "bg-[#1f2937] text-[#f3f4f6] shadow-[#0b1220]" : "bg-[#f3e6d9] text-[#534036] shadow-[#f0e2d6]"
                  }`}
                  title={currentTime}
                >
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{currentTime}</span>
                  <span className="sm:hidden">{currentTime.split(",")[1]?.trim()}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#ead8c1] bg-[#fffaf5]/80 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(false)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      !isDarkMode ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_8px_18px_rgba(124,74,45,0.20)]" : "text-[#5d4337] hover:bg-[#f3e7d9]"
                    }`}
                    aria-label="Light mode"
                    title="Light mode"
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(true)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      isDarkMode ? "bg-[#1f2937] text-[#f3f4f6] shadow-[0_8px_18px_rgba(17,24,39,0.20)]" : "text-[#5d4337] hover:bg-[#f3e7d9]"
                    }`}
                    aria-label="Dark mode"
                    title="Dark mode"
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="relative mt-4 space-y-2 xl:hidden">
                <div className="grid gap-2 sm:grid-cols-2">
                  {visibleNavItems.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveView(key);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                        activeView === key
                          ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_10px_18px_rgba(124,74,45,0.18)]"
                          : "bg-[#f3e7d9] text-[#5c463b]"
                      }`}
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ead8c1] bg-[#fffaf5] px-3 py-2.5 text-sm font-medium text-[#4d382f]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">{children}</div>
        </div>

        {sidebar}
      </div>
    </div>
  );
}
