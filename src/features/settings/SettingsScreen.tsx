/**
 * SettingsScreen - App settings with functional interactions
 * H-06: Fixed non-functional buttons: Change MPIN works, others show proper feedback
 */
import React, { useState } from "react";
import { AppBar } from "../../components/layout/AppBar";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Button } from "../../components/ui/Button";
import { MPINInput } from "../../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../state/AuthContext";
import { login as loginService, updateMPIN } from "../../mock/services/authService";

type Modal = null | "change-mpin" | "coming-soon";

export function SettingsScreen() {
  const { user } = useAuth();
  const [modal, setModal] = useState<Modal>(null);
  const [comingSoonMsg, setComingSoonMsg] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [currentMpin, setCurrentMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [mpinStep, setMpinStep] = useState<"verify" | "new" | "confirm" | "done">("verify");
  const [mpinError, setMpinError] = useState("");
  const [mpinLoading, setMpinLoading] = useState(false);

  const openComingSoon = (feature: string) => {
    setComingSoonMsg(`${feature} is coming soon in a future update.`);
    setModal("coming-soon");
  };

  const openChangeMpin = () => {
    setCurrentMpin(""); setNewMpin(""); setConfirmMpin("");
    setMpinStep("verify"); setMpinError("");
    setModal("change-mpin");
  };

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
    try { await updateMPIN(user!.id, newMpin); setMpinStep("done"); }
    catch { setMpinError("Failed to update MPIN. Please try again."); }
    finally { setMpinLoading(false); }
  };

  const closeModal = () => {
    setModal(null);
    setCurrentMpin(""); setNewMpin(""); setConfirmMpin("");
    setMpinStep("verify"); setMpinError("");
  };

  const ACCOUNT_ITEMS = [
    { label: "Change MPIN", onClick: openChangeMpin, icon: "🔐" },
    { label: "Change Email", onClick: () => openComingSoon("Change Email"), icon: "✉️" },
    { label: "Update Mobile Number", onClick: () => openComingSoon("Update Mobile Number"), icon: "📱" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="Settings" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-4">
        <h1 className="text-h1 font-bold text-text-primary">Settings</h1>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Account</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              {ACCOUNT_ITEMS.map(item => (
                <button key={item.label} onClick={item.onClick} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-bg transition-colors">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-body font-semibold text-text-primary flex-1">{item.label}</span>
                  <span className="text-text-secondary">›</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-body-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Preferences</p>
            <div className="bg-white border border-border rounded-lg divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-base">🔔</span>
                  <span className="text-body font-semibold text-text-primary">Push Notifications</span>
                </div>
                <button role="switch" aria-checked={notificationsEnabled} onClick={() => setNotificationsEnabled(v => !v)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notificationsEnabled ? "bg-success" : "bg-border"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${notificationsEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>
              <button onClick={() => openComingSoon("Language selection")} className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors">
                <div className="flex items-center gap-3"><span className="text-base">🌐</span><span className="text-body font-semibold text-text-primary">Language</span></div>
                <span className="text-body-sm text-text-secondary">English ›</span>
              </button>
              <button onClick={() => openComingSoon("Dark Mode")} className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg transition-colors">
                <div className="flex items-center gap-3"><span className="text-base">🌙</span><span className="text-body font-semibold text-text-primary">Dark Mode</span></div>
                <span className="text-body-sm text-text-secondary">System ›</span>
              </button>
            </div>
          </div>
        </div>
      </ScreenContainer>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={e => e.target === e.currentTarget && closeModal()}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-2xl w-full max-w-[430px] px-6 py-6 pb-10">
              {modal === "change-mpin" && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h2 font-bold text-text-primary">Change MPIN</h2>
                    <button onClick={closeModal} className="text-text-secondary hover:text-text-primary text-2xl leading-none">&times;</button>
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
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center"><span className="text-3xl">✅</span></div>
                      <div><h3 className="text-h2 font-bold text-text-primary">MPIN Updated!</h3><p className="text-body text-text-secondary mt-1">Your MPIN has been changed successfully.</p></div>
                      <Button variant="primary" fullWidth size="lg" onClick={closeModal}>Done</Button>
                    </div>
                  )}
                </div>
              )}
              {modal === "coming-soon" && (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center"><span className="text-3xl">🚧</span></div>
                  <div><h2 className="text-h2 font-bold text-text-primary">Coming Soon</h2><p className="text-body text-text-secondary mt-2">{comingSoonMsg}</p></div>
                  <Button variant="primary" fullWidth size="lg" onClick={closeModal}>Got it</Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
