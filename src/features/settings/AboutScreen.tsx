/**
 * AboutScreen — App information and disclaimer
 */
import React from 'react';
import { AppBar } from '../../components/layout/AppBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

export function AboutScreen() {
  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="About eGovPH" showBack />
      <div className="bp-stripe" aria-hidden="true" />
      <ScreenContainer className="pt-4 gap-5">
        <div className="flex flex-col items-center gap-2 text-center py-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <span className="text-white text-3xl font-bold">e</span>
          </div>
          <h1 className="text-h1 font-bold text-text-primary">eGovPH Super App</h1>
          <p className="text-body-sm text-text-secondary">Version 1.0.0 (Research Prototype)</p>
        </div>

        <div className="bg-error/10 border border-error/30 rounded-lg p-4">
          <h2 className="text-body font-bold text-error mb-2">⚠ DISCLAIMER: ACADEMIC PROTOTYPE ONLY</h2>
          <p className="text-body-sm text-error/90 font-medium">
            This is a mock application created strictly for an academic Human-Computer Interaction (HCI) research project.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-body-sm text-error/80">
            <li>It is NOT the official eGovPH app.</li>
            <li>It is NOT affiliated with, endorsed, or operated by the Philippine government, DICT, or any government agency.</li>
            <li>Do NOT enter real personal data, real PhilSys numbers, or real passwords. Any data entered is stored only locally on this device for the duration of the usability test.</li>
          </ul>
        </div>
        
        <div className="bg-white border border-border rounded-lg p-4 text-body-sm text-text-secondary space-y-3">
          <p>
            <strong>Research Purpose:</strong> This prototype evaluates navigation and task flows as part of a task-based usability study.
          </p>
          <p>
            <strong>Data Handling:</strong> All data is strictly mock data saved in localStorage. No data is transmitted to any server.
          </p>
        </div>
      </ScreenContainer>
    </div>
  );
}
