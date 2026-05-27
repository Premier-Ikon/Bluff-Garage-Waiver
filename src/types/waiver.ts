export type WaiverSubmission = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  signatureDataUrl: string;
  accepted: boolean;
  signedAt: string;
  /** Dev only — triggers simulated failure when ALLOW_TEST_FAIL is enabled on GCF */
  _testFail?: boolean;
};

export type WaiverSubmitSuccess = {
  ok: true;
  message?: string;
  notificationEmailSent?: boolean;
  result?: {
    mode?: string;
    spreadsheetId?: string;
    signatureLink?: string;
    signatureStoredInSheet?: boolean;
  };
};

export type WaiverSubmitError = {
  ok?: false;
  error?: string;
  details?: string;
  notificationEmailSent?: boolean;
  testFailure?: boolean;
};

export type WaiverSubmitResponse = WaiverSubmitSuccess | WaiverSubmitError;
