/**
 * SettingsScreen - App settings with functional interactions
 */
import React, { useState, useEffect, useRef } from "react";
import { AppBar } from "../../components/layout/AppBar";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Button } from "../../components/ui/Button";
import { Input, MPINInput } from "../../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useAuth } from "../../state/AuthContext";
import { useLang, type Locale } from "../../state/LangContext";
import { useTheme, type ThemeMode } from "../../state/ThemeContext";
import {
  login as loginService,
  updateMPIN,
  changeEmail,
  changeMobile,
  requestOTP,
  verifyOTP,
  requestEmailOTP
} from "../../mock/services/authService";
import {
  Lock,
  Mail,
  Smartphone,
  Bell,
  Globe,
  Moon,
  ChevronRight,
  CheckCircle,
  Construction,
  X
} from "lucide-react";

type Modal = null | "change-mpin" | "change-email" | "update-mobile" | "language" | "appearance" | "coming-soon";

export function SettingsScreen() {
  const { user, refreshUser } = useAuth();
  const { locale, setLocale, t } = useLang();
  const { mode, setMode } = useTheme();

  const [modal, setModal] = useState<Modal>(null);
  const [comingSoonMsg, setComingSoonMsg] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // MPIN State
  const [currentMpin, setCurrentMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [mpinStep, setMpinStep] = useState<"verify" | "new" | "confirm" | "done">("verify");
  const [mpinError, setMpinError] = useState("");
  const [mpinLoading, setMpinLoading] = useState(false);

  // Email State
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailChallengeId, setEmailChallengeId] = useState("");
  const [emailStep, setEmailStep] = useState<"input" | "otp" | "done">("input");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Mobile State
  const [newMobile, setNewMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [mobileStep, setMobileStep] = useState<"input" | "otp" | "done">("input");
  const [mobileError, setMobileError] = useState("");
  const [mobileLoading, setMobileLoading] = useState(false);

  // Modal Focus Trap Ref
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modal && modalRef.current) {
      // Focus first focusable element
      const focusable = modalRef.current.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) {
        setTimeout(() => focusable.focus(), 50); // slight delay to allow animation
      }
    }
  }, [modal, mpinStep, emailStep, mobileStep]);

  // Focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modal || !modalRef.current) return;
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal]);

  const openComingSoon = (feature: string) => {
    setComingSoonMsg(`${feature} is coming soon in a future update.`);
    setModal("coming-soon");
  };

  const openChangeMpin = () => {
    setCurrentMpin(""); setNewMpin(""); setConfirmMpin("");
    setMpinStep("verify"); setMpinError("");
    setModal("change-mpin");
  };

  const openChangeEmail = () => {
    setNewEmail(""); setEmailOtp(""); setEmailChallengeId(""); setEmailError(""); setEmailStep("input");
    setModal("change-email");
  };

  const openUpdateMobile = () => {
    setNewMobile(""); setOtp(""); setChallengeId(""); setMobileError(""); setMobileStep("input");
    setModal("update-mobile");
  };

  const openLanguage = () => {
    setModal("language");
  };

  const openAppearance = () => {
    setModal("appearance");
  };

  // --- MPIN Logic ---
  const handleVerifyCurrentMpin = async () => {
    if (currentMpin.length < 6) { setMpinError("Enter all 6 digits."); return; }
    setMpinLoading(true); setMpinError("");
    try {
      await loginService(user!.mobileNumber, currentMpin);
      setMpinStep("new");
    } catch {
      setMpinError("Incorrect MPIN. Please try again.");
      setCurrentMpin("");
    } finally { setMpinLoading(false); }
  };

  const handleSetNewMpin = () => {
    if (newMpin.length < 6) { setMpinError("Enter all 6 digits."); return; }
    if (/^(.)\1+$/.test(newMpin)) { setMpinError("MPIN cannot be all the same digit."); return; }
    setMpinError(""); setMpinStep("confirm");
  };

  const handleConfirmNewMpin = async () => {
    if (confirmMpin !== newMpin) { setMpinError("MPINs do not match."); setConfirmMpin(""); return; }
    setMpinLoading(true); setMpinError("");
    try { 
      await updateMPIN(user!.id, currentMpin, newMpin); 
      setMpinStep("done"); 
    }
    catch (err: any) { setMpinError(err.message || "Failed to update MPIN. Please try again."); }
    finally { setMpinLoading(false); }
  };

  // --- Email Logic ---
  const handleUpdateEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError("Enter a valid email address."); return;
    }
    setEmailLoading(true); setEmailError("");
    try {
      const res = await requestEmailOTP(newEmail, 'update');
      setEmailChallengeId(res.challengeId);
      setEmailStep("otp");
    } catch (err: any) {
      setEmailError(err.message || "Failed to request OTP.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (emailOtp.length < 6) { setEmailError("Enter the 6-digit OTP."); return; }
    setEmailLoading(true); setEmailError("");
    try {
      await verifyOTP(emailChallengeId, emailOtp);
      await changeEmail(user!.id, newEmail, emailChallengeId);
      refreshUser();
      setEmailStep("done");
    } catch (err: any) {
      setEmailError(err.message || "Invalid OTP.");
    } finally {
      setEmailLoading(false);
    }
  };

  // --- Mobile Logic ---
  const handleUpdateMobile = async () => {
    if (!newMobile.match(/^9\d{9}$/)) {
      setMobileError("Enter a valid 10-digit mobile number."); return;
    }
    setMobileLoading(true); setMobileError("");
    try {
      const res = await requestOTP(newMobile, 'update');
      setChallengeId(res.challengeId);
      setMobileStep("otp");
    } catch (err: any) {
      setMobileError(err.message || "Failed to request OTP.");
    } finally {
      setMobileLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) { setMobileError("Enter the 6-digit OTP."); return; }
    setMobileLoading(true); setMobileError("");
    try {
      await verifyOTP(challengeId, otp);
      await changeMobile(user!.id, newMobile, challengeId);
      refreshUser();
      setMobileStep("done");
    } catch (err: any) {
      setMobileError(err.message || "Invalid OTP.");
    } finally {
      setMobileLoading(false);
    }
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBar title={t("settings.title")} showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-4 pb-20">
        <h1 className="text-h1 font-bold text-text-primary">{t("settings.title")}</h1>
        <div className="flex flex-col gap-6">
          
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">{t("settings.account")}</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              <button onClick={openChangeMpin} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-bg transition-colors">
                <Lock size={20} className="text-primary shrink-0" aria-hidden="true" />
                <span className="text-body font-semibold text-text-primary flex-1">{t("settings.changeMPIN")}</span>
                <ChevronRight size={18} className="text-text-secondary shrink-0" aria-hidden="true" />
              </button>
              <button onClick={openChangeEmail} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-bg transition-colors">
                <Mail size={20} className="text-primary shrink-0" aria-hidden="true" />
                <span className="text-body font-semibold text-text-primary flex-1">{t("settings.changeEmail")}</span>
                <ChevronRight size={18} className="text-text-secondary shrink-0" aria-hidden="true" />
              </button>
              <button onClick={openUpdateMobile} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-bg transition-colors">
                <Smartphone size={20} className="text-primary shrink-0" aria-hidden="true" />
                <span className="text-body font-semibold text-text-primary flex-1">{t("settings.updateMobile")}</span>
                <ChevronRight size={18} className="text-text-secondary shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">{t("settings.preferences")}</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-primary shrink-0" aria-hidden="true" />
                  <span className="text-body font-semibold text-text-primary">{t("settings.notifications")}</span>
                </div>
                <button role="switch" aria-checked={notificationsEnabled} onClick={() => setNotificationsEnabled(v => !v)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notificationsEnabled ? "bg-success" : "bg-border"}`}
                  aria-label="Toggle push notifications"
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${notificationsEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>
              <button onClick={openLanguage} className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-primary shrink-0" aria-hidden="true" />
                  <span className="text-body font-semibold text-text-primary">{t("settings.language")}</span>
                </div>
                <span className="text-body-sm text-text-secondary flex items-center gap-1">
                  {locale === 'en' ? t("settings.english") : t("settings.filipino")} 
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              </button>
              <button onClick={openAppearance} className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-primary shrink-0" aria-hidden="true" />
                  <span className="text-body font-semibold text-text-primary">{t("settings.appearance")}</span>
                </div>
                <span className="text-body-sm text-text-secondary flex items-center gap-1">
                  <span className="capitalize">{t(`settings.${mode}` as any)}</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </ScreenContainer>

      {/* Main content inert when modal is open for a11y */}
      {createPortal(
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40"
              role="dialog"
              aria-modal="true"
              onClick={e => e.target === e.currentTarget && closeModal()}
            >
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-2xl w-full px-6 py-6 pb-safe relative overflow-hidden max-h-[90vh] overflow-y-auto"
                ref={modalRef}
                onClick={e => e.stopPropagation()}
              >
                {modal === "change-mpin" && (
                <div className="flex flex-col gap-5 pb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h2 font-bold text-text-primary">{t("settings.changeMPIN")}</h2>
                    <button onClick={closeModal} className="text-text-secondary hover:text-text-primary text-2xl leading-none" aria-label="Close">&times;</button>
                  </div>
                  {mpinStep === "verify" && (<>
                    <p className="text-body text-text-secondary">Enter your current MPIN to continue.</p>
                    <MPINInput value={currentMpin} onChange={v => { setCurrentMpin(v); setMpinError(""); }} error={mpinError} />
                    <Button variant="primary" fullWidth size="lg" isLoading={mpinLoading} onClick={handleVerifyCurrentMpin} disabled={currentMpin.length < 6}>Verify Current MPIN</Button>
                  </>)}
                  {mpinStep === "new" && (<>
                    <p className="text-body text-text-secondary">Enter your new 6-digit MPIN.</p>
                    <MPINInput value={newMpin} onChange={v => { setNewMpin(v); setMpinError(""); }} error={mpinError} />
                    <Button variant="primary" fullWidth size="lg" onClick={handleSetNewMpin} disabled={newMpin.length < 6}>Set New MPIN</Button>
                  </>)}
                  {mpinStep === "confirm" && (<>
                    <p className="text-body text-text-secondary">Confirm your new MPIN.</p>
                    <MPINInput value={confirmMpin} onChange={v => { setConfirmMpin(v); setMpinError(""); }} error={mpinError} />
                    <Button variant="primary" fullWidth size="lg" isLoading={mpinLoading} onClick={handleConfirmNewMpin} disabled={confirmMpin.length < 6}>Confirm MPIN</Button>
                  </>)}
                  {mpinStep === "done" && (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle size={32} className="text-success" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-h2 font-bold text-text-primary">MPIN Updated!</h3>
                        <p className="text-body text-text-secondary mt-1">Your MPIN has been changed successfully.</p>
                      </div>
                      <Button variant="primary" fullWidth size="lg" onClick={closeModal}>{t("action.done")}</Button>
                    </div>
                  )}
                </div>
              )}

              {modal === "change-email" && (
                <div className="flex flex-col gap-5 pb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h2 font-bold text-text-primary">{t("settings.changeEmail")}</h2>
                    <button onClick={closeModal} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close"><X size={20} /></button>
                  </div>
                  {emailStep === "input" && (<>
                    <p className="text-body text-text-secondary">Enter your new email address.</p>
                    <Input
                      label="New Email Address"
                      type="email"
                      placeholder="e.g. juan@example.com"
                      value={newEmail}
                      onChange={(e) => { setNewEmail(e.target.value); setEmailError(""); }}
                      error={emailError}
                      autoFocus
                    />
                    <div className="bg-primary-light rounded-lg px-4 py-3 mt-4">
                      <p className="text-body-sm text-primary font-medium">We will send a one-time password (OTP) to this email to verify it.</p>
                    </div>
                    <Button variant="primary" fullWidth size="lg" isLoading={emailLoading} onClick={handleUpdateEmail} disabled={!newEmail} className="mt-4">Send OTP</Button>
                  </>)}
                  {emailStep === "otp" && (<>
                    <p className="text-body text-text-secondary">Enter the 6-digit OTP sent to {newEmail}. (Demo: 123456)</p>
                    <Input
                      label="6-digit OTP"
                      type="number"
                      placeholder="123456"
                      value={emailOtp}
                      onChange={(e) => { setEmailOtp(e.target.value); setEmailError(""); }}
                      error={emailError}
                      maxLength={6}
                      autoFocus
                    />
                    <Button variant="primary" fullWidth size="lg" isLoading={emailLoading} onClick={handleVerifyEmailOTP} disabled={emailOtp.length < 6} className="mt-4">Verify OTP</Button>
                  </>)}
                  {emailStep === "done" && (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle size={32} className="text-success" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-h2 font-bold text-text-primary">Email Updated!</h3>
                        <p className="text-body text-text-secondary mt-1">Your email has been changed to {newEmail}.</p>
                      </div>
                      <Button variant="primary" fullWidth size="lg" onClick={closeModal}>{t("action.done")}</Button>
                    </div>
                  )}
                </div>
              )}

              {modal === "update-mobile" && (
                <div className="flex flex-col gap-5 pb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h2 font-bold text-text-primary">{t("settings.updateMobile")}</h2>
                    <button onClick={closeModal} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close"><X size={20} /></button>
                  </div>
                  {mobileStep === "input" && (<>
                    <p className="text-body text-text-secondary">Enter your new Philippine mobile number.</p>
                    <Input
                      label="New Mobile Number"
                      type="tel"
                      placeholder="9XXXXXXXXX"
                      value={newMobile}
                      onChange={(e) => { setNewMobile(e.target.value); setMobileError(""); }}
                      error={mobileError}
                      leftIcon={<span className="text-text-secondary text-body-sm font-semibold">+63</span>}
                      maxLength={10}
                      autoFocus
                    />
                    <div className="bg-primary-light rounded-lg px-4 py-3">
                      <p className="text-body-sm text-primary font-medium">We will send a one-time password (OTP) to this number to verify it.</p>
                    </div>
                    <Button variant="primary" fullWidth size="lg" isLoading={mobileLoading} onClick={handleUpdateMobile} disabled={!newMobile}>Send OTP</Button>
                  </>)}
                  {mobileStep === "otp" && (<>
                    <p className="text-body text-text-secondary">Enter the 6-digit OTP sent to +63 {newMobile}. (Demo: 123456)</p>
                    <Input
                      label="6-digit OTP"
                      type="number"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setMobileError(""); }}
                      error={mobileError}
                      maxLength={6}
                      autoFocus
                    />
                    <Button variant="primary" fullWidth size="lg" isLoading={mobileLoading} onClick={handleVerifyOTP} disabled={otp.length < 6}>Verify OTP</Button>
                  </>)}
                  {mobileStep === "done" && (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle size={32} className="text-success" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-h2 font-bold text-text-primary">Mobile Number Updated!</h3>
                        <p className="text-body text-text-secondary mt-1">Your mobile number has been successfully verified and updated.</p>
                      </div>
                      <Button variant="primary" fullWidth size="lg" onClick={closeModal}>{t("action.done")}</Button>
                    </div>
                  )}
                </div>
              )}

              {modal === "language" && (
                <div className="flex flex-col gap-4 pb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h2 font-bold text-text-primary">{t("settings.language")}</h2>
                    <button onClick={closeModal} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close"><X size={20} /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setLocale("en"); closeModal(); }}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${locale === "en" ? "border-primary bg-primary-light text-primary" : "border-border bg-white text-text-primary"}`}
                    >
                      <span className="font-semibold">{t("settings.english")}</span>
                      {locale === "en" && <CheckCircle size={20} />}
                    </button>
                    <button 
                      onClick={() => { setLocale("fil"); closeModal(); }}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${locale === "fil" ? "border-primary bg-primary-light text-primary" : "border-border bg-white text-text-primary"}`}
                    >
                      <span className="font-semibold">{t("settings.filipino")}</span>
                      {locale === "fil" && <CheckCircle size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {modal === "appearance" && (
                <div className="flex flex-col gap-4 pb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h2 font-bold text-text-primary">{t("settings.appearance")}</h2>
                    <button onClick={closeModal} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close"><X size={20} /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(["system", "light", "dark"] as ThemeMode[]).map((m) => (
                      <button 
                        key={m}
                        onClick={() => { setMode(m); closeModal(); }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${mode === m ? "border-primary bg-primary-light text-primary" : "border-border bg-white text-text-primary"}`}
                      >
                        <span className="font-semibold capitalize">{t(`settings.${m}` as any)}</span>
                        {mode === m && <CheckCircle size={20} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modal === "coming-soon" && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <Construction size={32} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-h2 font-bold text-text-primary">Coming Soon</h2>
                    <p className="text-body text-text-secondary mt-2">{comingSoonMsg}</p>
                  </div>
                  <Button variant="primary" fullWidth size="lg" onClick={closeModal}>Got it</Button>
                </div>
              )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
